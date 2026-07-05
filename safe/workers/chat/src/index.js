import { DurableObject } from "cloudflare:workers";

const MAX_MESSAGES = 100;

export class ChatRoom extends DurableObject {
  async getMessages(since = 0) {
    const msgs = (await this.ctx.storage.get("msgs")) || [];
    return since ? msgs.filter((m) => m.ts > since) : msgs;
  }

  async addMessage(msg) {
    const msgs = (await this.ctx.storage.get("msgs")) || [];
    msgs.push(msg);
    await this.ctx.storage.put("msgs", msgs.slice(-MAX_MESSAGES));
    return msg;
  }
}

export default {
  fetch() {
    return new Response("myavka-chat-do", { status: 200 });
  },
};
