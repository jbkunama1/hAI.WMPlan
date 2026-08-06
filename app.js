'use strict';

// Konstanten
const THEME_KEY = 'wm2026_theme';
const POLL_INTERVAL = 60000;

// API: openligaDB (2. Bundesliga)
const API_BASE = 'https://www.openligadb.de/api';

// Lokale gepflegte Daten (Kader, News, Vereinsinfos)
import { KSC_CLUB, SQUAD, NEWS } from './data/ksc-data.js';

// ─── State ────────────────────────────────────────────────────────────────────
let STANDINGS = [];
let MATCHES = [];
let LIVE_NEWS = null;   // News vom lokalen Proxy (ksc.de), null = nicht geladen
let LIVE_STATE = {};
let pollTimer = null;
let curTab = 'overview';
let curTeamFilter = 'profis'; // Kader-Tab

// ─── UI-Elemente ───────────────────────────────────────────────────────────────
const APP = document.getElementById('app');
const statusEl = document.getElementById('apiStatus');
const themeBtn = document.getElementById('themeBtn');

// ─── Theme (KSC Blau-Weiß Standard | Badisch Rot-Gelb | Dark/Light) ─────────
const THEMES = [
  { id:'ksc',  icon:'🔵', label:'KSC Blau-Weiß' },
  { id:'badisch', icon:'🔴', label:'Badisch Rot-Gelb' },
  { id:'dark', icon:'🌙', label:'Dunkel' },
  { id:'light', icon:'☀️', label:'Hell' },
];
function applyTheme(t){
  document.body.dataset.theme = t;
  const th = THEMES.find(x => x.id === t) || THEMES[0];
  if (themeBtn) themeBtn.textContent = th.icon;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
    t === 'badisch' ? '#b02318' : t === 'ksc' ? '#1f5caf' : t === 'light' ? '#f6f8fa' : '#0d1117');
  localStorage.setItem(THEME_KEY, t);
}
(function(){
  const t = localStorage.getItem(THEME_KEY) || 'ksc';
  document.documentElement.dataset.theme = t;
  document.body.dataset.theme = t;
  if (themeBtn) themeBtn.textContent = (THEMES.find(x => x.id === t) || THEMES[0]).icon;
})();
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const cur = localStorage.getItem(THEME_KEY) || 'ksc';
  const idx = THEMES.findIndex(x => x.id === cur);
  const next = THEMES[(idx + 1) % THEMES.length].id;
  applyTheme(next);
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active'); curTab = t.dataset.tab;
  if (curTab === 'matches') fetchMatches();
  rerender();
}));

// ─── PWA: Install-Banner (bleibt erhalten) ────────────────────────────────────
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  document.getElementById('installBanner')?.classList.add('visible');
});
document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBanner')?.classList.remove('visible');
});
document.getElementById('closeBanner')?.addEventListener('click', () => {
  document.getElementById('installBanner')?.classList.remove('visible');
});

// ─── Service Worker ───────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] SW:', reg.scope))
      .catch(err => console.warn('[PWA] SW Fehler:', err));
  });
}

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────
function esc(s){
  if (s == null) return '';
  return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function fmtDate(dt){
  const d = new Date(dt);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ─── API: Tabelle ───────────────────────────────────────────────────────────────
async function fetchStandings(){
  try {
    const resp = await fetch(`${API_BASE}/getbltable/bl2/2026`, {cache:'no-store'});
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    STANDINGS = await resp.json();
    const ksc = STANDINGS.find(t => t.teamName === 'Karlsruher SC');
    if (statusEl) statusEl.textContent = `📊 KSC: Platz ${ksc.rank}, ${ksc.points} Punkte · Daten: openligaDB`;
  } catch(err){
    console.warn('Standings fetch error:', err);
    if (statusEl) statusEl.textContent = '⚠ Daten nicht geladen';
    STANDINGS = [];
  }
}

// ─── API: KSC-Spiele ─────────────────────────────────────────────────────────
async function fetchMatches(){
  try {
    const resp = await fetch(`${API_BASE}/getmatchdata/bl2/2026`, {cache:'no-store'});
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    MATCHES = await resp.json();
    updateLiveBadge();
  } catch(err){
    console.warn('Matches fetch error:', err);
    MATCHES = [];
  }
}

// ─── Live-Badge: zeigt an, wenn gerade ein KSC-Spiel live läuft ─────────────
function updateLiveBadge(){
  const badge = document.getElementById('liveBadge');
  if (!badge) return;
  const now = Date.now();
  const live = MATCHES.some(m => {
    if (m.matchIsFinished) return false;
    const start = new Date(m.matchDateTime).getTime();
    return start <= now && now <= start + 2.2*60*60*1000; // Anpfiff + ~2h15min
  });
  badge.classList.toggle('visible', live);
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function renderOverview(){
  const ksc = STANDINGS.find(t => t.teamName === 'Karlsruher SC');
  const kscMatches = MATCHES.filter(m =>
    m.team1?.teamName === 'Karlsruher SC' || m.team2?.teamName === 'Karlsruher SC');
  const next = kscMatches.filter(m => !m.matchIsFinished && new Date(m.matchDateTime) > new Date())
    .sort((a,b) => new Date(a.matchDateTime) - new Date(b.matchDateTime))[0];
  const last = kscMatches.filter(m => m.matchIsFinished)
    .sort((a,b) => new Date(b.matchDateTime) - new Date(a.matchDateTime))[0];
  const latestNews = [...NEWS, ...(LIVE_NEWS || [])]
    .sort((a,b) => new Date(b.datum || 0) - new Date(a.datum || 0)).slice(0,3);
  const newsLink = n => n.link ? `<a href="${n.link}" target="_blank" rel="noopener">${esc(n.titel)}</a>` : esc(n.titel);

  const vs = m => {
    const home = m.team1?.teamName === 'Karlsruher SC';
    const opp = home ? m.team2?.teamName : m.team1?.teamName;
    const res = m.matchResults?.[m.matchResults.length-1];
    let score = '';
    if (res) score = home ? `${res.pointsTeam1}:${res.pointsTeam2}` : `${res.pointsTeam2}:${res.pointsTeam1}`;
    return { home, opp, score };
  };

  APP.innerHTML = `<section class="overview">
    <h2>Karlsruher SC</h2>
    ${ksc ? `<div class="ksc-summary">
      <span class="stat">Platz ${ksc.rank}</span>
      <span class="points">${ksc.points} Punkte</span>
      <span class="stat">S/U/N ${ksc.won}/${ksc.draw}/${ksc.lost}</span>
    </div>` : '<p>Tabelle wird geladen…</p>'}

    ${next ? (() => { const {home, opp, score} = vs(next); return `<div class="card">
      <h3>Nächstes Spiel</h3>
      <p class="next-match">${fmtDate(next.matchDateTime)} · ${home ? 'Heim' : 'Auswärts'} vs <strong>${esc(opp)}</strong></p>
    </div>`; })() : ''}

    ${last ? (() => { const {home, opp, score} = vs(last); return `<div class="card">
      <h3>Letztes Spiel</h3>
      <p class="next-match">${home ? 'Heim' : 'Auswärts'} vs <strong>${esc(opp)}</strong> · <span class="score">${score}</span></p>
    </div>`; })() : ''}

    <div class="card">
      <h3>Neueste News</h3>
      <ul class="news-list compact">
        ${latestNews.map(n => `<li><time>${fmtDate(n.datum)}</time>${newsLink(n)}</li>`).join('')}
      </ul>
    </div>
  </section>`;
}

function renderMatches(){
  const ksc = m => m.team1?.teamName === 'Karlsruher SC' || m.team2?.teamName === 'Karlsruher SC';
  const kscMatches = MATCHES.filter(ksc);
  const future = kscMatches.filter(m => !m.matchIsFinished && new Date(m.matchDateTime) > new Date())
    .sort((a,b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));
  const live = kscMatches.filter(m => !m.matchIsFinished && new Date(m.matchDateTime) <= new Date());
  const past = kscMatches.filter(m => m.matchIsFinished)
    .sort((a,b) => new Date(b.matchDateTime) - new Date(a.matchDateTime));
  const formatRow = m => {
    const home = m.team1?.shortName ?? m.team1?.teamName ?? '?';
    const away = m.team2?.shortName ?? m.team2?.teamName ?? '?';
    const finished = m.matchIsFinished;
    const score = finished && m.matchResults?.[m.matchResults.length-1]
      ? `${m.matchResults[m.matchResults.length-1].pointsTeam1}:${m.matchResults[m.matchResults.length-1].pointsTeam2}`
      : '';
    const when = finished ? '✅' : new Date(m.matchDateTime) > new Date() ? '▶' : 'LIVE';
    return `<li class="match-item ${finished?'':'upcoming'}"><span class="team">${home} – ${away}</span><span class="meta">${fmtDate(m.matchDateTime)} ${when} ${finished ? score : ''}</span></li>`;
  };
  APP.innerHTML = `<section class="matches">
    <h2>KSC Spielplan 2026/27</h2>
    <div class="match-stats">${future.length} ausstehend · ${live.length} live · ${past.length} gespielt</div>
    <ul class="match-list">${[...future, ...live, ...past].map(formatRow).join('')}</ul>
    ${renderStandings()}
  </section>`;
}

function renderStandings(){
  if (!STANDINGS.length) return '';
  const rows = STANDINGS.slice().sort((a,b) => a.rank - b.rank).map(t =>
    `<tr class="${t.teamName === 'Karlsruher SC' ? 'ksc-row' : ''}"><td>${t.rank}</td><td>${esc(t.teamName)}</td><td>${t.matches}</td><td>${t.won}/${t.draw}/${t.lost}</td><td>${t.goalDiff}</td><td class="pts">${t.points}</td></tr>`
  ).join('');
  return `<h2 class="tab-sub">Tabelle</h2>
    <div class="table-wrap"><table class="standings-table"><thead><tr><th>#</th><th>Team</th><th>Sp</th><th>S/U/N</th><th>Diff</th><th>Pkt</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

function renderSquad(){
  const teams = ['profis','amateure','frauen'];
  const active = SQUAD.filter(p => p.team === curTeamFilter);
  APP.innerHTML = `<section class="squad">
    <h2>Kader</h2>
    <div class="team-switch">
      ${teams.map(t => `<button class="team-btn ${t===curTeamFilter?'active':''}" data-team="${t}">${t === 'profis' ? '🔴 Profis' : t === 'amateure' ? '🟢 Amateure' : '🟣 Frauen'}</button>`).join('')}
    </div>
    <table class="squad-table"><thead><tr><th>#</th><th>Spieler</th><th>Pos</th><th>Status</th></tr></thead>
    <tbody>${active.map(p => `<tr><td>${p.nr||'-'}</td><td>${esc(p.name)}</td><td>${p.pos}</td><td class="status-${p.status}">${p.status}</td></tr>`).join('')}</tbody>
  </section>`;
}

// Einmalige Event-Delegation (kein Listener-Wachstum bei jedem Render)
document.getElementById('app').addEventListener('click', e => {
  const btn = e.target.closest('.team-btn');
  if (btn) { curTeamFilter = btn.dataset.team; rerender(); }
});

function renderNews(){
  const curated = NEWS.map(n => ({ ...n, source:'manuell' }));
  const list = [...curated, ...(LIVE_NEWS || [])]
    .sort((a,b) => new Date(b.datum || 0) - new Date(a.datum || 0));
  APP.innerHTML = `<section class="news">
    <h2>News</h2>
    <ul class="news-list">
      ${list.map(n => `<li><time>${n.datum ? fmtDate(n.datum) : ''}</time><a href="${n.link}" target="_blank" rel="noopener">${esc(n.titel)}</a><span class="team-tag">${n.team}</span>${n.source === 'live' ? '<span class="live-tag">live</span>' : ''}</li>`).join('')}
    </ul>
    ${LIVE_NEWS ? '' : '<p class="small">Live-News nicht erreichbar (Proxy). Manuell gepflegte News aus data/ksc-data.js werden angezeigt.</p>'}
  </section>`;
}

function rerender(){
  APP.innerHTML = '';
  if (curTab === 'overview') renderOverview();
  else if (curTab === 'matches') renderMatches();
  else if (curTab === 'squad') renderSquad();
  else if (curTab === 'news') renderNews();
}

// ─── Live-News: holt die News-Liste vom lokalen SPA (server.js /api/news) ────
async function fetchNews(){
  try {
    const resp = await fetch('/api/news', { cache:'no-store' });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const items = await resp.json();
    LIVE_NEWS = Array.isArray(items) ? items.map(n => ({
      team: n.team === 'amateure' ? 'amateure' : 'profis',
      datum: n.datum || '',
      titel: String(n.titel).replace(/&quot;/g,'"'),
      link: n.link,
      text: n.text || '',
      source: 'live',
    })) : null;
  } catch(err){
    console.warn('Live-News fetch error:', err);
    LIVE_NEWS = [];
  }
  if (curTab === 'news' || curTab === 'overview') rerender();
}

// ─── Startup ────────────────────────────────────────────────────────────────
async function init(){
  fetchNews(); // feuert unabhängig (nicht-blockierend)
  await fetchStandings();
  await fetchMatches();
  rerender();
  pollTimer = setInterval(() => {
    fetchStandings();
    fetchMatches();
    if (curTab === 'news' || curTab === 'overview') fetchNews();
    rerender();
  }, POLL_INTERVAL);
}
document.addEventListener('DOMContentLoaded', init);