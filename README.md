# ⚽ hAI.WMPlan — FIFA WM 2026 Turnierplan Webapp

<p align="center">
  <img src="logo.png" alt="hAI.WMPlan Logo" width="200">
</p>

<p align="center">
  <b>Dein interaktiver WM-2026-Turnierplan — live, lokal, selbst gehostet.</b><br>
  48 Teams · 12 Gruppen · 6 K.o.-Runden · automatische Live-Scores · keine Abhängigkeiten
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Lizenz-MIT-22c55e?style=for-the-badge" alt="MIT">
  <img src="https://img.shields.io/badge/HTML-Single--File-f97316?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/JS-Vanilla-facc15?style=for-the-badge&logo=javascript&logoColor=black" alt="JS">
  <img src="https://img.shields.io/badge/Teams-48-3b82f6?style=for-the-badge" alt="Teams">
  <img src="https://img.shields.io/badge/Gruppen-12-8b5cf6?style=for-the-badge" alt="Gruppen">
  <img src="https://img.shields.io/badge/K.o.-Runden-6-ec4899?style=for-the-badge" alt="KO">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🔴 Live--Polling-60s%20Intervall-ef4444?style=for-the-badge" alt="Live">
  <img src="https://img.shields.io/badge/API-worldcup26.ir-06b6d4?style=for-the-badge" alt="API">
  <img src="https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Persistenz-localStorage-6366f1?style=for-the-badge" alt="Storage">
  <img src="https://img.shields.io/badge/Build-nicht%20nötig-10b981?style=for-the-badge" alt="No Build">
</p>

---

## 🌍 Was ist hAI.WMPlan?

**hAI.WMPlan** ist eine vollständig selbst gehostete, interaktive Webapp, die den gesamten Spielplan der **FIFA Fußball-Weltmeisterschaft 2026** (Kanada 🇨🇦 · Mexiko 🇲🇽 · USA 🇺🇸) abbildet.

Du trägst Ergebnisse ein — die App berechnet **automatisch** die Gruppentabellen, ermittelt die Weiterkommer und befüllt den **kompletten K.o.-Turnierbaum** bis zum Finale.

Das Beste: Läuft als **einzelne HTML-Datei**, kein Server, kein Build, kein Framework. Einfach öffnen und spielen.

---

## 🔴 NEU: Live-Polling

```
┌─────────────────────────────────────────────────────────────────┐
│  🔴 LIVE                        hAI.WMPlan – FIFA WM 2026       │
│  ● Daten werden alle 60s automatisch aktualisiert               │
└─────────────────────────────────────────────────────────────────┘
```

Während ein Spiel läuft, holt die App **alle 60 Sekunden** automatisch den aktuellen Spielstand von der kostenlosen API [`worldcup26.ir`](https://worldcup26.ir) und trägt ihn ein.

### So funktioniert's

| Status | Was passiert |
|---|---|
| ⏳ Kein Spiel im Zeitfenster | App prüft alle 5 Min ob ein Spiel startet |
| 🟢 15 Min vor Anpfiff | Polling startet automatisch (60s Takt) |
| 🔴 Spiel läuft | Roter pulsierender Rahmen + `🔴 LIVE 45'` Label |
| ✅ Spiel beendet | Endstand wird gespeichert, Polling bleibt aktiv bis 120 Min nach Anpfiff |

### Live-Indikatoren auf einen Blick

- **Header-Badge** 🔴 `LIVE` mit weißem Blink-Punkt — erscheint sobald mindestens ein Spiel aktiv ist
- **Spielzeile / K.o.-Karte** — pulsierender roter Rahmen + aktuelle Spielminute
- **Statuszeile** unten: `⟳ Letzter API-Abruf: 22:04:13 · worldcup26.ir` (grün) oder `⚠ API nicht erreichbar` (rot)

> 💡 **Manuelle Eingaben haben immer Vorrang.** Die API überschreibt nur, wenn sie ein gültiges Ergebnis liefert.

---

## ✨ Alle Features im Überblick

### 🏟️ Gruppenphase

- 🌍 **48 Teams** aus aller Welt mit echten Länderflaggen ([flag-icons 7.2.3](https://github.com/lipis/flag-icons) via jsDelivr + SRI-Hash)
- 🗂️ **12 Gruppen A–L** mit je 4 Teams, 6 Spielen pro Gruppe
- 📊 **Automatische Tabelle** — Punkte, Siege, Unentschieden, Niederlagen, Tore, Tordifferenz
- 🟢 Grün = qualifiziert (Platz 1+2) · 🔵 Blau = möglicherweise weiter (Platz 3)
- 🔒 Spiele vor Anpfiff sind gesperrt (kein versehentliches Eintragen)
- 📅 Anstoßzeit pro Spiel, **heute-Spiele** farblich hervorgehoben

### 🏆 K.o.-Phase

```
Sechzehntelfinale → Achtelfinale → Viertelfinale → Halbfinale → Finale
     (32 Teams)        (16 Teams)       (8 Teams)     (4 Teams)   🥇
```

- 🔁 Sieger werden **automatisch** in die nächste Runde weitergegeben
- ⚽ **Elfmeter-Eingabe** bei Unentschieden in der K.o.-Phase
- 🥉 Spiel um Platz 3 (Verlierer der Halbfinals)
- 🏆 Finale mit Pokal-Emoji wenn der Sieger feststeht

### 💾 Datenspeicherung & UX

- 💾 Alle Ergebnisse im `localStorage` — bleiben nach Neuladen erhalten
- ↩️ Einzelne Ergebnisse zurücksetzen mit ✕-Button
- 🗑️ „Alle Ergebnisse löschen" mit Bestätigungs-Dialog (kein versehentliches Löschen)
- 🌙 / ☀️ Dark / Light Theme per Klick
- 🖨️ Print-optimiertes CSS (sauberer Druck ohne Buttons/Inputs)
- ♿ ARIA-Labels, Keyboard-Navigation, Focus-Management

### 🔐 Sicherheit

- `Content-Security-Policy` Header direkt im HTML
- SRI-Hash für externe CSS-Ressource (flag-icons)
- XSS-Escaping aller dynamischen Inhalte
- Kein `eval()`, kein `innerHTML` mit Nutzereingaben, kein `window.confirm()`

---

## 🗺️ Turnierstruktur WM 2026

```
48 Teams
  ↓
12 Gruppen (A–L) à 4 Teams
  ↓
32 Teams in der K.o.-Phase
  (12× Gruppensieger + 12× Gruppenzweite + 8 beste Gruppendritte)
  ↓
Sechzehntelfinale (16 Spiele)
  ↓
Achtelfinale (8 Spiele)
  ↓
Viertelfinale (4 Spiele)
  ↓
Halbfinale (2 Spiele)
  ↓
Spiel um Platz 3  +  🏆 Finale
```

---

## 🚀 Schnellstart

### Option 1 — Direkt im Browser öffnen

```bash
# Einfach die Datei herunterladen und öffnen
open index.html
```

Fertig. Kein Build, kein `npm install`, keine Abhängigkeiten.

### Option 2 — Docker (empfohlen für Self-Hosting)

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY logo.png   /usr/share/nginx/html/
```

```bash
docker build -t wm2026 .
docker run -d -p 8080:80 wm2026
# → http://localhost:8080
```

### Option 3 — Docker Compose (Portainer-kompatibel)

```yaml
version: "3.9"
services:
  wm2026:
    image: nginx:alpine
    container_name: wm2026
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html:ro
      - ./logo.png:/usr/share/nginx/html/logo.png:ro
```

### Option 4 — Nginx Vhost (bestehender Server)

```nginx
server {
  listen 80;
  server_name wm.deine-domain.de;
  root /var/www/wm2026;
  index index.html;
  location / { try_files $uri $uri/ =404; }
}
```

---

## 🌐 API & Live-Daten

| Eigenschaft | Wert |
|---|---|
| API | [worldcup26.ir/get/games](https://worldcup26.ir/get/games) |
| Kosten | kostenlos, kein API-Key |
| Poll-Intervall | 60 Sekunden (konfigurierbar via `POLL_INTERVAL`) |
| Fallback | Manuelle Eingabe bleibt immer aktiv |
| Datenformat | JSON |

Das Polling startet **automatisch** sobald ein Spiel im Zeitfenster liegt (15 Min vor bis 120 Min nach Anpfiff). Außerhalb dieser Fenster prüft die App alle 5 Minuten, ob bald ein Spiel startet.

---

## 🛠️ Technologie

| Bereich | Technologie |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animationen) |
| Logik | Vanilla JavaScript (ES2022, Module-Pattern) |
| Flaggen | [flag-icons 7.2.3](https://github.com/lipis/flag-icons) via jsDelivr |
| Persistenz | `localStorage` |
| Live-API | [worldcup26.ir](https://worldcup26.ir) |
| Hosting | Nginx / Docker / beliebiger Webserver |

---

## 📁 Projektstruktur

```
hAI.WMPlan/
├── index.html     ← Komplette App (HTML + CSS + JS in einer Datei)
├── logo.png       ← App-Logo (Header + Favicon)
└── README.md      ← Diese Datei
```

---

## 🤝 Datenbasis & Credits

- Gruppen- und Teamzuordnung: **FIFA / Sportschau.de**, Stand 12.06.2026
- Flaggen: [flag-icons](https://github.com/lipis/flag-icons) von Panayiotis Lipiridis (MIT)
- Live-Daten: [worldcup26.ir](https://worldcup26.ir)
- Entwickelt mit 🤖 [Perplexity AI](https://perplexity.ai) + ❤️ von Daniel Lienhard

---

## 📄 Lizenz

```
MIT License — frei verwendbar, veränderbar, weitergabe erlaubt.
```

---

<p align="center">
  Made with ⚽ · 🔴 · 🤖 · für die WM 2026<br>
  <b>Kanada 🇨🇦 · Mexiko 🇲🇽 · USA 🇺🇸</b>
</p>
