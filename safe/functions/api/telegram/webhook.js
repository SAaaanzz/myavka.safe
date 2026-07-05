// Webhook Telegram-бота (Cloudflare Pages Function).
// Регистрация: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<домен>/api/telegram/webhook

// Глава сервиса — только он назначает и снимает администраторов
const OWNER_ID = "5840888651";

async function reply(env, chatId, text, replyMarkup) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
  });
}

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const HELP =
  "Команды:\n/start, /login — кнопка для входа на сайт\n/balance — ваш баланс на сайте\n/help — эта справка\n\nДля администраторов:\n" +
  "/credit <ник> <сумма> — изменить баланс пользователя\n" +
  "/ban <ник> — заблокировать пользователя\n/unban <ник> — разблокировать пользователя\n" +
  "/verify <ник> — выдать галочку верификации\n/unverify <ник> — снять галочку\n" +
  "/banacc <ID> — внести ID аккаунта в бан-базу (украден/возвращён)\n" +
  "/unbanacc <ID> — убрать ID из бан-базы\n/banned — кто сейчас в бане\n\nДля главы:\n" +
  "/addadmin <telegram_id> — назначить администратора\n" +
  "/deladmin <telegram_id> — снять администратора\n/admins — список администраторов";

export async function onRequestPost({ request, env }) {
  const update = await request.json().catch(() => null);
  const message = update?.message;
  if (!message?.text || !env.TELEGRAM_BOT_TOKEN) return Response.json({ ok: true });

  const chatId = String(message.chat.id);
  const [cmdRaw, ...args] = message.text.trim().split(/\s+/);
  const cmd = cmdRaw.split("@")[0];
  const siteUrl = new URL(request.url).origin;

  const isOwner = chatId === OWNER_ID;
  const isAdmin = isOwner || Boolean(await env.CHAT.get(`admin:${chatId}`));
  const norm = (n) => String(n || "").replace(/^@/, "").toLowerCase();

  let text;
  switch (cmd) {
    case "/start":
    case "/login": {
      // Выдаём персональную ссылку для входа на сайт (код привязан к Telegram ID)
      const uname = (message.from?.username || "").toLowerCase();
      const nick = /^[a-z0-9_]{3,32}$/.test(uname) ? uname : `id${message.from.id}`;
      const key = `unick:${nick}`;
      const acc = JSON.parse((await env.CHAT.get(key)) || "null");
      if (!acc) {
        await env.CHAT.put(key, JSON.stringify({ tgId: String(message.from.id), balance: 0, created: Date.now() }));
      } else if (acc.tgId !== String(message.from.id)) {
        text = "⛔ Этот ник уже привязан к другому Telegram-аккаунту.";
        break;
      }
      const code = toHex(crypto.getRandomValues(new Uint8Array(16)));
      await env.CHAT.put(`login:${code}`, JSON.stringify({ nick }), { expirationTtl: 300 });
      await reply(
        env,
        chatId,
        `🛡️ Myavka.safe — гарант безопасных сделок.\n\nВаш профиль: @${nick}\nНажмите кнопку ниже — сайт откроется уже с вашим профилем.\nСсылка одноразовая и действует 5 минут — никому её не передавайте.\n\nНовая ссылка — /login. Команды — /help`,
        { inline_keyboard: [[{ text: "🔐 Войти на сайт", url: `${siteUrl}/?login=${code}` }]] }
      );
      return Response.json({ ok: true });
    }
    case "/balance": {
      const nick = message.from?.username?.toLowerCase();
      const key = `unick:${/^[a-z0-9_]{3,32}$/.test(nick || "") ? nick : `id${message.from.id}`}`;
      const acc = JSON.parse((await env.CHAT.get(key)) || "null");
      text = acc ? `💰 Ваш баланс: ${acc.balance || 0} ₸` : "Вы ещё не зарегистрированы — войдите через сайт.";
      break;
    }
    case "/credit": {
      if (!isAdmin) { text = "⛔ Команда доступна только администраторам."; break; }
      const nick = norm(args[0]);
      const amount = Math.round(Number(args[1]));
      if (!nick || !Number.isFinite(amount)) { text = "Формат: /credit <ник> <сумма> (сумма может быть отрицательной)"; break; }
      const key = `unick:${nick}`;
      const acc = JSON.parse((await env.CHAT.get(key)) || "null");
      if (!acc) { text = `Пользователь @${nick} не найден.`; break; }
      acc.balance = Math.max(0, (acc.balance || 0) + amount);
      await env.CHAT.put(key, JSON.stringify(acc));
      text = `💰 Баланс @${nick}: ${acc.balance} ₸ (${amount >= 0 ? "+" : ""}${amount})`;
      break;
    }
    case "/help":
      text = HELP;
      break;
    case "/addadmin":
    case "/deladmin": {
      if (!isOwner) { text = "⛔ Команда доступна только главе сервиса."; break; }
      const id = String(args[0] || "").replace(/\D/g, "");
      if (!id) { text = "Укажите Telegram ID: " + cmd + " <telegram_id>"; break; }
      if (cmd === "/addadmin") {
        await env.CHAT.put(`admin:${id}`, JSON.stringify({ by: OWNER_ID, ts: Date.now() }));
        text = `✅ ${id} назначен администратором.`;
      } else {
        await env.CHAT.delete(`admin:${id}`);
        text = `✅ ${id} снят с администраторов.`;
      }
      break;
    }
    case "/admins": {
      if (!isOwner) { text = "⛔ Команда доступна только главе сервиса."; break; }
      const admins = (await env.CHAT.list({ prefix: "admin:" })).keys.map((k) => k.name.slice(6));
      text = `Глава: ${OWNER_ID}\nАдминистраторы:\n${admins.join("\n") || "—"}`;
      break;
    }
    case "/verify":
    case "/unverify": {
      if (!isAdmin) { text = "⛔ Команда доступна только администраторам."; break; }
      const nick = norm(args[0]);
      if (!nick) { text = "Укажите ник: " + cmd + " <ник>"; break; }
      const key = `unick:${nick}`;
      const acc = JSON.parse((await env.CHAT.get(key)) || "null");
      if (!acc) { text = `Пользователь @${nick} не найден.`; break; }
      acc.verified = cmd === "/verify";
      await env.CHAT.put(key, JSON.stringify(acc));
      text = acc.verified ? `✔️ @${nick} верифицирован — голубая галочка выдана.` : `Галочка у @${nick} снята.`;
      break;
    }
    case "/ban":
    case "/unban": {
      if (!isAdmin) { text = "⛔ Команда доступна только администраторам."; break; }
      const nick = norm(args[0]);
      if (!nick) { text = "Укажите ник: " + cmd + " <ник>"; break; }
      if (cmd === "/ban") {
        await env.CHAT.put(`ban:${nick}`, JSON.stringify({ by: chatId, ts: Date.now() }));
        text = `🚫 Пользователь @${nick} заблокирован.`;
      } else {
        await env.CHAT.delete(`ban:${nick}`);
        text = `✅ Пользователь @${nick} разблокирован.`;
      }
      break;
    }
    case "/banacc":
    case "/unbanacc": {
      if (!isAdmin) { text = "⛔ Команда доступна только администраторам."; break; }
      const accId = args[0];
      if (!accId) { text = "Укажите ID аккаунта: " + cmd + " <ID>"; break; }
      if (cmd === "/banacc") {
        await env.CHAT.put(`banned_acc:${accId}`, JSON.stringify({ reason: args.slice(1).join(" ") || "stolen", ts: Date.now() }));
        text = `🚫 ID аккаунта ${accId} внесён в бан-базу.`;
      } else {
        await env.CHAT.delete(`banned_acc:${accId}`);
        text = `✅ ID аккаунта ${accId} убран из бан-базы.`;
      }
      break;
    }
    case "/banned": {
      if (!isAdmin) { text = "⛔ Команда доступна только администраторам."; break; }
      const users = (await env.CHAT.list({ prefix: "ban:" })).keys.map((k) => "@" + k.name.slice(4));
      const accs = (await env.CHAT.list({ prefix: "banned_acc:" })).keys.map((k) => k.name.slice(11));
      text = `Пользователи в бане:\n${users.join("\n") || "—"}\n\nID аккаунтов в бан-базе:\n${accs.join("\n") || "—"}`;
      break;
    }
    default:
      text = "Неизвестная команда. Наберите /help";
  }

  await reply(env, chatId, text);
  return Response.json({ ok: true });
}
