// Панель поддержки: сотрудники входят по логину и паролю (PBKDF2-хеш на сервере),
// тикеты распределяются по отделам. Аккаунты сотрудников создаёт только владелец.

const STAFF_SESSION_TTL = 60 * 60 * 12; // смена сотрудника — 12 часов
const DEPTS = ["verification", "sales", "ban", "other"];

const LOGIN_RL_WINDOW = 60; // секунд
const LOGIN_RL_LIMIT = 10; // попыток входа сотрудника с одного IP за окно

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hashPassword(password, saltHex) {
  const salt = saltHex
    ? new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 },
    keyMaterial,
    256
  );
  return { salt: toHex(salt), hash: toHex(bits) };
}

async function getStaff(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  const login = await env.CHAT.get(`ssession:${token}`);
  if (!login) return null;
  const staff = JSON.parse((await env.CHAT.get(`staff:${login}`)) || "null");
  return staff ? { login, ...staff } : null;
}

// Простой счётчик попыток входа по IP в KV с фиксированным окном.
// Возвращает true, если лимит уже превышен (запрос нужно отклонить).
async function loginRateLimited(env, request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `rl:slogin:${ip}`;
  const count = Number((await env.CHAT.get(key)) || 0);
  if (count >= LOGIN_RL_LIMIT) return true;
  await env.CHAT.put(key, String(count + 1), { expirationTtl: LOGIN_RL_WINDOW });
  return false;
}

// Сравнение строк за постоянное время (насколько это возможно в JS) — чтобы не
// давать атакующему таймингом угадать секрет бутстрапа побайтово.
function timingSafeEqualStr(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ab.length, bb.length, 1);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (ab[i] || 0) ^ (bb[i] || 0);
  return diff === 0;
}

async function getUserNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

export async function onRequestPost({ env, params, request }) {
  const action = params.action;
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // ---- Вход сотрудника ----
  if (action === "login") {
    if (await loginRateLimited(env, request)) {
      return Response.json({ error: "rate_limited" }, { status: 429 });
    }
    const login = String(body.login || "").toLowerCase();
    const password = String(body.password || "");
    if (!/^[a-z0-9_]{3,32}$/.test(login) || !password) return Response.json({ error: "bad_credentials" }, { status: 400 });
    const staff = JSON.parse((await env.CHAT.get(`staff:${login}`)) || "null");
    if (!staff) return Response.json({ error: "bad_credentials" }, { status: 401 });
    const { hash } = await hashPassword(password, staff.salt);
    if (hash !== staff.hash) return Response.json({ error: "bad_credentials" }, { status: 401 });
    const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
    await env.CHAT.put(`ssession:${token}`, login, { expirationTtl: STAFF_SESSION_TTL });
    return Response.json({ ok: true, token, login, dept: staff.dept, role: staff.role });
  }

  // ---- Создание тикета пользователем сайта (нужен вход через Telegram) ----
  if (action === "ticket-create") {
    const nick = await getUserNick(env, request);
    if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });
    const dept = DEPTS.includes(body.dept) ? body.dept : "other";
    const subject = String(body.subject || "").slice(0, 140).trim();
    const text = String(body.text || "").slice(0, 3000).trim();
    if (!subject || !text) return Response.json({ error: "empty" }, { status: 400 });
    const id = `${Date.now()}-${toHex(crypto.getRandomValues(new Uint8Array(4)))}`;
    await env.CHAT.put(
      `ticket:${id}`,
      JSON.stringify({ id, dept, from: "@" + nick, subject, text, status: "open", replies: [], created: Date.now() })
    );
    return Response.json({ ok: true, id });
  }

  // ---- Одноразовый бутстрап первого владельца поддержки ----
  // Работает, только пока в KV нет ни одного staff:* и задан env.STAFF_BOOTSTRAP_SECRET.
  // После создания первого сотрудника (в т.ч. любым другим путём) — навсегда 403.
  if (action === "bootstrap-owner") {
    if (!env.STAFF_BOOTSTRAP_SECRET) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    const existing = await env.CHAT.list({ prefix: "staff:", limit: 1 });
    if (existing.keys.length > 0) {
      return Response.json({ error: "already_bootstrapped" }, { status: 403 });
    }
    const secret = String(body.secret || "");
    if (!secret || !timingSafeEqualStr(secret, env.STAFF_BOOTSTRAP_SECRET)) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    const login = String(body.login || "").toLowerCase();
    const password = String(body.password || "");
    if (!/^[a-z0-9_]{3,32}$/.test(login)) return Response.json({ error: "bad_login" }, { status: 400 });
    if (password.length < 8) return Response.json({ error: "weak_password" }, { status: 400 });
    // Повторно проверяем отсутствие занятого логина (на случай гонки с обычным create-staff)
    if (await env.CHAT.get(`staff:${login}`)) return Response.json({ error: "taken" }, { status: 409 });
    const { salt, hash } = await hashPassword(password);
    await env.CHAT.put(`staff:${login}`, JSON.stringify({ salt, hash, dept: "all", role: "owner" }));
    return Response.json({ ok: true });
  }

  // ---- Дальше только для сотрудников ----
  const staff = await getStaff(env, request);
  if (!staff) return Response.json({ error: "unauthorized" }, { status: 401 });

  if (action === "me") {
    return Response.json({ ok: true, login: staff.login, dept: staff.dept, role: staff.role });
  }

  if (action === "change-password") {
    const oldPass = String(body.old || "");
    const newPass = String(body.password || "");
    if (newPass.length < 8) return Response.json({ error: "weak_password" }, { status: 400 });
    const { hash: oldHash } = await hashPassword(oldPass, staff.salt);
    if (oldHash !== staff.hash) return Response.json({ error: "bad_credentials" }, { status: 401 });
    const { salt, hash } = await hashPassword(newPass);
    await env.CHAT.put(`staff:${staff.login}`, JSON.stringify({ salt, hash, dept: staff.dept, role: staff.role }));
    return Response.json({ ok: true });
  }

  if (action === "tickets") {
    const list = await env.CHAT.list({ prefix: "ticket:" });
    const all = (await Promise.all(list.keys.map((k) => env.CHAT.get(k.name)))).map((v) => JSON.parse(v || "null")).filter(Boolean);
    // Сотрудник видит только тикеты своего отдела; владелец и отдел "all" — все
    const visible = staff.role === "owner" || staff.dept === "all" ? all : all.filter((tk) => tk.dept === staff.dept);
    const dept = body.dept && DEPTS.includes(body.dept) ? body.dept : null;
    const filtered = dept ? visible.filter((tk) => tk.dept === dept) : visible;
    filtered.sort((a, b) => b.created - a.created);
    return Response.json({ ok: true, tickets: filtered });
  }

  if (action === "ticket-update") {
    const id = String(body.id || "");
    if (!/^[\d]+-[0-9a-f]{8}$/.test(id)) return Response.json({ error: "bad_id" }, { status: 400 });
    const tk = JSON.parse((await env.CHAT.get(`ticket:${id}`)) || "null");
    if (!tk) return Response.json({ error: "not_found" }, { status: 404 });
    if (staff.role !== "owner" && staff.dept !== "all" && tk.dept !== staff.dept) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    const reply = String(body.reply || "").slice(0, 3000).trim();
    if (reply) tk.replies.push({ by: staff.login, text: reply, ts: Date.now() });
    if (body.status === "closed" || body.status === "open") tk.status = body.status;
    await env.CHAT.put(`ticket:${id}`, JSON.stringify(tk));
    return Response.json({ ok: true, ticket: tk });
  }

  // ---- Только владелец: управление сотрудниками ----
  if (action === "create-staff") {
    if (staff.role !== "owner") return Response.json({ error: "forbidden" }, { status: 403 });
    const login = String(body.login || "").toLowerCase();
    const password = String(body.password || "");
    const dept = body.dept === "all" || DEPTS.includes(body.dept) ? body.dept : "other";
    if (!/^[a-z0-9_]{3,32}$/.test(login)) return Response.json({ error: "bad_login" }, { status: 400 });
    if (password.length < 8) return Response.json({ error: "weak_password" }, { status: 400 });
    if (await env.CHAT.get(`staff:${login}`)) return Response.json({ error: "taken" }, { status: 409 });
    const { salt, hash } = await hashPassword(password);
    await env.CHAT.put(`staff:${login}`, JSON.stringify({ salt, hash, dept, role: "staff" }));
    return Response.json({ ok: true });
  }

  if (action === "delete-staff") {
    if (staff.role !== "owner") return Response.json({ error: "forbidden" }, { status: 403 });
    const login = String(body.login || "").toLowerCase();
    if (login === staff.login) return Response.json({ error: "self" }, { status: 400 });
    await env.CHAT.delete(`staff:${login}`);
    return Response.json({ ok: true });
  }

  if (action === "staff-list") {
    if (staff.role !== "owner") return Response.json({ error: "forbidden" }, { status: 403 });
    const list = await env.CHAT.list({ prefix: "staff:" });
    const rows = await Promise.all(
      list.keys.map(async (k) => {
        const s = JSON.parse((await env.CHAT.get(k.name)) || "{}");
        return { login: k.name.slice(6), dept: s.dept, role: s.role };
      })
    );
    return Response.json({ ok: true, staff: rows });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}
