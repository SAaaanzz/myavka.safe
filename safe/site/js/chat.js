// Живой чат: сообщения хранятся на бэке (Cloudflare KV), обновление раз в 2.5 с
const API = "/api/chat/";
const MAX_FILE = 5 * 1024 * 1024; // 5 МБ

const DIALOGS = [
  { id: "general", name: "Общий чат", av: "av-4", online: true, paid: null },
  {
    id: "diamond_kz", name: "@diamond_kz", av: "av-1", online: true,
    paid: { order: "#4821", title: "Донат 706 алмазов Mobile Legends", amount: "2 500 ₸" },
  },
  { id: "stars_market", name: "@stars_market", av: "av-2", online: true, paid: null },
  { id: "pubg_boost", name: "@pubg_boost_pro", av: "av-3", online: false, paid: null },
];

let activeId = DIALOGS[0].id;
const cache = {}; // roomId -> msgs

let me = null; // ник авторизованного пользователя (задаётся после входа)

// escHtml — общая функция из app.js (подключается раньше на всех страницах)

function renderMedia(m) {
  if (!m.media) return "";
  const { type, name } = m.media;
  const src = m.media.data || m.media.url;
  if (type.startsWith("image/")) return `<a href="${src}" target="_blank"><img src="${src}" alt="${escHtml(name)}" /></a>`;
  if (type.startsWith("video/")) return `<video src="${src}" controls></video>`;
  if (type.startsWith("audio/")) return `<audio src="${src}" controls></audio>`;
  return `<a class="file-link" href="${src}" download="${escHtml(name)}">📎 ${escHtml(name)}</a>`;
}

function renderDialogList() {
  document.getElementById("dlg-list").innerHTML = DIALOGS.map((d) => {
    const msgs = cache[d.id] || [];
    const last = msgs[msgs.length - 1];
    const lastText = last ? (last.text || "📎 " + (last.media?.name || "файл")) : t("chats.noMsgs");
    return `<button class="dlg ${d.id === activeId ? "active" : ""}" data-id="${d.id}">
      <span class="avatar ${d.av}">${escHtml(d.name.replace("@", "")[0].toUpperCase())}</span>
      <span class="dlg-info">
        <span class="dlg-name">${escHtml(d.name)} ${d.online ? '<span class="online-dot"></span>' : ""}</span>
        <span class="dlg-last">${escHtml(lastText)}</span>
      </span>
      ${d.paid ? '<span class="dlg-paid">₸</span>' : ""}
    </button>`;
  }).join("");
  document.querySelectorAll(".dlg").forEach((el) =>
    el.addEventListener("click", () => { activeId = el.dataset.id; renderChat(); renderDialogList(); poll(); })
  );
}

function renderChat() {
  const d = DIALOGS.find((x) => x.id === activeId);
  document.getElementById("chat-head").innerHTML =
    `<span class="avatar ${d.av}">${escHtml(d.name.replace("@", "")[0].toUpperCase())}</span>
     ${d.online ? '<span class="online-dot"></span>' : ""}
     <strong>${escHtml(d.name)}</strong>
     <span style="color:var(--muted);font-size:.85rem">${d.online ? t("chats.online") : t("chats.offline")}</span>
     <span style="margin-left:auto;color:var(--muted);font-size:.8rem">${t("chats.you")}: <strong>${escHtml(me)}</strong></span>`;

  const banner = document.getElementById("paid-banner");
  if (d.paid) {
    banner.hidden = false;
    banner.innerHTML = `✅ ${t("chats.paidBanner")} ${escHtml(d.paid.order)} — ${escHtml(d.paid.title)} · <strong>${escHtml(d.paid.amount)}</strong> ${t("chats.inEscrow")}
      <button class="btn btn-green btn-sm" id="deal-finish" style="margin-left:10px">${t("chats.finishDeal")}</button>`;
    document.getElementById("deal-finish").addEventListener("click", () => finishDeal(d));
  } else {
    banner.hidden = true;
  }

  const body = document.getElementById("chat-body");
  const nearBottom = body.scrollHeight - body.scrollTop - body.clientHeight < 80;
  const msgs = cache[activeId] || [];
  body.innerHTML = msgs.length
    ? msgs.map((m) =>
        `<div class="msg ${m.from === me ? "me" : "them"}">
           <div class="who">${escHtml(m.from)}${m.verified === true ? '<span class="vbadge" role="button">✓</span>' : ""}</div>
           ${renderMedia(m)}${m.text ? escHtml(m.text) : ""}
         </div>`
      ).join("")
    : `<div class="msg system">${t("chats.empty")}</div>`;
  if (nearBottom || !body.dataset.scrolled) body.scrollTop = body.scrollHeight;
  body.dataset.scrolled = "1";

  // Клик по галочке — показать подпись «Пользователь верифицирован» рядом
  body.querySelectorAll(".vbadge").forEach((el) =>
    el.addEventListener("click", () => {
      if (el.nextElementSibling?.classList.contains("vbadge-label")) { el.nextElementSibling.remove(); return; }
      const label = document.createElement("span");
      label.className = "vbadge-label";
      label.textContent = t("chats.verified");
      el.after(label);
    })
  );
}

async function poll() {
  const room = activeId;
  try {
    const res = await fetch(API + room);
    if (!res.ok) return;
    const { msgs } = await res.json();
    const changed = !cache[room] || cache[room].length !== msgs.length;
    cache[room] = msgs;
    if (changed) { if (room === activeId) renderChat(); renderDialogList(); }
  } catch { /* сеть недоступна — попробуем в следующий цикл */ }
}

async function post(payload) {
  const room = activeId;
  const res = await fetch(API + room, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (getUser()?.token || ""),
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 403) {
    alert(t("chats.banned"));
    return;
  }
  if (res.status === 401) {
    // сессия истекла — просим войти заново
    localStorage.removeItem("user");
    requireAuth((user) => { me = user.name; post(payload); }, () => { location.href = "index.html"; });
    return;
  }
  if (res.ok) {
    const { msg } = await res.json();
    (cache[room] = cache[room] || []).push(msg);
    renderChat();
    renderDialogList();
  }
}

// Завершение сделки: ID проданного аккаунта проверяется по бан-базе на сервере
function finishDeal(d) {
  showPromptModal(t("chats.accIdPrompt"), t("chats.finishDeal"), async (accountId) => {
    try {
      const res = await fetch("/api/deals/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (getUser()?.token || ""),
        },
        body: JSON.stringify({ accountId, seller: d.name, title: d.paid?.title || "" }),
      });
      const data = await res.json();
      if (!res.ok) { showInfoModal(t("auth.errNet")); return; }
      showInfoModal(data.flagged ? t("chats.dealFlagged") : t("chats.dealDone"));
    } catch {
      showInfoModal(t("auth.errNet"));
    }
  });
}

function sendMessage() {
  const input = document.getElementById("chat-text");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  post({ text });
}

document.getElementById("chat-send").addEventListener("click", sendMessage);
document.getElementById("chat-text").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

// Вложения: фото, видео, файлы
function sendFile(file) {
  if (!file) return;
  if (file.size > MAX_FILE) { alert(t("chats.tooLarge")); return; }
  const reader = new FileReader();
  reader.onload = () => post({ text: "", media: { type: file.type || "application/octet-stream", name: file.name || "clipboard.png", data: reader.result } });
  reader.readAsDataURL(file);
}

const fileInput = document.getElementById("chat-file");
document.getElementById("chat-attach").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileInput.value = "";
  sendFile(file);
});

// Ctrl+V: вставка фото/файлов из буфера обмена
document.addEventListener("paste", (e) => {
  const files = [...(e.clipboardData?.items || [])]
    .filter((i) => i.kind === "file")
    .map((i) => i.getAsFile())
    .filter(Boolean);
  if (!files.length) return;
  e.preventDefault();
  files.forEach(sendFile);
});

// Drag & drop файлов в окно чата
const chatEl = document.querySelector(".chat");
["dragover", "dragenter"].forEach((ev) =>
  chatEl.addEventListener(ev, (e) => { e.preventDefault(); chatEl.classList.add("drop-target"); })
);
["dragleave", "drop"].forEach((ev) =>
  chatEl.addEventListener(ev, (e) => { e.preventDefault(); chatEl.classList.remove("drop-target"); })
);
chatEl.addEventListener("drop", (e) => [...e.dataTransfer.files].forEach(sendFile));

// Уведомление об оплате заказа
const paidDialog = DIALOGS.find((d) => d.paid);
document.getElementById("toast-desc").textContent = `${paidDialog.paid.order} · ${paidDialog.paid.title} · ${paidDialog.paid.amount}`;
document.getElementById("toast-go").addEventListener("click", () => {
  activeId = paidDialog.id;
  renderChat(); renderDialogList(); poll();
  document.getElementById("pay-toast").hidden = true;
});
document.getElementById("toast-close").addEventListener("click", () => {
  document.getElementById("pay-toast").hidden = true;
});
function init() {
  renderDialogList();
  renderChat();
  poll();
  setInterval(poll, 2500);
  setTimeout(() => { document.getElementById("pay-toast").hidden = false; }, 1200);
}

// Чат доступен только зарегистрированным
requireAuth(
  (user) => { me = user.name; init(); },
  () => { location.href = "index.html"; }
);
document.addEventListener("langchange", () => { if (me) { renderChat(); renderDialogList(); } });
