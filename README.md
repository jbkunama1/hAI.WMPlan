# ⚽ hAI.WMPlan – FIFA WM 2026 Turnierplan Webapp

![License](https://img.shields.io/badge/Lizenz-MIT-green?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-Single--File-orange?style=flat-square&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JS-Vanilla-yellow?style=flat-square&logo=javascript&logoColor=black)
![Teams](https://img.shields.io/badge/Teams-48-blue?style=flat-square)
![Gruppen](https://img.shields.io/badge/Gruppen-12-blue?style=flat-square)
![KO-Runden](https://img.shields.io/badge/K.o.--Runden-6-blueviolet?style=flat-square)
![Flags](https://img.shields.io/badge/Flaggen-flag--icons%207.2.3-lightgrey?style=flat-square)
![SRI](https://img.shields.io/badge/Sicherheit-CSP%20%2B%20SRI%20%2B%20XSS--Escaping-red?style=flat-square&logo=shield&logoColor=white)
![Storage](https://img.shields.io/badge/Persistenz-localStorage-informational?style=flat-square)
![Stand](https://img.shields.io/badge/Datenstand-12.06.2026-brightgreen?style=flat-square&logo=fifa)
![No Build](https://img.shields.io/badge/Build-kein%20Build%20n%C3%B6tig-success?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=flat-square&logo=docker&logoColor=white)

Interaktive Single-File-Webapp zur Verwaltung des kompletten WM-2026-Turnierplans.

## Features

- 🏳️ **48 Teams** mit Länderflaggen (flag-icons 7.2.3 via jsDelivr + SRI)
- 🗂️ **12 Gruppen A–L** mit automatischer Tabellenberechnung (Pkt, Tore, +/-)
- 🏆 **K.o.-Bracket** Sechzehntelfinale → Finale mit automatischer Sieger-Weitergabe
- ⚽ **Elfmeter-Eingabe** bei Unentschieden in der K.o.-Phase
- 💾 Ergebnisse werden automatisch im `localStorage` gespeichert
- 🌙 / ☀️ Dark / Light Theme
- 🖨️ Print-optimiertes CSS
- 🔒 CSP-Header, SRI-Hash, XSS-Escaping, kein `eval()`, kein `window.confirm()`

## Datenbasis

Gruppen- und Teamzuordnung: **FIFA / Sportschau.de**, Stand 12.06.2026.

## Starten

Einfach `index.html` im Browser öffnen – keine Dependencies, kein Build-Prozess.

## Docker / Nginx

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
}
```

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
```

## Lizenz

MIT
