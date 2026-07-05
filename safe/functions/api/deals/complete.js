// Завершение сделки: проверяем ID проданного аккаунта по бан-базе.
// Если ID в бане (украден/возвращён) — продавец блокируется, администратору уходит уведомление.

async function sessionNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

// Глава сервиса; уведомления получают он и все назначенные им администраторы
const OWNER_ID = "5840888651";

async function notifyAdmins(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  const admins = (await env.CHAT.list({ prefix: "admin:" })).keys.map((k) => k.name.slice(6));
  const targets = [...new Set([OWNER_ID, ...admins])];
  await Promise.all(
    targets.map((chatId) =>
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      })
    )
  );
}

export async function onRequestPost({ env, request }) {
  const buyer = await sessionNick(env, request);
  if (!buyer) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const accountId = String(body.accountId || "").trim().slice(0, 64);
  const seller = String(body.seller || "").replace(/^@/, "").toLowerCase().slice(0, 32);
  const title = String(body.title || "").slice(0, 120);
  if (!accountId || !seller) return Response.json({ error: "bad_request" }, { status: 400 });

  const banned = await env.CHAT.get(`banned_acc:${accountId}`);
  if (!banned) {
    return Response.json({ ok: true, flagged: false });
  }

  // Аккаунт в бан-базе: блокируем продавца до решения администратора
  const { reason } = JSON.parse(banned);
  await env.CHAT.put(
    `ban:${seller}`,
    JSON.stringify({ by: "system", accountId, reason, ts: Date.now() })
  );
  await notifyAdmins(
    env,
    `🚨 ВНИМАНИЕ: завершена сделка с аккаунтом из бан-базы!\n\n` +
      `ID аккаунта: ${accountId}\nПричина в базе: ${reason}\n` +
      `Продавец: @${seller} — ЗАБЛОКИРОВАН до вашего решения (/unban ${seller})\n` +
      `Покупатель: @${buyer}\nЛот: ${title || "—"}`
  );
  return Response.json({ ok: true, flagged: true, sellerBanned: true });
}
