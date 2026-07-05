export async function onRequestGet({ env, params }) {
  const raw = await env.CHAT.get(`media:${params.id}`);
  if (!raw) return new Response("Not found", { status: 404 });
  const { type, name, data } = JSON.parse(raw);
  const base64 = data.slice(data.indexOf(",") + 1);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${encodeURIComponent(name)}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
