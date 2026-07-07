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

// Простой лимитер по IP на попытки входа (tg-login/set-nick): окно 60с, до 20 запросов.
// Если IP определить не удалось (нет заголовка CF-Connecting-IP) — не блокируем.
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 20;

async function checkRateLimit(env, request) {
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return true;
  const key = `rl:auth:${ip}`;
  const count = parseInt((await env.CHAT.get(key)) || "0", 10) || 0;
  if (count >= RATE_LIMIT_MAX) return false;
  await env.CHAT.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  return true;
}

export async function onRequestPost({ env, params, request }) {
  const action = params.action;

  if (action === "logout") {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (/^[0-9a-f]{64}$/.test(token)) {
      await env.CHAT.delete(`session:${token}`);
    }
    // Идемпотентно: даже без токена/сессии отвечаем ok.
    return Response.json({ ok: true });
  }

  if (action === "tg-login") {
    if (!(await checkRateLimit(env, request))) {
      return Response.json({ error: "rate_limited" }, { status: 429 });
    }
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
    const { tgId } = JSON.parse(raw);
    await env.CHAT.delete(`login:${code}`); // ссылка одноразовая

    const nick = await env.CHAT.get(`tgid:${tgId}`);
    if (!nick) {
      // Аккаунта ещё нет — пользователь должен придумать ник (set-nick).
      const regToken = toHex(crypto.getRandomValues(new Uint8Array(16)));
      await env.CHAT.put(`reg:${regToken}`, tgId, { expirationTtl: 300 });
      return Response.json({ ok: true, needsNick: true, regToken });
    }
    const token = await createSession(env, nick);
    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
    return Response.json({ ok: true, nick: "@" + nick, token, balance: acc.balance || 0 });
  }

  if (action === "set-nick") {
    if (!(await checkRateLimit(env, request))) {
      return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "bad_json" }, { status: 400 });
    }
    const regToken = String(body.regToken || "");
    if (!/^[0-9a-f]{32}$/.test(regToken)) return Response.json({ ok: false, error: "expired" }, { status: 400 });
    const tgId = await env.CHAT.get(`reg:${regToken}`);
    if (!tgId) return Response.json({ ok: false, error: "expired" }, { status: 410 });

    const nick = String(body.nick || "");
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(nick)) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

    // На случай гонки: у этого tgId уже мог появиться ник между reg и set-nick.
    const alreadyNick = await env.CHAT.get(`tgid:${tgId}`);
    if (alreadyNick) {
      await env.CHAT.delete(`reg:${regToken}`);
      const token = await createSession(env, alreadyNick);
      const acc = JSON.parse((await env.CHAT.get(`unick:${alreadyNick}`)) || "{}");
      return Response.json({ ok: true, nick: "@" + alreadyNick, token, balance: acc.balance || 0 });
    }

    const taken = await env.CHAT.get(`unick:${nick}`);
    if (taken) return Response.json({ ok: false, error: "taken" }, { status: 409 });

    await env.CHAT.put(`unick:${nick}`, JSON.stringify({ tgId, balance: 0, created: Date.now(), listingsPublic: true }));
    await env.CHAT.put(`tgid:${tgId}`, nick);
    await env.CHAT.delete(`reg:${regToken}`);

    const token = await createSession(env, nick);
    return Response.json({ ok: true, nick: "@" + nick, token, balance: 0 });
  }

  if (action === "me") {
    const nick = await getSessionNick(env, request);
    if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });
    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
    return Response.json({
      ok: true,
      nick: "@" + nick,
      balance: acc.balance || 0,
      tgId: acc.tgId || null,
      created: acc.created || null,
      listingsPublic: acc.listingsPublic !== false,
    });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}
