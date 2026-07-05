const MAX_BODY = 8 * 1024 * 1024; // 8 МБ на сообщение с медиа
const MEDIA_TTL = 60 * 60 * 24 * 30; // медиа храним 30 дней

const room = (env, name) => env.CHAT_DO.get(env.CHAT_DO.idFromName(name));

async function sessionNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

export async function onRequestGet({ env, params, request }) {
  const url = new URL(request.url);
  const since = Number(url.searchParams.get("since") || 0);
  const msgs = await room(env, params.room).getMessages(since);
  return Response.json({ msgs });
}

export async function onRequestPost({ env, params, request }) {
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const nick = await sessionNick(env, request);
  if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (await env.CHAT.get(`ban:${nick}`)) {
    return Response.json({ error: "banned" }, { status: 403 });
  }
  const from = "@" + nick;
  // Флаг верификации берётся только с сервера — клиент не может его подделать
  const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
  const verified = acc.verified === true;
  const text = String(body.text || "").slice(0, 4000);
  const rawMedia = body.media && typeof body.media === "object" ? body.media : null;
  if (!text && !rawMedia) return Response.json({ error: "empty" }, { status: 400 });

  const id = crypto.randomUUID();
  let media = null;
  if (rawMedia) {
    const data = String(rawMedia.data || "");
    if (!/^data:[\w.+-]+\/[\w.+-]+;base64,/.test(data)) {
      return Response.json({ error: "bad_media" }, { status: 400 });
    }
    const type = String(rawMedia.type || "application/octet-stream").slice(0, 60);
    const name = String(rawMedia.name || "file").slice(0, 120);
    await env.CHAT.put(`media:${id}`, JSON.stringify({ type, name, data }), { expirationTtl: MEDIA_TTL });
    media = { type, name, url: `/api/media/${id}`, data };
  }

  // В сообщении внутри DO храним только ссылку на медиа (лимит значения DO — 128 КБ)
  const msg = { id, from, verified, text, media: media ? { type: media.type, name: media.name, url: media.url } : null, ts: Date.now() };
  await room(env, params.room).addMessage(msg);
  // Отправителю возвращаем медиа с данными, чтобы оно сразу отобразилось
  return Response.json({ ok: true, msg: { ...msg, media } });
}
