// Анти-мигание темы: выполняется синхронно в <head>, до отрисовки body,
// чтобы страница сразу отрисовалась в правильной теме (без "вспышки").
// Логика идентична на всех страницах (включая support.html) — вынесена сюда,
// чтобы не использовать inline <script> в HTML (требование CSP script-src 'self').
document.documentElement.dataset.theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
