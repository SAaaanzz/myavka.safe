// Сделки: создание (покупка лота), список своих сделок, завершение с проверкой
// проданного аккаунта по бан-базе, отмена. Каждая сделка привязана к комнате
// чата `deal_<id>`, доступной только покупателю и продавцу этой сделки
// (см. safe/functions/api/chat/[room].js).

const MAX_ACCOUNT_ID = 64;

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

async function getDealIds(env, nick) {
  const raw = await env.CHAT.get(`udeals:${nick}`);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

async function addDealId(env, nick, dealId) {
  const ids = await getDealIds(env, nick);
  ids.push(dealId);
  await env.CHAT.put(`udeals:${nick}`, JSON.stringify(ids));
}

async function getDeal(env, id) {
  if (!id || typeof id !== "string") return null;
  const raw = await env.CHAT.get(`deal:${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function onRequestPost({ env, params, request }) {
  const action = params.action;

  const nick = await sessionNick(env, request);
  if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // ---- Создать сделку (купить лот) ----
  if (action === "create") {
    const lotId = String(body.lotId || "");
    if (!lotId) return Response.json({ error: "bad_request" }, { status: 400 });

    const rawLot = await env.CHAT.get(`lot:${lotId}`);
    if (!rawLot) return Response.json({ error: "lot_not_found" }, { status: 404 });
    let lot;
    try {
      lot = JSON.parse(rawLot);
    } catch {
      return Response.json({ error: "lot_not_found" }, { status: 404 });
    }

    const buyer = nick;
    const seller = lot.owner;
    if (seller === buyer) {
      return Response.json({ error: "own_lot" }, { status: 400 });
    }
    if (await env.CHAT.get(`ban:${seller}`)) {
      return Response.json({ error: "seller_banned" }, { status: 403 });
    }

    const id = crypto.randomUUID();
    const deal = {
      id,
      lotId,
      seller,
      buyer,
      title: lot.title,
      price: lot.price,
      status: "active",
      room: `deal_${id}`,
      created: Date.now(),
    };
    await env.CHAT.put(`deal:${id}`, JSON.stringify(deal));
    await addDealId(env, buyer, id);
    await addDealId(env, seller, id);

    return Response.json({ ok: true, deal });
  }

  // ---- Мои сделки (в роли покупателя или продавца) ----
  if (action === "mine") {
    const ids = await getDealIds(env, nick);
    const deals = (
      await Promise.all(ids.map((id) => getDeal(env, id)))
    ).filter(Boolean);
    deals.sort((a, b) => (b.created || 0) - (a.created || 0));
    const enriched = deals.map((d) => {
      const role = d.buyer === nick ? "buyer" : "seller";
      const counterparty = role === "buyer" ? d.seller : d.buyer;
      return { ...d, role, counterparty };
    });
    return Response.json({ ok: true, deals: enriched });
  }

  // ---- Завершить сделку: проверка ID проданного аккаунта по бан-базе ----
  if (action === "complete") {
    const dealId = String(body.dealId || "");
    const deal = await getDeal(env, dealId);
    if (!deal) return Response.json({ error: "not_found" }, { status: 404 });

    if (deal.buyer !== nick) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    if (deal.status !== "active") {
      return Response.json({ error: "bad_status" }, { status: 409 });
    }

    const accountId = String(body.accountId || "").trim().slice(0, MAX_ACCOUNT_ID);
    if (!accountId) return Response.json({ error: "bad_request" }, { status: 400 });

    const seller = deal.seller;
    const title = deal.title;

    const banned = await env.CHAT.get(`banned_acc:${accountId}`);
    if (!banned) {
      deal.status = "completed";
      await env.CHAT.put(`deal:${deal.id}`, JSON.stringify(deal));
      return Response.json({ ok: true, flagged: false });
    }

    // Аккаунт в бан-базе: блокируем продавца до решения администратора
    const { reason } = JSON.parse(banned);
    await env.CHAT.put(
      `ban:${seller}`,
      JSON.stringify({ by: "system", accountId, reason, ts: Date.now() })
    );
    deal.status = "flagged";
    await env.CHAT.put(`deal:${deal.id}`, JSON.stringify(deal));
    await notifyAdmins(
      env,
      `🚨 ВНИМАНИЕ: завершена сделка с аккаунтом из бан-базы!\n\n` +
        `ID аккаунта: ${accountId}\nПричина в базе: ${reason}\n` +
        `Продавец: @${seller} — ЗАБЛОКИРОВАН до вашего решения (/unban ${seller})\n` +
        `Покупатель: @${nick}\nЛот: ${title || "—"}`
    );
    return Response.json({ ok: true, flagged: true, sellerBanned: true });
  }

  // ---- Отменить активную сделку (участник: покупатель или продавец) ----
  if (action === "cancel") {
    const dealId = String(body.dealId || "");
    const deal = await getDeal(env, dealId);
    if (!deal) return Response.json({ error: "not_found" }, { status: 404 });

    if (deal.buyer !== nick && deal.seller !== nick) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    if (deal.status !== "active") {
      return Response.json({ error: "bad_status" }, { status: 409 });
    }

    deal.status = "cancelled";
    await env.CHAT.put(`deal:${deal.id}`, JSON.stringify(deal));
    return Response.json({ ok: true, deal });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}
