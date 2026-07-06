// Страница профиля: свой профиль (управление объявлениями/видимостью) и чужой (только просмотр).
// Использует общие t()/getUser()/escHtml()/requireAuth() из app.js.
const LOTS_API = "/api/lots/";

let myLots = [];
let meCache = null;

function fmtDate(ms) {
  if (!ms) return "—";
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  const lang = getLang();
  const locale = lang === "kz" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU";
  try {
    return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

async function lotsApi(action, body) {
  const user = getUser();
  try {
    const res = await fetch(LOTS_API + action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + (user?.token || "") },
      body: JSON.stringify(body || {}),
    });
    if (res.status === 401) {
      localStorage.removeItem("user");
      return { ok: false, error: "unauth" };
    }
    return await res.json();
  } catch {
    return { ok: false, error: "network" };
  }
}

function renderMyLots() {
  const root = document.getElementById("p-lot-list");
  if (!root) return;
  if (!myLots.length) {
    root.innerHTML = `<div class="empty-note">${t("profile.noLots")}</div>`;
    return;
  }
  root.innerHTML = myLots.map((l) => `
    <div class="lot-row ${l.active ? "" : "inactive"}" data-id="${escHtml(l.id)}">
      <span class="lot-row-game">${escHtml(l.game)}</span>
      <span class="lot-row-title">${escHtml(l.title)}${l.desc ? ` <span style="color:var(--muted);font-weight:400">— ${escHtml(l.desc)}</span>` : ""}</span>
      <span class="lot-row-price">${escHtml(String(l.price))} ₸</span>
      <span class="lot-status ${l.active ? "active" : "inactive"}">${l.active ? t("profile.active") : t("profile.inactive")}</span>
      <button class="btn btn-outline btn-sm lot-toggle-btn" data-id="${escHtml(l.id)}">${l.active ? t("profile.deactivate") : t("profile.activate")}</button>
    </div>
  `).join("");
  root.querySelectorAll(".lot-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleLot(btn.dataset.id));
  });
}

async function toggleLot(id) {
  const data = await lotsApi("toggle", { id });
  if (data.ok && data.lot) {
    const idx = myLots.findIndex((l) => l.id === data.lot.id);
    if (idx >= 0) myLots[idx] = data.lot;
    renderMyLots();
  } else if (data.error === "unauth") {
    alert(t("auth.expired"));
    location.href = "index.html";
  } else {
    alert(t("auth.errNet"));
  }
}

function bindCreateForm() {
  const form = document.getElementById("p-lot-form");
  const errEl = document.getElementById("lot-form-err");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.hidden = true;
    const game = document.getElementById("lot-game").value.trim();
    const title = document.getElementById("lot-title").value.trim();
    const priceRaw = document.getElementById("lot-price").value.trim();
    const desc = document.getElementById("lot-desc").value.trim();
    // Бэкенд хранит цену как строку (String(body.price)) и считает "0"/пусто ошибкой —
    // передаём именно введённую строку, без Number()-конвертации.
    if (!game || !title || !priceRaw || Number.isNaN(Number(priceRaw)) || Number(priceRaw) <= 0) {
      errEl.textContent = t("profile.errEmpty");
      errEl.hidden = false;
      return;
    }
    const data = await lotsApi("create", { game, title, price: priceRaw, desc: desc || undefined });
    if (data.ok && data.lot) {
      myLots.unshift(data.lot);
      renderMyLots();
      form.reset();
    } else if (data.error === "empty") {
      errEl.textContent = t("profile.errEmpty");
      errEl.hidden = false;
    } else if (data.error === "unauth") {
      alert(t("auth.expired"));
      location.href = "index.html";
    } else {
      errEl.textContent = t("auth.errNet");
      errEl.hidden = false;
    }
  });
}

function bindVisibilityToggle(listingsPublic) {
  const cb = document.getElementById("p-visibility-toggle");
  // /api/auth/me отдаёт listingsPublic (true = публично, false = скрыто, дефолт true).
  // Чекбокс «скрыть» отмечен, когда объявления скрыты, т.е. listingsPublic === false.
  cb.checked = listingsPublic === false;
  cb.addEventListener("change", async () => {
    const hideNow = cb.checked;
    const data = await lotsApi("visibility", { public: !hideNow });
    if (!data.ok) {
      cb.checked = !hideNow; // откатить визуально при ошибке
      alert(t("auth.errNet"));
    }
  });
}

function bindLogout() {
  document.getElementById("p-logout").addEventListener("click", () => {
    if (confirm(t("auth.logout"))) {
      localStorage.removeItem("user");
      location.href = "index.html";
    }
  });
}

async function loadMe() {
  const user = getUser();
  try {
    const res = await fetch("/api/auth/me", {
      method: "POST",
      headers: { Authorization: "Bearer " + user.token },
    });
    if (res.status === 401) {
      localStorage.removeItem("user");
      return null;
    }
    const data = await res.json();
    return data.ok ? data : null;
  } catch {
    return null;
  }
}

async function initOwnProfile() {
  document.getElementById("profile-own").hidden = false;
  const me = await loadMe();
  if (!me) {
    document.getElementById("profile-own").hidden = true;
    updateLoginButtons();
    requireAuth(() => location.reload(), () => { location.href = "index.html"; });
    return;
  }
  meCache = me;
  document.getElementById("profile-title").textContent = me.nick;
  document.title = `${me.nick} — Myavka.safe`;
  document.getElementById("p-created").textContent = fmtDate(me.created);
  document.getElementById("p-tgid").textContent = me.tgId ? String(me.tgId) : "—";

  const lotsRes = await lotsApi("mine");
  if (lotsRes.error === "unauth") {
    alert(t("auth.expired"));
    location.href = "index.html";
    return;
  }
  myLots = lotsRes.ok && Array.isArray(lotsRes.lots) ? lotsRes.lots : [];
  renderMyLots();

  bindVisibilityToggle(me.listingsPublic);
  bindCreateForm();
  bindLogout();
}

function renderPublicLots(lots) {
  const root = document.getElementById("p-public-lot-list");
  root.innerHTML = lots.map((l) => `
    <div class="lot-row">
      <span class="lot-row-game">${escHtml(l.game)}</span>
      <span class="lot-row-title">${escHtml(l.title)}${l.desc ? ` <span style="color:var(--muted);font-weight:400">— ${escHtml(l.desc)}</span>` : ""}</span>
      <span class="lot-row-price">${escHtml(String(l.price))} ₸</span>
    </div>
  `).join("");
}

async function initPublicProfile(urlNick) {
  document.getElementById("profile-public").hidden = false;
  const cleanNick = urlNick.replace(/^@/, "");
  document.getElementById("profile-title").textContent = "@" + cleanNick;
  document.title = `@${cleanNick} — Myavka.safe`;
  try {
    const res = await fetch("/api/lots/by-owner?nick=" + encodeURIComponent(urlNick));
    const data = await res.json();
    if (!res.ok || !data.ok) {
      document.getElementById("profile-public").hidden = true;
      document.getElementById("profile-error").hidden = false;
      return;
    }
    if (data.hidden) {
      document.getElementById("p-public-hidden-note").hidden = false;
      return;
    }
    const lots = Array.isArray(data.lots) ? data.lots : [];
    if (!lots.length) {
      document.getElementById("p-public-empty-note").hidden = false;
      return;
    }
    renderPublicLots(lots);
  } catch {
    document.getElementById("profile-public").hidden = true;
    document.getElementById("profile-error").hidden = false;
  }
}

(function init() {
  const params = new URLSearchParams(location.search);
  const urlNick = params.get("nick");
  const user = getUser();

  const ownNickPlain = user ? String(user.name).replace(/^@/, "") : null;
  const urlNickPlain = urlNick ? urlNick.replace(/^@/, "") : null;
  const isOwn = !!user && (!urlNick || urlNickPlain === ownNickPlain);

  if (isOwn) {
    initOwnProfile();
  } else if (urlNick) {
    initPublicProfile(urlNick);
  } else {
    requireAuth(() => location.reload(), () => { location.href = "index.html"; });
  }
})();

// При смене языка перерисовываем динамические блоки (статусы, кнопки, дата) —
// статичная разметка с data-i18n обновляется через applyLang() автоматически.
document.addEventListener("langchange", () => {
  if (meCache) {
    document.getElementById("p-created").textContent = fmtDate(meCache.created);
    renderMyLots();
  }
});
