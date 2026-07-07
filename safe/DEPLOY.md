# Myavka.safe — деплой и связка

Связка: **GitHub (код) → Cloudflare Pages (сайт + бэк на Pages Functions) → Telegram-бот**.

## Структура

- `site/` — статичный сайт (HTML/CSS), публикуется на Cloudflare Pages
- `functions/` — Cloudflare Pages Functions (бэкенд): `/api/health`, `/api/telegram/webhook`
- `wrangler.toml` — конфиг Cloudflare
- `.github/workflows/deploy.yml` — автодеплой на Cloudflare при push в `main`

## 1. Cloudflare Pages

1. Создайте проект: `npx wrangler pages project create myavka-safe`
   (или в дашборде Cloudflare: Workers & Pages → Create → Pages).
2. Вариант A (рекомендуется): подключите этот GitHub-репозиторий в дашборде Cloudflare Pages —
   build output directory: `site`. Деплой будет автоматическим при каждом push.
3. Вариант B: автодеплой через GitHub Actions — добавьте в secrets репозитория:
   - `CLOUDFLARE_API_TOKEN` (токен с правом Pages:Edit)
   - `CLOUDFLARE_ACCOUNT_ID`

## 2. Telegram-бот

1. Создайте бота через [@BotFather](https://t.me/BotFather) → получите токен.
2. Добавьте секреты в Cloudflare:
   - `npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name=myavka-safe`
   - `npx wrangler pages secret put TELEGRAM_WEBHOOK_SECRET --project-name=myavka-safe`
     (случайная строка, например `openssl rand -hex 32`; без неё вебхук будет молча
     игнорировать все входящие апдейты — команды бота работать не будут)
3. Зарегистрируйте webhook, передав тот же секрет в параметре `secret_token`
   (Telegram будет присылать его в заголовке `X-Telegram-Bot-Api-Secret-Token`,
   бэкенд сверяет его и отбрасывает апдейты без совпадения — так исключаются
   поддельные POST-запросы на `/api/telegram/webhook`):
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<ваш-домен>.pages.dev/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`
4. Проверьте: напишите боту `/start` — он ответит ссылкой на сайт.

## 3. Локальный просмотр

```bash
npx wrangler pages dev site
# или просто открыть site/index.html в браузере
```
