# hAI.WMPlan

Interaktive Web-App zur FIFA-WM 2026: Turnierplan mit Gruppen- und K.o.-Phase, Flaggenanzeige und manuell eintragbaren Ergebnissen.

## Features

- Alle 12 Gruppen (A–L) mit je 4 Teams und 3 Spielen
- Manuelle Eingabe der Spielergebnisse direkt im Browser
- Automatische Berechnung von Punkten, Tordifferenz und Rangfolge
- K.o.-Baum (Runde der 32 bis Finale)
- Flaggen via flag-icons CDN (ISO Alpha-2 Codes)
- Ergebnisse werden im localStorage gespeichert
- Statisch hostbar (GitHub Pages, Nginx, Docker)

## Tech-Stack

- HTML5, CSS3, Vanilla JavaScript (ES Modules)
- [flag-icons](https://github.com/lipis/flag-icons) für Länderflaggen

## Lokale Entwicklung

```bash
git clone https://github.com/jbkunama1/hAI.WMPlan.git
cd hAI.WMPlan
python -m http.server 8000
# Aufruf: http://localhost:8000
```

## GitHub Pages

Settings → Pages → Branch: main / Folder: / (root)

Dann erreichbar unter: `https://jbkunama1.github.io/hAI.WMPlan/`

## Lizenz

MIT – siehe [LICENSE](LICENSE)
