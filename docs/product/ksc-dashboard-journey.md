# KSC Dashboard – User Journey

## Ziel
Das KSC-Dashboard soll Fans, Spieler und Vereinsmitglieder eine **einheitliche, live-aktualisierte Plattform** bieten, die:
- **Spieltage** (2. Bundesliga) mit Live-Ergebnissen
- **Tabelle** (2. Bundesliga)
- **Kader** (Profis, Amateure, Frauen)
- **News** (Vereinsmeldungen)

## User Journey

### 1. Startseite (Übersicht)
- **KSC-Statistik**: Platz, Punkte, Siege/Unentschieden/Niederlagen
- **Nächster Spieltag**: Datum, Gegner, Stadion
- **Live-Status**: Blinkender Punkt, wenn Spiele live sind

### 2. Spieltag-Tab
- **Spielplan**: Alle KSC-Spiele der Saison 2026/27
- **Live-Updates**: Ergebnisse werden automatisch aktualisiert
- **Filter**: Nur ausstehende Spiele / nur beendete Spiele

### 3. Kader-Tab
- **Team-Auswahl**: Profis, Amateure, Frauen
- **Spielerliste**: Name, Position, Status (fit/verletzt/gesperrt)
- **Status-Farben**: Grün (fit), Rot (verletzt), Grau (gesperrt)

### 4. News-Tab
- **News-Feed**: Aktuelle Meldungen vom KSC
- **Team-Filter**: Nur Profis/Amateure/Frauen-News
- **Links**: Direkte Weiterleitung zu KSC-Artikeln

## Technische Umsetzung
- **Datenquellen**:
  - **Live**: openligaDB (Spieltage, Tabelle)
  - **News (live)**: `server.js` proxied ksc.de News (Profis + Akademie) → `/api/news` → App zeigt sie mit „live"-Tag
  - **Gepflegt**: `data/ksc-data.js` (Kader, manuelle News für Frauen etc.)
- **Server**: `node server.js` → http://localhost:8123 (statisch + News-Proxy; löst CORS für ksc.de)
- **Design**: KSC-Blau (`#1f5caf`) als Hauptfarbe, Badisch Rot-Gelb als zweites Theme
- **PWA**: Offline-fähig, installierbar

## Offline-Strategie
- **Kader/News**: Wird manuell in `data/ksc-data.js` gepflegt (keine CORS-Probleme); Live-News vom Proxy kommen nur bei laufendem Server
- **Spieltage/Tabelle**: Live aus openligaDB

## Offene Punkte
- **Kader-API**: Falls eine zuverlässige, CORS-freie Quelle gefunden wird, kann `data/ksc-data.js` durch eine API ersetzt werden.
- **Frauen-News**: ksc.de hat aktuell keine Frauen-Abteilung; sobald verfügbar, Quelle in `server.js` ergänzen.