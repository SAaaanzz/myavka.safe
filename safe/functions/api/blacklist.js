// Публичный чёрный список: заблокированные пользователи и аккаунты.
// GET /api/blacklist?q=<nick|accountId> — без авторизации.
// Точечный поиск (?q=) отдаёт совпадение и по пользователю, и по аккаунту.
// "recent" (список последних записей без q) отдаёт ТОЛЬКО заблокированных
// пользователей (ban:*) — banned_acc:* массово не публикуется (антифрод-база
// accountId не должна собираться целиком со страницы).

const MAX_Q = 64;
const RECENT_LIMIT = 20;

async function collectPrefix(env, prefix) {
  const out = [];
  let cursor;
  do {
    const page = await env.CHAT.list({ prefix, cursor, limit: 1000 });
    for (const k of page.keys) {
      out.push(k.name);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return out;
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const qRaw = String(url.searchParams.get("q") || "").trim().slice(0, MAX_Q);
  const q = qRaw.replace(/^@/, "");

  let matchUser = null;
  let matchAccount = null;

  if (q) {
    const userRaw = await env.CHAT.get(`ban:${q}`);
    if (userRaw) {
      const val = safeParse(userRaw) || {};
      matchUser = { type: "user", id: q, reason: val.reason || "—", ts: val.ts || null };
    }
    const accRaw = await env.CHAT.get(`banned_acc:${q}`);
    if (accRaw) {
      const val = safeParse(accRaw) || {};
      matchAccount = { type: "account", id: q, reason: val.reason || "—", ts: val.ts || null };
    }
  }

  // ВАЖНО (безопасность): "recent" — только заблокированные пользователи (ban:*).
  // Забаненные аккаунты (banned_acc:*) — это антифрод-база accountId, её нельзя
  // отдавать целиком публично (иначе злоумышленник соберёт список всех id).
  // Проверка конкретного accountId возможна только точечно через ?q=<id> (см. matchAccount выше).
  const userKeys = await collectPrefix(env, "ban:");

  const entries = [];

  await Promise.all(
    userKeys.map(async (name) => {
      const raw = await env.CHAT.get(name);
      if (!raw) return;
      const val = safeParse(raw) || {};
      const id = name.slice("ban:".length);
      entries.push({ type: "user", id, reason: val.reason || "—", ts: val.ts || 0 });
    })
  );

  entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const recent = entries.slice(0, RECENT_LIMIT);

  return Response.json({
    ok: true,
    query: q || null,
    match: { user: matchUser, account: matchAccount },
    recent,
  });
}
