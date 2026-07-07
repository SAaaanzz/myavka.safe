// Объявления (лоты) пользователей: создание, просмотр своих, вкл/выкл активности,
// переключение публичности списка лотов в профиле, публичный листинг по владельцу.

const MAX_TITLE = 120;
const MAX_PRICE = 40;
const MAX_GAME = 60;
const MAX_DESC = 1000;

async function sessionNick(env, request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  return env.CHAT.get(`session:${token}`);
}

async function getOwnerLotIds(env, nick) {
  const raw = await env.CHAT.get(`ulots:${nick}`);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

async function getLotsByIds(env, ids) {
  const lots = await Promise.all(
    ids.map(async (id) => {
      const raw = await env.CHAT.get(`lot:${id}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })
  );
  return lots.filter(Boolean);
}

const DEFAULT_ALL_LIMIT = 200;
const MAX_ALL_LIMIT = 500;

export async function onRequestGet({ env, params, request }) {
  const action = params.action;

  // ---- Публичный каталог всех активных лотов ----
  if (action === "all") {
    const url = new URL(request.url);
    const gameFilter = String(url.searchParams.get("game") || "").trim();
    let limit = parseInt(url.searchParams.get("limit") || "", 10);
    if (!Number.isFinite(limit) || limit <= 0) limit = DEFAULT_ALL_LIMIT;
    limit = Math.min(limit, MAX_ALL_LIMIT);

    const lots = [];
    let cursor;
    do {
      const page = await env.CHAT.list({ prefix: "lot:", cursor, limit: 1000 });
      const values = await Promise.all(
        page.keys.map(async (k) => {
          const raw = await env.CHAT.get(k.name);
          if (!raw) return null;
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })
      );
      for (const lot of values) {
        if (!lot || lot.active !== true) continue;
        if (gameFilter && String(lot.game || "").toLowerCase() !== gameFilter.toLowerCase()) continue;
        lots.push(lot);
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    lots.sort((a, b) => (b.created || 0) - (a.created || 0));
    const limited = lots
      .slice(0, limit)
      .map((l) => ({ id: l.id, owner: l.owner, game: l.game, title: l.title, price: l.price, desc: l.desc }));

    return Response.json({ ok: true, lots: limited });
  }

  // ---- Публичный список активных лотов владельца (для чужого профиля) ----
  if (action === "by-owner") {
    const url = new URL(request.url);
    const nick = String(url.searchParams.get("nick") || "").replace(/^@/, "").slice(0, 32);
    if (!nick) return Response.json({ error: "bad_request" }, { status: 400 });

    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "null");
    if (!acc) return Response.json({ ok: true, lots: [] });
    if (acc.listingsPublic === false) {
      return Response.json({ ok: true, lots: [], hidden: true });
    }

    const ids = await getOwnerLotIds(env, nick);
    const lots = await getLotsByIds(env, ids);
    const active = lots
      .filter((l) => l.active === true)
      .map((l) => ({ id: l.id, game: l.game, title: l.title, price: l.price, desc: l.desc }));
    return Response.json({ ok: true, lots: active });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}

export async function onRequestPost({ env, params, request }) {
  const action = params.action;
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const nick = await sessionNick(env, request);
  if (!nick) return Response.json({ error: "unauthorized" }, { status: 401 });

  // ---- Создать лот ----
  if (action === "create") {
    const game = String(body.game || "").trim().slice(0, MAX_GAME);
    const title = String(body.title || "").trim().slice(0, MAX_TITLE);
    const price = String(body.price || "").trim().slice(0, MAX_PRICE);
    const desc = String(body.desc || "").trim().slice(0, MAX_DESC);
    if (!game || !title || !price) return Response.json({ error: "empty" }, { status: 400 });

    const id = crypto.randomUUID();
    const lot = { id, owner: nick, game, title, price, desc, active: true, created: Date.now() };
    await env.CHAT.put(`lot:${id}`, JSON.stringify(lot));

    const ids = await getOwnerLotIds(env, nick);
    ids.push(id);
    await env.CHAT.put(`ulots:${nick}`, JSON.stringify(ids));

    return Response.json({ ok: true, lot });
  }

  // ---- Мои лоты (активные и неактивные) ----
  if (action === "mine") {
    const ids = await getOwnerLotIds(env, nick);
    const lots = await getLotsByIds(env, ids);
    return Response.json({ ok: true, lots });
  }

  // ---- Переключить активность лота (только владелец) ----
  if (action === "toggle") {
    const id = String(body.id || "");
    if (!id) return Response.json({ error: "bad_request" }, { status: 400 });
    const raw = await env.CHAT.get(`lot:${id}`);
    if (!raw) return Response.json({ error: "not_found" }, { status: 404 });
    const lot = JSON.parse(raw);
    if (lot.owner !== nick) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
    lot.active = !lot.active;
    await env.CHAT.put(`lot:${id}`, JSON.stringify(lot));
    return Response.json({ ok: true, lot });
  }

  // ---- Редактировать лот (только владелец) ----
  if (action === "edit") {
    const id = String(body.id || "");
    if (!id) return Response.json({ error: "bad_request" }, { status: 400 });
    const raw = await env.CHAT.get(`lot:${id}`);
    if (!raw) return Response.json({ error: "not_found" }, { status: 404 });
    const lot = JSON.parse(raw);
    if (lot.owner !== nick) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });

    if (Object.prototype.hasOwnProperty.call(body, "game")) {
      const game = String(body.game || "").trim().slice(0, MAX_GAME);
      if (!game) return Response.json({ error: "empty" }, { status: 400 });
      lot.game = game;
    }
    if (Object.prototype.hasOwnProperty.call(body, "title")) {
      const title = String(body.title || "").trim().slice(0, MAX_TITLE);
      if (!title) return Response.json({ error: "empty" }, { status: 400 });
      lot.title = title;
    }
    if (Object.prototype.hasOwnProperty.call(body, "price")) {
      const price = String(body.price || "").trim().slice(0, MAX_PRICE);
      if (!price) return Response.json({ error: "empty" }, { status: 400 });
      lot.price = price;
    }
    if (Object.prototype.hasOwnProperty.call(body, "desc")) {
      lot.desc = String(body.desc || "").trim().slice(0, MAX_DESC);
    }

    await env.CHAT.put(`lot:${id}`, JSON.stringify(lot));
    return Response.json({ ok: true, lot });
  }

  // ---- Удалить лот (только владелец) ----
  if (action === "delete") {
    const id = String(body.id || "");
    if (!id) return Response.json({ error: "bad_request" }, { status: 400 });
    const raw = await env.CHAT.get(`lot:${id}`);
    if (raw) {
      const lot = JSON.parse(raw);
      if (lot.owner !== nick) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
      await env.CHAT.delete(`lot:${id}`);
    }

    const ids = await getOwnerLotIds(env, nick);
    const filtered = ids.filter((x) => x !== id);
    if (filtered.length !== ids.length) {
      await env.CHAT.put(`ulots:${nick}`, JSON.stringify(filtered));
    }

    return Response.json({ ok: true });
  }

  // ---- Видимость списка лотов в профиле ----
  if (action === "visibility") {
    const pub = !!body.public;
    const acc = JSON.parse((await env.CHAT.get(`unick:${nick}`)) || "{}");
    acc.listingsPublic = pub;
    await env.CHAT.put(`unick:${nick}`, JSON.stringify(acc));
    return Response.json({ ok: true, listingsPublic: pub });
  }

  return Response.json({ error: "unknown_action" }, { status: 404 });
}
