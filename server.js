// KSC Dashboard – statischer Server + News-Proxy
// Start: node server.js  (dann http://localhost:8123/)
//
// ksc.de sendet keine CORS-Header und hat kein RSS/wp-json. Deshalb holt dieser
// Mini-Server die News-Listen serverseitig und liefert sie als JSON mit CORS-Headern.
// Zero dependencies – nur Node http/https + Cheerio-freies Regex-Parsing.

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8123;
const ROOT = __dirname;
const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.ico':'image/x-icon', '.webmanifest':'application/manifest+json', '.txt':'text/plain',
};

// ── Scrape-Quellen für Kader + Spielplan ─────────────────────────
const SCRAPE_SOURCES = {
  squad:   'https://www.ksc.de/profis/team/spieler',
  spielplan:'https://www.ksc.de/profis/saison/spielplan',
};

// Kader: <div class="h1 playernumber">NR</div> ... <div class="h2 name">NAME …
// liefert Nummer, Name, Geburtsdatum, Nationalität, Größe.
function parseSquad(html){
  const out = [];
  const blocks = html.split('playerwrap"').slice(1);
  for (const b of blocks){
    const nr = (b.match(/class="h1 playernumber">(\d+)</) || [])[1];
    const name = (b.match(/class="h2 name">\s*([^<]+?)</) || [])[1];
    const birth = (b.match(/Geburtstag:.*?(\d{2}\.\d{2}\.\d{4})/) || [])[1];
    const natRaw = (b.match(/Nationalität:[^<]*<\/strong>\s*([^<]+)/) || [])[1];
    const height = (b.match(/Größe:.*?(\d+)\s*cm/) || [])[1];
    if (!nr || !name) continue;
    // Maskottchen (Willi Wildpark, Nr. 94) herausfiltern
    if (/wildpark/i.test(name)) continue;
    out.push({
      nr: +nr,
      name: decode(name).replace(/\s+/g,' ').trim(),
      birth: birth||'',
      nat: natRaw ? decode(natRaw).replace(/&nbsp;|\s+/g,' ').trim() : '',
      height: height ? +height : null,
    });
  }
  return out;
}

// Spielplan: <td class="day"><span>N</span></td><td class="team match">…<span class="teamname">TEAM</span>…<div class="vs">:</div>…<span class="teamname">TEAM2</span>…</td><td class="result"><span>-:-</span></td><td class="date"><span>TT.MM.JJ HH:MMh</span></td>
function parseFixtures(html){
  const out = [];
  const rows = html.split('<tr>').slice(1);
  for (const r of rows){
    const day = (r.match(/class="day"><span>(\d+)</) || [])[1];
    if (!day) continue;
    const teams = [...r.matchAll(/class="teamname">([^<]+)</g)].map(m => decode(m[1]).trim());
    if (teams.length < 2) continue;
    const scoreRaw = (r.match(/class="result"><span>([-:\d]+)</) || [])[1];
    const dateRaw = (r.match(/class="date"><span>([^<]+)</) || [])[1]?.trim();
    const dm = dateRaw && dateRaw.match(/(\d{2})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})/);
    const home = teams[0] === 'Karlsruher SC';
    out.push({
      day: +day,
      home,
      opponent: home ? teams[1] : teams[0],
      date: dm ? `20${dm[3]}-${dm[2]}-${dm[1]}T${dm[4]}:${dm[5]}:00` : (dateRaw||''),
      score: scoreRaw && scoreRaw !== '-:-' ? scoreRaw : null,
      finished: !!scoreRaw && scoreRaw !== '-:-',
    });
  }
  return out;
}

// ── News-Quellen (List-Seiten, Reihenfolge = Team-Zuordnung) ──
// Hinweis: ksc.de betreibt aktuell KEINE eigene Frauen-Mannschaft/Women-Region,
// daher wird nur Profis + Akademie automatisch geholt. Frauen-News (falls sie
// künftig existieren) hier ergänzen; sonst manuell in data/ksc-data.js pflegen.
const NEWS_SOURCES = [
  { team:'profis',   url:'https://www.ksc.de/profis/saison/news' },
  { team:'amateure', url:'https://www.ksc.de/akademie/mannschaften/news' },
];

function get(url, timeoutMs=15000){
  return new Promise((resolve, reject) => {
    const req = https.get(url, {headers:{'User-Agent':'Mozilla/5.0'}}, res => {
      if (res.statusCode !== 200) { reject(new Error('HTTP '+res.statusCode)); res.resume(); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')));
  });
}

const decode = s => {
  try { return require('util').TextDecoder ? s.replace(/&#(\d+);/g,(_,a)=>String.fromCharCode(+a)).replace(/&amp;/g,'&') : s; }
  catch { return s; }
};

// NewsItem: <a class="newsItem" title="TITEL" href=".../show/article/slug/">IMG…text</a>
function parseNews(html, team){
  const items = [];
  const re = /<a class="newsItem"[^>]*title="([^"]*)"[^>]*href="([^"]*\/show\/article\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null && items.length < 12){
    const titel = decode(m[1]).trim();
    const href = m[2].startsWith('http') ? m[2] : 'https://www.ksc.de' + m[2];
    const bodyHtml = m[3];
    // Datum: steht oft als <time datetime> oder als einfacher Text im Item
    const d = (bodyHtml.match(/datetime="([^"]+)"/) || bodyHtml.match(/(\d{2})\.(\d{2})\.(\d{4})/));
    let datum = '';
    if (d && d[1] && d[1].length === 10) datum = d[1];
    else if (d && d[2]) datum = `${d[3]}-${d[2]}-${d[1]}`;
    items.push({ team, titel, link: href, datum, text: (bodyHtml.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim().slice(0,160) });
  }
  return items;
}

async function fetchNews(){
  const all = [];
  for (const s of NEWS_SOURCES){
    try { all.push(...parseNews(await get(s.url), s.team)); }
    catch (e) { console.warn(`news fetch ${s.team} failed:`, e.message); }
  }
  return all;
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const json = (code, data, isErr=false) => {
    res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
    res.end(JSON.stringify(isErr ? {error:data} : data));
  };
  if (url === '/api/news'){
    try {
      json(200, await fetchNews());
    } catch (e) {
      json(502, 'fetch news failed: '+e.message, true);
    }
    return;
  }
  if (url === '/api/fixtures'){
    try {
      json(200, parseFixtures(await get(SCRAPE_SOURCES.spielplan)));
    } catch (e) {
      json(502, 'fetch fixtures failed: '+e.message, true);
    }
    return;
  }
  if (url === '/api/squad'){
    try {
      json(200, parseSquad(await get(SCRAPE_SOURCES.squad)));
    } catch (e) {
      json(502, 'fetch squad failed: '+e.message, true);
    }
    return;
  }
  let p = url === '/' ? '/index.html' : url;
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'});
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`KSC Dashboard server → http://localhost:${PORT}`));