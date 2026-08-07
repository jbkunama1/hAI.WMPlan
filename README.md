# 🔵 KSC – Fan Dashboard

<p align="center">
  <img src="logo.png" alt="KSC Logo" width="180">
</p>

<p align="center">
  <b>Alles zum Karlsruher SC auf einen Blick – 2. Bundesliga, Kader, News, Live.</b><br>
  PWA · Live-Daten · Blau-Weiß & Badisch Rot-Gelb
</p>

---

## ⚽ Was ist das?

Ein schlankes, selbst gehostetes **Fan-Dashboard für den Karlsruher SC**. Täglich die News checken, Spieltage verfolgen und den Kader im Blick behalten – auf dem Handy installierbar, offline-fähig, ohne Account.

## ✨ Features

### 🏟️ Übersicht
- KSC-Platz, Punkte, Siege/Unentschieden/Niederlagen (openligaDB)
- Nächster Spieltag: Gegner, Datum, Stadion
- Neueste News auf einen Blick

### 🗓️ Spieltage (2. Bundesliga)
- Kompletter KSC-Spielplan der Saison, live aus **openligaDB**
- Ausstehende, laufende & beendete Spiele, mit LIVE-Status
- Automatische Aktualisierung (Polling)

### 👥 Kader
- **Profis** · **Amateure** · **Frauen** in einem Tab
- Spielernummer, Position, Status (fit / verletzt / gesperrt)

### 📰 News
- **Live-News** direkt von ksc.de (Profis + Akademie) über den lokalen News-Proxy
- Manuell gepflegte News (inkl. Frauen) als Fallback – auch offline
- „live"-Tag für automatisch geladene Meldungen

### 🎨 Themes
- 🔵 **KSC Blau-Weiß** (Standard) · 🔴 **Badisch Rot-Gelb** · 🌙 dunkel · ☀️ hell

### 📱 PWA
- Installierbar auf dem Home-Screen, funktioniert offline
- Service Worker mit Cache-First für Assets

## 📁 Projektstruktur

```
hAI.WMPlan/
├── index.html            ← HTML + CSP + Theme-FOUC-Guard
├── style.css             ← Themes (ksc/badisch/dark/light), Responsive, Print
├── app.js                ← App-Logik (Tabs, Daten, Polling, News)
├── server.js             ← Kleiner Server: statisch + News-Proxy (/api/news)
├── data/ksc-data.js      ← Gepflegter Kader + Fallback-News
├── sw.js                 ← Service Worker (Offline)
├── manifest.webmanifest  ← PWA-Manifest
└── logo.png              ← Logo
```

## 🚀 Start

### Lokal (empfohlen – für Live-News)
```bash
node server.js
# → http://localhost:8123
```
Ohne `server.js` läuft die App auch direkt per `index.html`, dann ohne Live-News vom ksc.de-Proxy.

### Docker / Nginx
```bash
docker compose up -d --build
```
> Hinweis: Der News-Proxy (`/api/news`) wird nur vom Node-Server bereitgestellt; unter Nginx erscheinen die manuell gepflegten News.

## 🌐 Datenquellen

| Daten | Quelle |
|---|---|
| Spieltage & Tabelle | [openligaDB](https://www.openligadb.de) (kostenlos, kein Key) |
| News (live) | ksc.de Profis + Akademie (über `server.js`-Proxy) |
| Kader & Fallback-News | `data/ksc-data.js` (gepflegt) |

## 📄 Lizenz

MIT License — frei verwendbar, veränderbar, weitergabe erlaubt.

---

<p align="center">
  Made with 🔵 · 🤖 · ❤️ für den Karlsruher SC
</p>
