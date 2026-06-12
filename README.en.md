# ⚽ hAI.WMPlan — FIFA World Cup 2026 Tournament Planner

<p align="center">
  <img src="logo.png" alt="hAI.WMPlan Logo" width="180">
</p>

<p align="center">
  <b>Interactive WC 2026 tournament planner — live, local, self-hosted, offline-capable.</b><br>
  48 Teams · 12 Groups · 6 Knockout Rounds · Live Scores · PWA · Docker-ready
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="MIT">
  <img src="https://img.shields.io/badge/Vanilla_JS-ES2022-facc15?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/PWA-Offline--ready-8b5cf6?style=for-the-badge&logo=pwa">
  <img src="https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/Build-not%20required-10b981?style=for-the-badge">
</p>

<p align="center">
  <a href="README.md">🇩🇪 Deutsche Version</a>
</p>

---

## 🌍 What is hAI.WMPlan?

**hAI.WMPlan** is a fully self-hosted, interactive web app for the **FIFA World Cup 2026** schedule (Canada 🇨🇦 · Mexico 🇲🇽 · USA 🇺🇸).

Enter match results — the app **automatically** calculates group standings, determines the advancing teams, and populates the **complete knockout bracket through the final**. Live scores are updated every 60 seconds via API. As a **PWA**, the app can be installed directly to the home screen and works fully offline.

---

## ✨ Features

### 🏟️ Group Stage
- 48 teams with real country flags (flag-icons 7.2.3 via jsDelivr + SRI)
- 12 groups A–L with 4 teams and 6 matches each
- Automatic standings: points, goals, goal difference, games played
- 🟢 Qualified (1st + 2nd) · 🔵 Possibly advancing (3rd place)
- 🔒 Locked before kick-off · 📅 Today's matches highlighted

### 🏆 Knockout Phase
```
Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final
 (16 matches)   (8 matches)    (4 matches)    (2 matches)   🥇
```
- Winners automatically advance to the next round
- Penalty shootout input on draws
- Third-place playoff · Final with 🏆 indicator

### 🔴 Live Polling (worldcup26.ir)
| Status | Behavior |
|---|---|
| No match in window | Checks every 5 min |
| 15 min before kick-off | 60s polling starts |
| Match in progress | Pulsing red border + minute |
| Match finished | Final score saved |

### 📱 PWA / Offline
- **Service Worker** (Cache-First for assets, Network-First for API)
- **Installable** via browser banner or `📲 Install app` button
- Works **fully offline** (entered results are preserved)
- Home screen icon, splash screen, `display: standalone`

### 💻 Responsive Design
| Breakpoint | Layout |
|---|---|
| ≥ 1280px (Wide) | 4-column group grid |
| 768–1279px (Desktop) | 3 columns |
| 480–767px (Tablet) | 2 columns, compact header |
| < 480px (Mobile) | 1 column, touch-optimised |
| `pointer: coarse` | Larger tap targets (min. 36px) |
| Landscape phone | Flatter header |

### 🛡️ Security & Quality
- `Content-Security-Policy` in HTML
- SRI hash for external CSS (flag-icons)
- XSS escaping of all dynamic content
- ARIA labels, keyboard navigation, focus management
- Print-optimised CSS

---

## 📁 Project Structure

```
hAI.WMPlan/
├── index.html            ← HTML skeleton + meta + CSP
├── style.css             ← Complete CSS (dark/light, responsive, print)
├── app.js                ← Full app logic (teams, standings, KO, live, PWA)
├── sw.js                 ← Service Worker (Cache-First, offline)
├── manifest.webmanifest  ← PWA manifest
├── logo.png              ← App logo (header, favicon, PWA icon)
├── Dockerfile            ← Nginx Alpine image
├── nginx.conf            ← Production Nginx (gzip, caching, health)
├── docker-compose.yml    ← Portainer stack
└── README.md             ← German docs (this file in English)
```

---

## 🚀 Quick Start

### Option 1 — Browser directly
```bash
git clone https://github.com/jbkunama1/hAI.WMPlan.git
open hAI.WMPlan/index.html
```
> Note: Service Worker requires HTTPS or `localhost`. PWA features are disabled over `file://`.

### Option 2 — Docker (build locally)
```bash
git clone https://github.com/jbkunama1/hAI.WMPlan.git
cd hAI.WMPlan
docker compose up -d --build
# → http://localhost:8026
```

### Option 3 — Portainer Stack (recommended)
1. Portainer → **Stacks → Add stack**
2. **Repository** → `https://github.com/jbkunama1/hAI.WMPlan`
3. Compose path: `docker-compose.yml`
4. Optional: Environment variable `WM_PORT=8026`
5. **Deploy the stack**

### Option 4 — Existing Nginx server
```nginx
server {
  listen 80;
  server_name wm.yourdomain.com;
  root /var/www/hAI.WMPlan;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```

---

## 🌐 API & Live Data

| Property | Value |
|---|---|
| Endpoint | [worldcup26.ir/get/games](https://worldcup26.ir/get/games) |
| Cost | Free, no API key required |
| Poll interval | 60 seconds |
| Fallback | Manual entry always available |

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JS (ES2022) |
| Flags | [flag-icons 7.2.3](https://github.com/lipis/flag-icons) |
| Offline | Service Worker (Cache-First) |
| PWA | Web App Manifest |
| Persistence | `localStorage` |
| Hosting | Nginx Alpine / Docker / any web server |

---

## 🤝 Credits

- Groups & teams: **FIFA / Sportschau.de**, as of 12 Jun 2026
- Flags: [flag-icons](https://github.com/lipis/flag-icons) — Panayiotis Lipiridis (MIT)
- Live data: [worldcup26.ir](https://worldcup26.ir)
- Built with 🤖 [Perplexity AI](https://perplexity.ai) + ❤️ by Daniel Lienhard

---

## 📄 License

MIT License — free to use, modify and distribute.

---

<p align="center">
  Made with ⚽ · 🔴 · 🤖 · for the World Cup 2026<br>
  <b>Canada 🇨🇦 · Mexico 🇲🇽 · USA 🇺🇸</b>
</p>
