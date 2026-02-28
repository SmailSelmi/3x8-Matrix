<div align="center">

# Trois Huit | 3×8 🔄

**Advanced Shift Schedule Management PWA — Arabic First, Offline First**

[![Live App](https://img.shields.io/badge/Live%20App-trois--huit.vercel.app-blue?style=for-the-badge&logo=vercel)](https://trois-huit.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Free%20Tier-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 📱 Overview

**Trois Huit** is a fully offline-capable Progressive Web App (PWA) built for shift workers in 3×8 industrial rotation systems. It calculates your exact shift status — whether you're on a **morning**, **afternoon**, or **night** shift, or on **vacation** — based on your personal cycle configuration.

The app is entirely in **Arabic (RTL)**, designed for maximum readability on mobile devices and installable as a native app on both Android and iOS.

---

## ✨ Features

### 📅 Shift Engine

- Real-time shift calculation based on configurable cycle start date
- Supports **3×8 Industrial** and **weekly rotation** systems
- Visual shift gauge showing cycle progress, shift type, and hours remaining
- Interactive calendar with full schedule visualization

### 🔔 Broadcast Push Notifications (Headless Admin)

- **Mandatory permission gate** — users must subscribe to use the app
- Push subscriptions stored in **Supabase** (no user account required)
- Admin broadcasts via **Telegram Bot** — no web dashboard needed
- `/broadcast <message>` → Web Push sent to all registered PWA users
- Auto-cleanup of stale/expired subscriptions (HTTP 410)

### 📊 Statistics & Analytics

- Annual leave tracking with custom leave pool management
- Work/vacation day counters across rolling time windows
- Export monthly schedule as a shareable image (PNG)

### ⚙️ PWA / Offline

- Full offline support via Service Worker caching
- Installable on Android and iOS (standalone display mode)
- Dark theme only, `Tajawal` Arabic font, RTL layout throughout

### 📈 Analytics

- Microsoft Clarity for session recordings and heatmaps

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PWA (Next.js)                      │
│  PushPermissionGate → usePushSubscription hook       │
│  → Service Worker pushManager.subscribe()            │
│  → Supabase (push_subscriptions table)              │
└──────────────────────┬──────────────────────────────┘
                       │
            ┌──────────▼──────────┐
            │  Supabase (Free)    │
            │  push_subscriptions │
            └──────────┬──────────┘
                       │ fetched by
            ┌──────────▼──────────┐
            │  /api/telegram-     │◄── Telegram Bot
            │  webhook (Next.js)  │    /broadcast msg
            └──────────┬──────────┘
                       │ web-push
            ┌──────────▼──────────┐
            │  All PWA Users      │
            │  Native OS Push 🔔  │
            └─────────────────────┘
```

---

## 🚀 Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Framework     | Next.js 16 (App Router)           |
| Styling       | Tailwind CSS v4                   |
| Animations    | Framer Motion                     |
| Database      | Supabase (PostgreSQL, Free Tier)  |
| Push          | Web Push API + `web-push` npm     |
| Admin Channel | Telegram Bot API                  |
| Analytics     | Microsoft Clarity                 |
| Deployment    | Vercel                            |
| Font          | Tajawal (Arabic) + JetBrains Mono |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- A Supabase project (free tier)
- A Telegram bot (from @BotFather)

### 1. Clone & install

```bash
git clone https://github.com/SmailSelmi/Trois-Huit.git
cd Trois-Huit
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Supabase (public — safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Supabase (secret — server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# VAPID Keys — generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=B...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@example.com

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:AAF...
ADMIN_CHAT_ID=123456789
```

### 3. Create the Supabase table

Run this in your Supabase **SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon inserts" ON push_subscriptions
  FOR INSERT TO anon WITH CHECK (true);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📡 Telegram Webhook Setup (Production)

After deploying to Vercel, register your Telegram webhook **once**:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-domain>.vercel.app/api/telegram-webhook"
```

Then broadcast to all users by messaging your bot:

```
/broadcast الرسالة التي تريد إرسالها لجميع المستخدمين
```

The bot replies with a delivery report showing success/fail counts and auto-removed stale subscriptions.

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout + SW registration + Clarity
│   ├── page.tsx            # Main app shell (wrapped in PushPermissionGate)
│   └── api/
│       └── telegram-webhook/
│           └── route.ts    # Broadcast endpoint
├── components/
│   ├── PushPermissionGate.tsx   # Mandatory push permission modal
│   ├── CalendarView.tsx
│   ├── ShiftCard.tsx
│   ├── StatsView.tsx
│   └── ...
├── hooks/
│   ├── usePushSubscription.ts   # Web Push subscription logic
│   ├── useShiftLogic.ts         # Core shift calculation engine
│   ├── useNotifications.ts      # Local shift reminders
│   └── ...
├── lib/
│   └── supabaseClient.ts        # Supabase browser client
└── public/
    ├── sw.js                    # Service Worker (cache + push handler)
    └── manifest.json            # PWA manifest
```

---

## 📄 License

MIT © [Smail Selmi](https://github.com/SmailSelmi)
