// Вход только через Telegram: бот выдаёт одноразовую ссылку с кодом,
// сайт обменивает код на сессию.

const SESSION_TTL = 60 * 60 * 24 * 30; // сессия живёт 30 дней

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function createSession(env, nick) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  await env.CHAT.put(`session:${token}`, nick, { expirationTtl: SESSION_TTL });
  return token;
}

async function getSessionNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

export async function onRequestPost({ env, params, request }) {
  const action = params.action;

  if (action === "tg-login") {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "bad_json" }, { status: 400 });
    }
    const code = String(body.code || "");
    if (!/^[0-9a-f]{32}$/.test(code)) return Response.json({ error: "bad_code" }, { status: 400 });
    const raw = await env.CHAT.get(`login:${code}`);
    if (!raw) return Response.json({ error: "expired" }, { status: 410 });
    const { nick } = JSON.parse(raw);
    await env.CHAT.delete(`login:${code}`); // ссылка одноразовая
    const token = await createSession(env, nick);
    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
    return Response.json({ ok: true, nick: "@" + nick, token, balance: acc.balance || 0 });
  }

  if (action === "me") {
    const nick = await getSessionNick(env, request);
    if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });
    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
    return Response.json({ ok: true, nick: "@" + nick, balance: acc.balance || 0 });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}
