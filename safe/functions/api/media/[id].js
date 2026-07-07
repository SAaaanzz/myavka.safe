// Тот же белый список безопасных для inline-показа MIME-типов, что и при приёме
// вложения в chat/[room].js. Всё остальное отдаём как вложение на скачивание
// с нейтральным Content-Type — никогда не отдаём inline text/html или svg,
// иначе это исполнение произвольного контента с нашего origin (XSS).
const SAFE_INLINE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "application/pdf",
]);

export async function onRequestGet({ env, params }) {
  const raw = await env.CHAT.get(`media:${params.id}`);
  if (!raw) return new Response("Not found", { status: 404 });
  const { type, name, data } = JSON.parse(raw);
  const base64 = data.slice(data.indexOf(",") + 1);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const safe = SAFE_INLINE_TYPES.has(String(type || "").toLowerCase());
  const outType = safe ? type : "application/octet-stream";
  const disposition = safe ? "inline" : "attachment";
  return new Response(bytes, {
    headers: {
      "Content-Type": outType,
      "Content-Disposition": `${disposition}; filename="${encodeURIComponent(name)}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
