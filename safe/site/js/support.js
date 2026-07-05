// Панель поддержки: вход по логину/паролю, тикеты по отделам
const API = "/api/support/";
const DEPT_NAMES = { verification: "Верификация", sales: "Продажи", ban: "Баны", other: "Прочее", all: "Все отделы" };

let me = null; // { token, login, dept, role }
let tickets = [];
let deptFilter = null;
let openTicketId = null;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function api(action, body) {
  const res = await fetch(API + action, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(me?.token ? { Authorization: "Bearer " + me.token } : {}) },
    body: JSON.stringify(body || {}),
  });
  if (res.status === 401 && me) { logout(); return null; }
  return res.json().then((d) => ({ status: res.status, ...d })).catch(() => ({ status: res.status }));
}

function logout() {
  sessionStorage.removeItem("staff");
  me = null;
  document.getElementById("sup-panel").hidden = true;
  document.getElementById("sup-login-form").hidden = false;
  document.getElementById("sup-logout").hidden = true;
}

function renderTabs() {
  const depts = me.role === "owner" || me.dept === "all" ? ["verification", "sales", "ban", "other"] : [me.dept];
  const tabs = [{ id: null, name: "Все" }, ...depts.map((d) => ({ id: d, name: DEPT_NAMES[d] }))];
  document.getElementById("dept-tabs").innerHTML = tabs
    .map((tb) => `<button data-d="${tb.id ?? ""}" class="${deptFilter === tb.id ? "active" : ""}">${esc(tb.name)}</button>`)
    .join("");
  document.querySelectorAll("#dept-tabs button").forEach((b) =>
    b.addEventListener("click", () => { deptFilter = b.dataset.d || null; renderTabs(); renderList(); })
  );
}

function renderList() {
  const rows = deptFilter ? tickets.filter((tk) => tk.dept === deptFilter) : tickets;
  document.getElementById("ticket-list").innerHTML = rows.length
    ? rows.map((tk) => `<button class="ticket-row" data-id="${esc(tk.id)}">
        <span class="tk-dept">${esc(DEPT_NAMES[tk.dept] || tk.dept)}</span>
        <span><b>${esc(tk.subject)}</b> · ${esc(tk.from)}</span>
        <span class="tk-status ${esc(tk.status)}">${tk.status === "open" ? "открыт" : "закрыт"}</span>
      </button>`).join("")
    : '<p style="color:var(--muted);font-size:.9rem">Тикетов нет</p>';
  document.querySelectorAll(".ticket-row").forEach((b) =>
    b.addEventListener("click", () => { openTicketId = b.dataset.id; renderTicket(); })
  );
}

function renderTicket() {
  const view = document.getElementById("ticket-view");
  const tk = tickets.find((x) => x.id === openTicketId);
  if (!tk) { view.hidden = true; return; }
  document.getElementById("sup-settings").hidden = true;
  view.hidden = false;
  view.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <h3>${esc(tk.subject)}</h3>
      <span class="tk-dept">${esc(DEPT_NAMES[tk.dept] || tk.dept)}</span>
      <span class="tk-status ${esc(tk.status)}">${tk.status === "open" ? "открыт" : "закрыт"}</span>
      <button class="btn btn-outline btn-sm" id="tk-close-view" style="margin-left:auto">✕</button>
    </div>
    <div class="ticket-msg"><div class="who">${esc(tk.from)} · ${new Date(tk.created).toLocaleString("ru")}</div>${esc(tk.text)}</div>
    ${tk.replies.map((r) => `<div class="ticket-msg"><div class="who">🎧 ${esc(r.by)} · ${new Date(r.ts).toLocaleString("ru")}</div>${esc(r.text)}</div>`).join("")}
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      <input class="sup-input" id="tk-reply" placeholder="Ответ пользователю" style="flex:1;min-width:220px" />
      <button class="btn btn-primary btn-sm" id="tk-send">Ответить</button>
      <button class="btn btn-outline btn-sm" id="tk-toggle">${tk.status === "open" ? "Закрыть тикет" : "Открыть заново"}</button>
    </div>`;
  view.querySelector("#tk-close-view").addEventListener("click", () => { openTicketId = null; view.hidden = true; });
  view.querySelector("#tk-send").addEventListener("click", async () => {
    const reply = view.querySelector("#tk-reply").value.trim();
    if (!reply) return;
    const d = await api("ticket-update", { id: tk.id, reply });
    if (d?.ok) { Object.assign(tk, d.ticket); renderTicket(); }
  });
  view.querySelector("#tk-toggle").addEventListener("click", async () => {
    const d = await api("ticket-update", { id: tk.id, status: tk.status === "open" ? "closed" : "open" });
    if (d?.ok) { Object.assign(tk, d.ticket); renderTicket(); renderList(); }
  });
}

async function loadTickets() {
  const d = await api("tickets");
  if (d?.ok) { tickets = d.tickets; renderList(); }
}

async function renderStaffList() {
  const d = await api("staff-list");
  if (!d?.ok) return;
  document.getElementById("staff-list").innerHTML = d.staff
    .map((s) => `<div class="side-tariff"><span>${esc(s.login)} · ${esc(DEPT_NAMES[s.dept] || s.dept)}${s.role === "owner" ? " · владелец" : ""}</span>
      ${s.role === "owner" ? "" : `<button class="btn btn-outline btn-sm" data-del="${esc(s.login)}">Удалить</button>`}</div>`)
    .join("");
  document.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!confirm(`Удалить сотрудника ${b.dataset.del}?`)) return;
      await api("delete-staff", { login: b.dataset.del });
      renderStaffList();
    })
  );
}

function showPanel() {
  document.getElementById("sup-login-form").hidden = true;
  document.getElementById("sup-panel").hidden = false;
  document.getElementById("sup-logout").hidden = false;
  document.getElementById("sup-whoami").textContent = `${me.login} · ${DEPT_NAMES[me.dept] || me.dept}${me.role === "owner" ? " · владелец" : ""}`;
  document.getElementById("owner-tools").hidden = me.role !== "owner";
  renderTabs();
  loadTickets();
  if (me.role === "owner") renderStaffList();
  setInterval(loadTickets, 15000);
}

document.getElementById("sup-login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = document.getElementById("sup-login-err");
  err.hidden = true;
  const d = await api("login", {
    login: document.getElementById("sup-login").value.trim(),
    password: document.getElementById("sup-pass").value,
  });
  if (d?.ok) {
    me = { token: d.token, login: d.login, dept: d.dept, role: d.role };
    sessionStorage.setItem("staff", JSON.stringify(me));
    showPanel();
  } else {
    err.hidden = false;
  }
});

document.getElementById("sup-logout").addEventListener("click", logout);
document.getElementById("sup-settings-btn").addEventListener("click", () => {
  const s = document.getElementById("sup-settings");
  s.hidden = !s.hidden;
  if (!s.hidden) { openTicketId = null; document.getElementById("ticket-view").hidden = true; }
});

document.getElementById("pw-save").addEventListener("click", async () => {
  const oldPass = document.getElementById("pw-old").value;
  const newPass = document.getElementById("pw-new").value;
  if (newPass.length < 8) { alert("Новый пароль — минимум 8 символов"); return; }
  const d = await api("change-password", { old: oldPass, password: newPass });
  alert(d?.ok ? "Пароль изменён" : "Неверный текущий пароль");
  if (d?.ok) { document.getElementById("pw-old").value = ""; document.getElementById("pw-new").value = ""; }
});

document.getElementById("st-create").addEventListener("click", async () => {
  const d = await api("create-staff", {
    login: document.getElementById("st-login").value.trim(),
    password: document.getElementById("st-pass").value,
    dept: document.getElementById("st-dept").value,
  });
  if (d?.ok) {
    document.getElementById("st-login").value = "";
    document.getElementById("st-pass").value = "";
    renderStaffList();
  } else {
    alert(d?.error === "taken" ? "Логин уже занят" : d?.error === "weak_password" ? "Пароль — минимум 8 символов" : "Проверьте логин (3–32 символа: a-z, 0-9, _)");
  }
});

// Тема
function applyTheme() {
  const theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = theme === "light" ? "☾" : "☀";
}
document.getElementById("theme-toggle").addEventListener("click", () => {
  localStorage.setItem("theme", document.documentElement.dataset.theme === "light" ? "dark" : "light");
  applyTheme();
});
applyTheme();

// Восстановление смены сотрудника
try {
  const saved = JSON.parse(sessionStorage.getItem("staff"));
  if (saved?.token) {
    me = saved;
    api("me").then((d) => { if (d?.ok) showPanel(); else logout(); });
  }
} catch { /* нет сохранённой смены */ }
