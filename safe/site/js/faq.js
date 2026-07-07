// Отправка тикета в поддержку со страницы FAQ.
// Вынесено из inline <script> в faq.html для совместимости со строгим CSP
// (script-src 'self', без 'unsafe-inline'). Подключается после app.js —
// использует requireAuth() и t() оттуда.
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tk-submit").addEventListener("click", () => {
    requireAuth(async (user) => {
      const subject = document.getElementById("tk-subject").value.trim();
      const text = document.getElementById("tk-text").value.trim();
      if (!subject || !text) return;
      const res = await fetch("/api/support/ticket-create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + user.token },
        body: JSON.stringify({ dept: document.getElementById("tk-dept").value, subject, text }),
      });
      if (res.ok) {
        document.getElementById("tk-subject").value = "";
        document.getElementById("tk-text").value = "";
        document.getElementById("tk-done").hidden = false;
      } else {
        alert(t("auth.errNet"));
      }
    });
  });
});
