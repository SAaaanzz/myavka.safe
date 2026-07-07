// Глобальный middleware Cloudflare Pages Functions — оборачивает ВСЕ ответы
// проекта (статику из site/ и все /api/*) и добавляет заголовки безопасности.
//
// script-src 'self' — БЕЗ 'unsafe-inline' сделано осознанно: весь inline JS на
// страницах вынесен в отдельные .js-файлы (см. фронтенд). Не добавляй сюда
// 'unsafe-inline' в script-src.
//
// img-src/media-src включают data: и blob:, т.к. чат рендерит вложения из
// data-URI на клиенте (см. safe/site/js/chat.js).
const CSP =
  "default-src 'self'; " +
  "script-src 'self'; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data: blob:; " +
  "media-src 'self' data: blob:; " +
  "connect-src 'self'; " +
  "frame-ancestors 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'; " +
  "object-src 'none'";

export async function onRequest(context) {
  const res = await context.next();
  const headers = new Headers(res.headers);
  headers.set("Content-Security-Policy", CSP);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
