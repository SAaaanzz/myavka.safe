// Чёрный список: последние записи + проверка контрагента (GET /api/blacklist?q=)
// escHtml/t — общие функции из app.js (подключается раньше).

function fmtBlDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  const lang = getLang();
  const locale = lang === "kz" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU";
  try {
    return d.toLocaleDateString(locale);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function renderRecent(recent) {
  const body = document.getElementById("bl-recent-body");
  if (!Array.isArray(recent) || !recent.length) {
    body.innerHTML = "";
    return;
  }
  body.innerHTML = recent.map((r) => `
    <tr>
      <td>${escHtml(fmtBlDate(r.ts))}</td>
      <td>${escHtml(r.id)}</td>
      <td>${escHtml(r.reason || "")}</td>
      <td><span class="badge-danger">${escHtml(t("bl.scammer"))}</span></td>
    </tr>
  `).join("");
}

function renderEntryBlock(entry) {
  return `<div class="lot-row">
      <span class="lot-row-title">${escHtml(entry.id)} <span style="color:var(--muted);font-weight:400">— ${escHtml(entry.reason || "")}</span></span>
      <span style="color:var(--muted);font-size:.85rem">${escHtml(fmtBlDate(entry.ts))}</span>
      <span class="badge-danger">${escHtml(t("bl.scammer"))}</span>
    </div>`;
}

function renderMatch(match) {
  const box = document.getElementById("bl-result");
  const user = match?.user || null;
  const account = match?.account || null;
  if (!user && !account) {
    box.innerHTML = `<div class="empty-note">${escHtml(t("bl.notFound"))}</div>`;
    box.hidden = false;
    return;
  }
  const parts = [];
  if (user) parts.push(renderEntryBlock(user));
  if (account) parts.push(renderEntryBlock(account));
  box.innerHTML = parts.join("");
  box.hidden = false;
}

async function fetchBlacklist(q) {
  try {
    const res = await fetch("/api/blacklist?q=" + encodeURIComponent(q || ""));
    const data = await res.json();
    return data.ok ? data : null;
  } catch {
    return null;
  }
}

async function loadRecent() {
  const data = await fetchBlacklist("");
  if (data) renderRecent(data.recent);
}

async function checkQuery() {
  const input = document.getElementById("bl-search-input");
  const q = input.value.trim();
  if (!q) return;
  const data = await fetchBlacklist(q);
  if (!data) {
    document.getElementById("bl-result").hidden = true;
    return;
  }
  renderMatch(data.match);
  if (Array.isArray(data.recent)) renderRecent(data.recent);
}

document.getElementById("bl-check-btn").addEventListener("click", checkQuery);
document.getElementById("bl-search-input").addEventListener("keydown", (e) => { if (e.key === "Enter") checkQuery(); });

loadRecent();
document.addEventListener("langchange", () => {
  // Перерисовать текущее содержимое с новым языком (badge/notFound тексты)
  const box = document.getElementById("bl-result");
  if (!box.hidden) checkQuery();
});
