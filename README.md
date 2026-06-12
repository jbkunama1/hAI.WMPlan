# ⚽ hAI.WMPlan — FIFA WM 2026 Turnierplan Webapp

<p align="center">
  <img src="logo.png" alt="hAI.WMPlan Logo" width="180">
</p>

<p align="center">
  <b>Interaktiver WM-2026-Turnierplan — live, lokal, selbst gehostet, offline-fähig.</b><br>
  48 Teams · 12 Gruppen · 6 K.o.-Runden · Live-Scores · PWA · Docker-ready
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Lizenz-MIT-22c55e?style=for-the-badge" alt="MIT">
  <img src="https://img.shields.io/badge/Vanilla_JS-ES2022-facc15?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/PWA-Offline--ready-8b5cf6?style=for-the-badge&logo=pwa">
  <img src="https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/Build-nicht%20n%C3%B6tig-10b981?style=for-the-badge">
</p>

<p align="center">
  <a href="README.en.md">🇬🇧 English version</a>
</p>

---

## 🌍 Was ist hAI.WMPlan?

**hAI.WMPlan** ist eine vollständig selbst gehostete, interaktive Webapp für den **FIFA WM 2026**-Spielplan (Kanada 🇨🇦 · Mexiko 🇲🇽 · USA 🇺🇸).

Ergebnisse eintragen — die App berechnet **automatisch** Gruppentabellen, ermittelt die Weiterkommer und befüllt den **K.o.-Baum bis zum Finale**. Live-Scores werden alle 60 Sekunden per API aktualisiert. Als **PWA** lässt sich die App direkt auf dem Home-Screen installieren und funktioniert offline.

---

## ✨ Features

### 🏟️ Gruppenphase
- 48 Teams mit echten Länderflaggen (flag-icons 7.2.3 via jsDelivr + SRI)
- 12 Gruppen A–L mit je 4 Teams und 6 Spielen
- Automatische Tabelle: Punkte, Tore, Tordifferenz, Spielanzahl
- 🟢 Qualifiziert (Platz 1+2) · 🔵 Möglicherweise weiter (Platz 3)
- 🔒 Sperre vor Anpfiff · 📅 Heutige Spiele farblich hervorgehoben

### 🏆 K.o.-Phase
```
Sechzehntelfinale → Achtelfinale → Viertelfinale → Halbfinale → Finale
     (16 Spiele)       (8 Spiele)      (4 Spiele)    (2 Spiele)   🥇
```
- Sieger automatisch in die nächste Runde weitergereicht
- Elfmeter-Eingabe bei Unentschieden
- Spiel um Platz 3 · Finale mit 🏆-Markierung

### 🔴 Live-Polling (worldcup26.ir)
| Status | Verhalten |
|---|---|
| Kein Spiel im Fenster | Alle 5 Min prüfen |
| 15 Min vor Anpfiff | 60s-Polling startet |
| Spiel läuft | Pulsierender roter Rahmen + Minute |
| Spiel beendet | Endstand gespeichert |

### 📱 PWA / Offline
- **Service Worker** (Cache-First für Assets, Network-First für API)
- **Installierbar** via Browser-Banner oder `📲 App installieren`-Button
- Funktioniert **komplett offline** (eingegebene Ergebnisse bleiben erhalten)
- Home-Screen-Icon, Splash-Screen, `display: standalone`

### 💻 Responsive Design
| Breakpoint | Layout |
|---|---|
| ≥ 1280px (Wide) | 4 Spalten Gruppen-Grid |
| 768–1279px (Desktop) | 3 Spalten |
| 480–767px (Tablet) | 2 Spalten, kompakter Header |
| < 480px (Mobile) | 1 Spalte, Touch-optimiert |
| `pointer: coarse` | Größere Tap-Targets (min. 36px) |
| Landscape Phone | Flacherer Header |

### 🛡️ Sicherheit & Qualität
- `Content-Security-Policy` im HTML
- SRI-Hash für externe CSS (flag-icons)
- XSS-Escaping aller dynamischen Inhalte
- ARIA-Labels, Keyboard-Navigation, Focus-Management
- Print-optimiertes CSS

---

## 📁 Projektstruktur

```
hAI.WMPlan/
├── index.html            ← HTML-Gerüst + Meta + CSP
├── style.css             ← Komplettes CSS (Dark/Light, Responsive, Print)
├── app.js                ← Gesamte App-Logik (Teams, Standings, K.o., Live, PWA)
├── sw.js                 ← Service Worker (Cache-First, Offline)
├── manifest.webmanifest  ← PWA-Manifest
├── logo.png              ← App-Logo (Header, Favicon, PWA-Icon)
├── Dockerfile            ← Nginx-Alpine-Image
├── nginx.conf            ← Produktions-Nginx (Gzip, Caching, Health)
├── docker-compose.yml    ← Portainer-Stack
└── README.md             ← Diese Datei
```

---

## 🚀 Schnellstart

### Option 1 — Browser direkt
```bash
git clone https://github.com/jbkunama1/hAI.WMPlan.git
open hAI.WMPlan/index.html
```
> Hinweis: Service Worker benötigt HTTPS oder `localhost`. Über `file://` sind PWA-Features deaktiviert.

### Option 2 — Docker (lokal bauen)
```bash
git clone https://github.com/jbkunama1/hAI.WMPlan.git
cd hAI.WMPlan
docker compose up -d --build
# → http://localhost:8026
```

### Option 3 — Portainer Stack (empfohlen)
1. Portainer → **Stacks → Add stack**
2. **Repository** → `https://github.com/jbkunama1/hAI.WMPlan`
3. Compose path: `docker-compose.yml`
4. Optional: Environment Variable `WM_PORT=8026`
5. **Deploy the stack**

### Option 4 — Bestehender Nginx-Server
```nginx
server {
  listen 80;
  server_name wm.deine-domain.de;
  root /var/www/hAI.WMPlan;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```

---

## 🌐 API & Live-Daten

| Eigenschaft | Wert |
|---|---|
| Endpoint | [worldcup26.ir/get/games](https://worldcup26.ir/get/games) |
| Kosten | kostenlos, kein API-Key |
| Poll-Intervall | 60 Sekunden |
| Fallback | Manuelle Eingabe immer möglich |

---

## 🛠️ Technologie

| Bereich | Technologie |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logik | Vanilla JS (ES2022) |
| Flaggen | [flag-icons 7.2.3](https://github.com/lipis/flag-icons) |
| Offline | Service Worker (Cache-First) |
| PWA | Web App Manifest |
| Persistenz | `localStorage` |
| Hosting | Nginx Alpine / Docker / beliebiger Webserver |

---

## 🤝 Credits

- Gruppen & Teams: **FIFA / Sportschau.de**, Stand 12.06.2026
- Flaggen: [flag-icons](https://github.com/lipis/flag-icons) — Panayiotis Lipiridis (MIT)
- Live-Daten: [worldcup26.ir](https://worldcup26.ir)
- Entwickelt mit 🤖 [Perplexity AI](https://perplexity.ai) + ❤️ von Daniel Lienhard

---

## 📄 Lizenz

MIT License — frei verwendbar, veränderbar, weitergabe erlaubt.

---

<p align="center">
  Made with ⚽ · 🔴 · 🤖 · für die WM 2026<br>
  <b>Kanada 🇨🇦 · Mexiko 🇲🇽 · USA 🇺🇸</b>
</p>
