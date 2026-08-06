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
  if (url === '/api/news'){
    try {
      const news = await fetchNews();
      res.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify(news));
    } catch (e) {
      res.writeHead(502, {'Content-Type':'text/plain'});
      res.end('fetch news failed: '+e.message);
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