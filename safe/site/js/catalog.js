// Данные каталога: игра → категории услуг → лоты (статичные демо-данные)
const CATALOG = {
  ml: {
    name: "Mobile Legends",
    cover: "cover-ml",
    desc: "Аккаунты, донат алмазов, буст ранга и прокачка",
    cats: {
      accounts: { name: "Аккаунты", kind: "acc", desc: "Продажа аккаунтов — только верифицированные продавцы" },
      diamonds: { name: "Донат алмазов", kind: "svc", desc: "Пакеты Diamonds на ваш аккаунт" },
      starlight: { name: "Starlight Member", kind: "svc", desc: "Ежемесячная подписка Starlight" },
      boost: { name: "Буст ранга", kind: "svc", desc: "Warrior → Mythic → Mythical Glory" },
      coaching: { name: "Прокачка и обучение", kind: "svc", desc: "Герои, эмблемы, коучинг" },
    },
    lots: [
      { cat: "diamonds", top: true, title: "Донат 706 алмазов — за 30 минут", desc: "Официальный донат на ваш ID, скриншот-подтверждение", price: "2 500 ₸", seller: "diamond_kz", av: "av-1", rate: "4.9", deals: 312, online: true },
      { cat: "diamonds", title: "2195 алмазов — выгодный пакет", desc: "Зачисление в течение часа, гарантия", price: "7 400 ₸", seller: "diamond_kz", av: "av-1", rate: "4.9", deals: 312, online: true },
      { cat: "diamonds", title: "86 алмазов — минимальный пакет", desc: "Быстро и недорого, для Starlight-задач", price: "450 ₸", seller: "ml_donate", av: "av-3", rate: "4.7", deals: 88, online: false },
      { cat: "accounts", verify: true, title: "Аккаунт Mythical Glory, 120 скинов, 89 героев", desc: "Полный доступ, смена почты, история чистая", price: "85 000 ₸", seller: "mlbb_store", av: "av-2", rate: "4.8", deals: 124, online: true },
      { cat: "accounts", verify: true, title: "Аккаунт Epic, 45 скинов — для старта", desc: "Дешёвый вариант с редкими скинами", price: "12 000 ₸", seller: "mlbb_store", av: "av-2", rate: "4.8", deals: 124, online: true },
      { cat: "starlight", title: "Starlight Member на месяц", desc: "Активация на ваш аккаунт за 20 минут", price: "3 200 ₸", seller: "ml_donate", av: "av-3", rate: "4.7", deals: 88, online: false },
      { cat: "boost", top: true, title: "Буст Legend → Mythic за 3 дня", desc: "Играем на вашем аккаунте, стрим по запросу", price: "9 000 ₸", seller: "boost_pro", av: "av-4", rate: "5.0", deals: 210, online: true },
      { cat: "coaching", title: "Коучинг: 5 тренировок с топ-игроком", desc: "Разбор реплеев, макро и микро игра", price: "15 000 ₸", seller: "boost_pro", av: "av-4", rate: "5.0", deals: 210, online: true },
    ],
  },
  tg: {
    name: "Telegram",
    cover: "cover-tg",
    desc: "Каналы, Stars, Premium, накрутка и реклама",
    cats: {
      channels: { name: "Каналы и аккаунты", kind: "acc", desc: "Продажа каналов, групп, ботов — с верификацией" },
      stars: { name: "Telegram Stars", kind: "svc", desc: "Покупка и пересылка звёзд" },
      premium: { name: "Telegram Premium", kind: "svc", desc: "Подарок или оплата подписки" },
      promo: { name: "Подписчики и реклама", kind: "svc", desc: "Накрутка, просмотры, реклама в каналах" },
    },
    lots: [
      { cat: "premium", top: true, title: "Telegram Premium на 12 месяцев — подарком", desc: "Официальный подарок через Fragment", price: "14 900 ₸", seller: "tg_services", av: "av-1", rate: "5.0", deals: 540, online: true },
      { cat: "premium", title: "Telegram Premium на 3 месяца", desc: "Активация за 10 минут", price: "4 500 ₸", seller: "tg_services", av: "av-1", rate: "5.0", deals: 540, online: true },
      { cat: "stars", title: "500 Telegram Stars — моментально", desc: "Отправка на ваш аккаунт сразу после оплаты", price: "4 200 ₸", seller: "stars_market", av: "av-3", rate: "4.7", deals: 98, online: true },
      { cat: "stars", title: "1000 Telegram Stars", desc: "Выгодный курс, гарантия зачисления", price: "8 100 ₸", seller: "stars_market", av: "av-3", rate: "4.7", deals: 98, online: true },
      { cat: "channels", verify: true, title: "Канал 12 000 подписчиков, игровая тематика", desc: "Живая аудитория, статистика TGStat в описании", price: "220 000 ₸", seller: "channel_broker", av: "av-2", rate: "4.9", deals: 67, online: false },
      { cat: "promo", title: "1000 подписчиков на канал", desc: "Плавная накрутка за 2-3 дня, без ботов-пустышек", price: "6 500 ₸", seller: "promo_kz", av: "av-4", rate: "4.6", deals: 45, online: true },
    ],
  },
  pubg: {
    name: "PUBG Mobile",
    cover: "cover-pubg",
    desc: "Аккаунты, UC, Royal Pass и буст ранга",
    cats: {
      accounts: { name: "Аккаунты", kind: "acc", desc: "Продажа аккаунтов — только верифицированные продавцы" },
      uc: { name: "UC (Unknown Cash)", kind: "svc", desc: "Донат UC на ваш аккаунт" },
      rp: { name: "Royal Pass", kind: "svc", desc: "Elite Pass, Elite Pass Plus, RP Upgrade" },
      boost: { name: "Буст ранга", kind: "svc", desc: "Bronze → Conqueror" },
    },
    lots: [
      { cat: "uc", top: true, title: "1800 UC — официальный донат", desc: "Через ID, зачисление за 15 минут", price: "11 500 ₸", seller: "uc_shop_kz", av: "av-2", rate: "4.8", deals: 203, online: true },
      { cat: "uc", title: "660 UC — популярный пакет", desc: "Хватает на Royal Pass + кейс", price: "4 400 ₸", seller: "uc_shop_kz", av: "av-2", rate: "4.8", deals: 203, online: true },
      { cat: "accounts", verify: true, title: "Аккаунт Conqueror, 40+ мифических сетов", desc: "Полный доступ, привязки сняты", price: "150 000 ₸", seller: "pubg_trader", av: "av-1", rate: "4.6", deals: 45, online: false },
      { cat: "rp", title: "Elite Pass Plus — подарком", desc: "Активация на ваш аккаунт", price: "7 900 ₸", seller: "uc_shop_kz", av: "av-2", rate: "4.8", deals: 203, online: true },
      { cat: "boost", title: "Буст до Ace за неделю", desc: "Играем в паре с вами или на аккаунте", price: "13 000 ₸", seller: "pubg_boost", av: "av-4", rate: "4.9", deals: 132, online: true },
    ],
  },
  lol: {
    name: "League of Legends",
    cover: "cover-lol",
    desc: "Аккаунты, RP, буст ранга и коучинг",
    cats: {
      accounts: { name: "Аккаунты", kind: "acc", desc: "Продажа аккаунтов — только верифицированные продавцы" },
      rp: { name: "RP (Riot Points)", kind: "svc", desc: "Донат RP на ваш аккаунт" },
      boost: { name: "Буст ранга", kind: "svc", desc: "Iron → Challenger, placement games" },
      coaching: { name: "Коучинг", kind: "svc", desc: "Тренировки с высокорейтинговыми игроками" },
    },
    lots: [
      { cat: "boost", top: true, title: "Буст Gold → Diamond за 5 дней", desc: "Обещанный винрейт 80%+, оффлайн-режим", price: "18 000 ₸", seller: "lol_booster", av: "av-3", rate: "4.9", deals: 156, online: true },
      { cat: "rp", title: "2800 RP — донат на аккаунт", desc: "Регион EUW/RU, зачисление за час", price: "9 200 ₸", seller: "rp_store", av: "av-1", rate: "4.7", deals: 77, online: true },
      { cat: "accounts", verify: true, title: "Аккаунт Diamond II, 150+ скинов", desc: "Полный доступ, почта в комплекте", price: "95 000 ₸", seller: "lol_trader", av: "av-2", rate: "4.8", deals: 58, online: false },
      { cat: "coaching", title: "Коучинг от Challenger — 3 сессии", desc: "Разбор игр, драфт, роль на выбор", price: "20 000 ₸", seller: "lol_booster", av: "av-3", rate: "4.9", deals: 156, online: true },
    ],
  },
  ff: {
    name: "Free Fire",
    cover: "cover-ff",
    desc: "Аккаунты, алмазы, Elite Pass и буст",
    cats: {
      accounts: { name: "Аккаунты", kind: "acc", desc: "Продажа аккаунтов — только верифицированные продавцы" },
      diamonds: { name: "Алмазы", kind: "svc", desc: "Донат Diamonds на ваш аккаунт" },
      pass: { name: "Elite / Booyah Pass", kind: "svc", desc: "Elite Pass, Elite Bundle, Booyah Premium" },
      boost: { name: "Буст ранга", kind: "svc", desc: "Bronze → Grandmaster → Heroic" },
    },
    lots: [
      { cat: "diamonds", top: true, title: "1060 алмазов + бонус Elite Pass", desc: "Донат через ID за 20 минут", price: "5 900 ₸", seller: "ff_diamonds", av: "av-4", rate: "4.7", deals: 89, online: true },
      { cat: "diamonds", title: "2180 алмазов — большой пакет", desc: "Выгодный курс, гарантия", price: "11 200 ₸", seller: "ff_diamonds", av: "av-4", rate: "4.7", deals: 89, online: true },
      { cat: "accounts", verify: true, title: "Аккаунт Heroic, редкие персонажи и скины", desc: "Полный доступ, смена привязок", price: "48 000 ₸", seller: "ff_trader", av: "av-2", rate: "4.5", deals: 31, online: false },
      { cat: "pass", title: "Booyah Pass Premium", desc: "Активация на ваш аккаунт", price: "3 800 ₸", seller: "ff_diamonds", av: "av-4", rate: "4.7", deals: 89, online: true },
    ],
  },
};

function qs(key) {
  return new URLSearchParams(location.search).get(key);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// Каталог: сервис текстом + список услуг под ним
function renderCatalogPage() {
  const root = document.getElementById("catalog-page");
  if (!root) return;

  root.innerHTML = Object.entries(CATALOG).map(([gSlug, game]) => {
    const links = Object.entries(game.cats).map(([cSlug, cat]) =>
      `<a class="svc-link" href="lots.html?g=${esc(gSlug)}&s=${esc(cSlug)}">${esc(cat.name)}</a>`
    ).join("");
    return `<div class="svc-card">
      <a class="svc-name" href="lots.html?g=${esc(gSlug)}">${esc(game.name)}</a>
      <div class="svc-links">${links}</div>
    </div>`;
  }).join("");
}

// Лоты: категория из URL или первая по умолчанию, список в длину
function renderLotsPage() {
  const gameSlug = qs("g");
  const game = CATALOG[gameSlug];
  const root = document.getElementById("lots-page");
  if (!root) return;
  if (!game) { location.href = "catalog.html"; return; }

  const catSlug = game.cats[qs("s")] ? qs("s") : Object.keys(game.cats)[0];
  const cat = game.cats[catSlug];

  document.title = `${cat.name} — ${game.name} — Myavka.safe`;
  document.getElementById("crumb-game").textContent = game.name;
  document.getElementById("crumb-game").href = `lots.html?g=${gameSlug}`;
  document.getElementById("crumb-cat").textContent = cat.name;
  document.getElementById("lots-title").textContent = `${game.name} — ${cat.name}`;
  document.getElementById("lots-desc").textContent = `${cat.desc}. ${typeof t === "function" ? t("lots.escrow") : "Каждая покупка защищена эскроу."}`;

  document.getElementById("cat-tabs").innerHTML = Object.entries(game.cats).map(([slug, c]) =>
    `<a class="tab ${slug === catSlug ? "active" : ""}" href="lots.html?g=${esc(gameSlug)}&s=${esc(slug)}">${esc(c.name)}</a>`
  ).join("");

  const lots = game.lots.filter((l) => l.cat === catSlug);
  root.innerHTML = lots.length
    ? lots.map((lot) => `<a class="lot-row" href="chats.html">
        <span class="avatar ${esc(lot.av)}">${esc(lot.seller[0].toUpperCase())}</span>
        <span class="lot-row-title">
          ${lot.top ? '<span class="top-badge">TOP</span> ' : ""}${esc(lot.title)}
        </span>
        <span class="lot-row-price">${esc(lot.price)}</span>
      </a>`).join("")
    : `<div class="empty-note">${typeof t === "function" ? t("lots.empty") : "В этой категории пока нет лотов"}</div>`;

  loadRealLots(game.name);
}

// ---------- Реальные лоты пользователей (GET /api/lots/all) ----------
// Отображаются отдельным блоком под демо-лотами; клик по ним создаёт сделку
// (POST /api/deals/create) и ведёт в чат сделки — в отличие от демо-лотов,
// которые просто ведут на chats.html без реальной сделки.
let realLotsWrap = null;

function ensureRealLotsWrap(root) {
  if (realLotsWrap) return realLotsWrap;
  realLotsWrap = document.createElement("div");
  realLotsWrap.id = "real-lots-section";
  realLotsWrap.innerHTML = `<h2 class="home-h" style="margin-top:28px" data-i18n="lots.userLots">${typeof t === "function" ? t("lots.userLots") : "Объявления пользователей"}</h2><div class="lot-list" id="lots-page-real"></div>`;
  root.parentNode.insertBefore(realLotsWrap, root.nextSibling);
  // Делегирование клика — переживает перерисовку #lots-page-real
  realLotsWrap.addEventListener("click", (e) => {
    const row = e.target.closest("[data-real-lot-id]");
    if (!row) return;
    e.preventDefault();
    buyRealLot(row.dataset.realLotId);
  });
  return realLotsWrap;
}

async function fetchRealLots(gameName) {
  try {
    const res = await fetch("/api/lots/all?game=" + encodeURIComponent(gameName) + "&limit=100");
    const data = await res.json();
    return data.ok && Array.isArray(data.lots) ? data.lots : [];
  } catch {
    return [];
  }
}

async function loadRealLots(gameName) {
  const root = document.getElementById("lots-page");
  if (!root) return;
  const wrap = ensureRealLotsWrap(root);
  const lots = await fetchRealLots(gameName);
  const list = wrap.querySelector("#lots-page-real");
  if (!lots.length) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  list.innerHTML = lots.map((lot) => `<div class="lot-row" data-real-lot-id="${escHtml(lot.id)}" style="cursor:pointer">
      <span class="avatar av-4">${escHtml((lot.owner || "?")[0].toUpperCase())}</span>
      <span class="lot-row-title">${escHtml(lot.title)} <span style="color:var(--muted);font-weight:400">— @${escHtml(lot.owner)}</span></span>
      <span class="lot-row-price">${escHtml(String(lot.price))} ₸</span>
    </div>`).join("");
}

// Клик по реальному лоту: требуем вход, создаём сделку, переходим в чат сделки.
function buyRealLot(lotId) {
  requireAuth(async () => {
    try {
      const res = await fetch("/api/deals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (getUser()?.token || ""),
        },
        body: JSON.stringify({ lotId }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.deal) {
        location.href = "chats.html?deal=" + encodeURIComponent(data.deal.id);
        return;
      }
      const errMap = {
        own_lot: "deal.errOwnLot",
        seller_banned: "deal.errSellerBanned",
        lot_inactive: "deal.errLotInactive",
        lot_not_found: "deal.errNotFound",
      };
      showInfoModal(t(errMap[data.error] || "auth.errNet"));
    } catch {
      showInfoModal(t("auth.errNet"));
    }
  });
}

renderCatalogPage();
renderLotsPage();
document.addEventListener("langchange", () => { renderCatalogPage(); renderLotsPage(); });
