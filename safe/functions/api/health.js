export function onRequestGet() {
  return Response.json({ ok: true, service: "myavka-safe", ts: Date.now() });
}
