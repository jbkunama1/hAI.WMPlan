# 🔵 KSC – Fan Dashboard

<p align="center">
  <img src="logo.png" alt="KSC Logo" width="180">
</p>

<p align="center">
  <b>Everything about Karlsruher SC in one place – 2. Bundesliga, squad, news, live.</b><br>
  PWA · Live data · Blau-Weiß & Badisch Rot-Gelb
</p>

---

## ⚽ What is this?

A lean, self-hosted **fan dashboard for Karlsruher SC**. Check the news daily, follow matchdays and keep an eye on the squad – installable on your phone, offline-capable, no account needed.

## ✨ Features

### 🏟️ Overview
- KSC position, points, wins/draws/losses (openligaDB)
- Next matchday: opponent, date, stadium
- Latest news at a glance

### 🗓️ Matchdays (2. Bundesliga)
- Full KSC season schedule, live from **openligaDB**
- Upcoming, in-progress & finished matches, with LIVE status
- Automatic refresh (polling)

### 👥 Squad
- **Profis** · **Amateure** · **Frauen** in one tab
- Jersey number, position, status (fit / injured / suspended)

### 📰 News
- **Live news** straight from ksc.de (Profis + Akademie) via the local news proxy
- Manually curated news (incl. women's team) as fallback – also offline
- "live" tag for automatically loaded articles

### 🎨 Themes
- 🔵 **KSC Blue-White** (default) · 🔴 **Badisch Red-Yellow** · 🌙 dark · ☀️ light

### 📱 PWA
- Installable to home screen, works offline
- Service worker with cache-first for assets

## 📁 Project structure

```
hAI.WMPlan/
├── index.html            ← HTML + CSP + theme FOUC guard
├── style.css             ← Themes (ksc/badisch/dark/light), responsive, print
├── app.js                ← App logic (tabs, data, polling, news)
├── server.js             ← Tiny server: static + news proxy (/api/news)
├── data/ksc-data.js      ← Curated squad + fallback news
├── sw.js                 ← Service worker (offline)
├── manifest.webmanifest  ← PWA manifest
└── logo.png              ← Logo
```

## 🚀 Start

### Locally (recommended – for live news)
```bash
node server.js
# → http://localhost:8123
```
Without `server.js` the app also runs directly via `index.html`, but without the ksc.de news proxy.

### Docker / Nginx
```bash
docker compose up -d --build
```
> Note: The news proxy (`/api/news`) is only provided by the Node server; under Nginx the curated news are shown.

## 🌐 Data sources

| Data | Source |
|---|---|
| Matchdays & table | [openligaDB](https://www.openligadb.de) (free, no key) |
| Live news | ksc.de Profis + Akademie (via `server.js` proxy) |
| Squad & fallback news | `data/ksc-data.js` (curated) |

## 📄 License

MIT License — free to use, modify, and share.

---

<p align="center">
  Made with 🔵 · 🤖 · ❤️ for Karlsruhe SC
</p>
