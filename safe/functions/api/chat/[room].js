const MAX_BODY = 8 * 1024 * 1024; // 8 МБ на сообщение с медиа
const MEDIA_TTL = 60 * 60 * 24 * 30; // медиа храним 30 дней

// Белый список безопасных MIME-типов вложений. Никаких text/html, image/svg+xml,
// application/xhtml+xml и прочих потенциально исполняемых типов — иначе через
// /api/media/:id можно отдать активный контент с своего origin (XSS).
const SAFE_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "application/pdf",
]);

const room = (env, name) => env.CHAT_DO.get(env.CHAT_DO.idFromName(name));

async function sessionNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

// Комнаты сделок (deal_<id>) приватны: доступ только покупателю и продавцу
// этой конкретной сделки. Остальные комнаты (general, легаси-демо) — общее
// лобби, доступное любому авторизованному пользователю.
async function checkRoomAccess(env, roomName, nick) {
  if (!roomName.startsWith("deal_")) return { ok: true };
  const dealId = roomName.slice(5);
  const raw = await env.CHAT.get(`deal:${dealId}`);
  if (!raw) return { ok: false, status: 404, error: "not_found" };
  let deal;
  try {
    deal = JSON.parse(raw);
  } catch {
    return { ok: false, status: 404, error: "not_found" };
  }
  if (deal.buyer !== nick && deal.seller !== nick) {
    return { ok: false, status: 403, error: "forbidden" };
  }
  return { ok: true };
}

export async function onRequestGet({ env, params, request }) {
  const nick = await sessionNick(env, request);
  if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });

  const access = await checkRoomAccess(env, params.room, nick);
  if (!access.ok) return Response.json({ error: access.error }, { status: access.status });

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
  const access = await checkRoomAccess(env, params.room, nick);
  if (!access.ok) return Response.json({ error: access.error }, { status: access.status });
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
    // Тип берём из тела клиента, но доверять ему нельзя — приводим к безопасному
    // белому списку. Всё, чего нет в списке (в т.ч. text/html, image/svg+xml),
    // становится application/octet-stream — отдаваться будет только на скачивание.
    const declaredType = String(rawMedia.type || "").toLowerCase().split(";")[0].trim();
    const type = SAFE_MEDIA_TYPES.has(declaredType) ? declaredType : "application/octet-stream";
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
