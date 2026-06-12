'use strict';

// ─── Konstanten ──────────────────────────────────────────────────────────────
const THEME_KEY = 'wm2026_theme';
const SKEY      = 'wm2026v3';
const LOCKED_KEY = 'wm2026_locked'; // Set von Match-IDs, die offiziell abgeschlossen sind
const API_BASE  = 'https://worldcup26.ir/get';
const POLL_INTERVAL = 60000;

// ─── Mannschaften ────────────────────────────────────────────────────────────
const TEAMS = {
  mex:{n:'Mexiko',f:'mx'},       kor:{n:'Südkorea',f:'kr'},
  cze:{n:'Tschechien',f:'cz'},   rsa:{n:'Südafrika',f:'za'},
  can:{n:'Kanada',f:'ca'},       bih:{n:'Bosnien-H.',f:'ba'},
  qat:{n:'Katar',f:'qa'},        sui:{n:'Schweiz',f:'ch'},
  bra:{n:'Brasilien',f:'br'},    hai:{n:'Haiti',f:'ht'},
  mar:{n:'Marokko',f:'ma'},      sco:{n:'Schottland',f:'gb-sct'},
  usa:{n:'USA',f:'us'},          par:{n:'Paraguay',f:'py'},
  tur:{n:'Türkei',f:'tr'},       aus:{n:'Australien',f:'au'},
  ger:{n:'Deutschland',f:'de'},  cur:{n:'Curaçao',f:'cw'},
  ecu:{n:'Ecuador',f:'ec'},      civ:{n:'Elfenbeinküste',f:'ci'},
  ned:{n:'Niederlande',f:'nl'},  jpn:{n:'Japan',f:'jp'},
  swe:{n:'Schweden',f:'se'},     tun:{n:'Tunesien',f:'tn'},
  bel:{n:'Belgien',f:'be'},      egy:{n:'Ägypten',f:'eg'},
  irn:{n:'Iran',f:'ir'},         nzl:{n:'Neuseeland',f:'nz'},
  esp:{n:'Spanien',f:'es'},      ksa:{n:'Saudi-Arabien',f:'sa'},
  cpv:{n:'Kap Verde',f:'cv'},    ury:{n:'Uruguay',f:'uy'},
  fra:{n:'Frankreich',f:'fr'},   irq:{n:'Irak',f:'iq'},
  nor:{n:'Norwegen',f:'no'},     sen:{n:'Sénégal',f:'sn'},
  arg:{n:'Argentinien',f:'ar'},  alg:{n:'Algerien',f:'dz'},
  aut:{n:'Österreich',f:'at'},   jor:{n:'Jordanien',f:'jo'},
  por:{n:'Portugal',f:'pt'},     col:{n:'Kolumbien',f:'co'},
  cod:{n:'DR Kongo',f:'cd'},     uzb:{n:'Usbekistan',f:'uz'},
  eng:{n:'England',f:'gb-eng'},  cro:{n:'Kroatien',f:'hr'},
  gha:{n:'Ghana',f:'gh'},        pan:{n:'Panama',f:'pa'},
};

const GROUPS = {
  A:['mex','kor','cze','rsa'], B:['can','bih','qat','sui'],
  C:['bra','hai','mar','sco'], D:['usa','par','tur','aus'],
  E:['ger','cur','ecu','civ'], F:['ned','jpn','swe','tun'],
  G:['bel','egy','irn','nzl'], H:['esp','ksa','cpv','ury'],
  I:['fra','irq','nor','sen'], J:['arg','alg','aut','jor'],
  K:['por','col','cod','uzb'], L:['eng','cro','gha','pan'],
};

// ─── Spielplan: alle 72 Gruppenspiele mit echten Terminen (MESZ) ─────────────
const GM_DATA = [
  // Gruppe A
  [1,  'mex','rsa','A','2026-06-11T21:00','Estadio Azteca','Mexico City'],
  [2,  'kor','cze','A','2026-06-12T04:00','Estadio Akron','Guadalajara'],
  [25, 'cze','rsa','A','2026-06-18T18:00','Mercedes-Benz Stadium','Atlanta'],
  [28, 'mex','kor','A','2026-06-19T03:00','Estadio Akron','Guadalajara'],
  [53, 'cze','mex','A','2026-06-25T03:00','Estadio Azteca','Mexico City'],
  [54, 'rsa','kor','A','2026-06-25T03:00','Estadio BBVA','Monterrey'],
  // Gruppe B
  [3,  'can','bih','B','2026-06-12T21:00','BMO Field','Toronto'],
  [8,  'qat','sui','B','2026-06-13T21:00',"Levi's Stadium",'San Francisco'],
  [26, 'sui','bih','B','2026-06-18T21:00','SoFi Stadium','Los Angeles'],
  [27, 'can','qat','B','2026-06-19T00:00','BC Place','Vancouver'],
  [51, 'sui','can','B','2026-06-24T21:00','BC Place','Vancouver'],
  [52, 'bih','qat','B','2026-06-24T21:00','Lumen Field','Seattle'],
  // Gruppe C
  [7,  'bra','mar','C','2026-06-14T00:00','MetLife Stadium','New York/NJ'],
  [5,  'hai','sco','C','2026-06-14T03:00','Gillette Stadium','Boston'],
  [29, 'bra','hai','C','2026-06-20T03:00','Lincoln Financial Field','Philadelphia'],
  [30, 'sco','mar','C','2026-06-20T00:00','Gillette Stadium','Boston'],
  [49, 'sco','bra','C','2026-06-25T00:00','Hard Rock Stadium','Miami'],
  [50, 'mar','hai','C','2026-06-25T00:00','Mercedes-Benz Stadium','Atlanta'],
  // Gruppe D
  [4,  'usa','par','D','2026-06-13T03:00','SoFi Stadium','Los Angeles'],
  [6,  'aus','tur','D','2026-06-14T06:00','BC Place','Vancouver'],
  [31, 'tur','par','D','2026-06-20T05:00',"Levi's Stadium",'San Francisco'],
  [32, 'usa','aus','D','2026-06-20T21:00','Lumen Field','Seattle'],
  [59, 'tur','usa','D','2026-06-26T04:00','SoFi Stadium','Los Angeles'],
  [60, 'par','aus','D','2026-06-26T04:00',"Levi's Stadium",'San Francisco'],
  // Gruppe E
  [10, 'ger','cur','E','2026-06-14T19:00','NRG Stadium','Houston'],
  [9,  'civ','ecu','E','2026-06-15T01:00','Lincoln Financial Field','Philadelphia'],
  [33, 'ger','civ','E','2026-06-20T22:00','BMO Field','Toronto'],
  [34, 'ecu','cur','E','2026-06-21T02:00','Arrowhead Stadium','Kansas City'],
  [55, 'cur','civ','E','2026-06-25T22:00','Lincoln Financial Field','Philadelphia'],
  [56, 'ecu','ger','E','2026-06-25T22:00','MetLife Stadium','New York/NJ'],
  // Gruppe F
  [11, 'ned','jpn','F','2026-06-14T22:00','AT&T Stadium','Dallas'],
  [12, 'swe','tun','F','2026-06-15T04:00','Estadio BBVA','Monterrey'],
  [35, 'ned','swe','F','2026-06-20T19:00','NRG Stadium','Houston'],
  [36, 'tun','jpn','F','2026-06-21T06:00','Estadio BBVA','Monterrey'],
  [57, 'jpn','swe','F','2026-06-26T01:00','AT&T Stadium','Dallas'],
  [58, 'tun','ned','F','2026-06-26T01:00','Arrowhead Stadium','Kansas City'],
  // Gruppe G
  [16, 'bel','egy','G','2026-06-15T21:00','Lumen Field','Seattle'],
  [15, 'irn','nzl','G','2026-06-16T03:00','SoFi Stadium','Los Angeles'],
  [39, 'bel','irn','G','2026-06-21T21:00','SoFi Stadium','Los Angeles'],
  [40, 'nzl','egy','G','2026-06-22T03:00','BC Place','Vancouver'],
  [63, 'egy','irn','G','2026-06-27T05:00','Lumen Field','Seattle'],
  [64, 'nzl','bel','G','2026-06-27T05:00','BC Place','Vancouver'],
  // Gruppe H
  [14, 'esp','cpv','H','2026-06-15T18:00','Mercedes-Benz Stadium','Atlanta'],
  [13, 'ksa','ury','H','2026-06-16T00:00','Hard Rock Stadium','Miami'],
  [38, 'esp','ksa','H','2026-06-21T18:00','Mercedes-Benz Stadium','Atlanta'],
  [37, 'ury','cpv','H','2026-06-22T00:00','Hard Rock Stadium','Miami'],
  [65, 'cpv','ksa','H','2026-06-27T02:00','NRG Stadium','Houston'],
  [66, 'ury','esp','H','2026-06-27T02:00','Estadio Akron','Guadalajara'],
  // Gruppe I
  [17, 'fra','sen','I','2026-06-16T21:00','MetLife Stadium','New York/NJ'],
  [18, 'irq','nor','I','2026-06-17T00:00','Gillette Stadium','Boston'],
  [42, 'fra','irq','I','2026-06-22T23:00','Lincoln Financial Field','Philadelphia'],
  [41, 'nor','sen','I','2026-06-23T02:00','MetLife Stadium','New York/NJ'],
  [61, 'nor','fra','I','2026-06-26T21:00','Gillette Stadium','Boston'],
  [62, 'sen','irq','I','2026-06-26T21:00','BMO Field','Toronto'],
  // Gruppe J
  [19, 'arg','alg','J','2026-06-17T03:00','Arrowhead Stadium','Kansas City'],
  [20, 'aut','jor','J','2026-06-17T06:00',"Levi's Stadium",'San Francisco'],
  [43, 'arg','aut','J','2026-06-22T19:00','AT&T Stadium','Dallas'],
  [44, 'jor','alg','J','2026-06-23T05:00',"Levi's Stadium",'San Francisco'],
  [69, 'alg','aut','J','2026-06-28T04:00','Arrowhead Stadium','Kansas City'],
  [70, 'jor','arg','J','2026-06-28T04:00','AT&T Stadium','Dallas'],
  // Gruppe K
  [23, 'por','cod','K','2026-06-17T19:00','NRG Stadium','Houston'],
  [24, 'uzb','col','K','2026-06-18T02:00','Estadio Azteca','Mexico City'],
  [47, 'por','uzb','K','2026-06-23T19:00','NRG Stadium','Houston'],
  [48, 'col','cod','K','2026-06-24T04:00','Estadio Akron','Guadalajara'],
  [71, 'col','por','K','2026-06-28T01:30','Hard Rock Stadium','Miami'],
  [72, 'cod','uzb','K','2026-06-28T01:30','Mercedes-Benz Stadium','Atlanta'],
  // Gruppe L
  [22, 'eng','cro','L','2026-06-17T22:00','AT&T Stadium','Dallas'],
  [21, 'gha','pan','L','2026-06-18T01:00','BMO Field','Toronto'],
  [45, 'eng','gha','L','2026-06-23T22:00','Gillette Stadium','Boston'],
  [46, 'pan','cro','L','2026-06-24T01:00','BMO Field','Toronto'],
  [67, 'pan','eng','L','2026-06-27T23:00','MetLife Stadium','New York/NJ'],
  [68, 'cro','gha','L','2026-06-27T23:00','Lincoln Financial Field','Philadelphia'],
];

const GM = GM_DATA.map(([id, home, away, group, kickoff, stadium, city]) => ({
  id, home, away, stage: 'group', group, kickoff, stadium, city,
}));

const KICKOFFS = {};
GM.forEach(m => { KICKOFFS[m.id] = m.kickoff; });

const KO_KICKOFFS = {
  201:'2026-06-28T21:00', 202:'2026-06-29T22:30',
  203:'2026-06-29T03:00', 204:'2026-06-29T19:00',
  205:'2026-06-30T23:00', 206:'2026-06-30T19:00',
  207:'2026-07-01T03:00', 208:'2026-07-01T18:00',
  209:'2026-07-01T23:00', 210:'2026-07-02T21:00',
  211:'2026-07-03T01:00', 212:'2026-07-02T21:00',
  213:'2026-07-03T05:00', 214:'2026-07-04T00:00',
  215:'2026-07-04T02:30', 216:'2026-07-03T20:00',
  301:'2026-07-04T23:00', 302:'2026-07-04T19:00',
  303:'2026-07-05T22:00', 304:'2026-07-06T02:00',
  305:'2026-07-06T21:00', 306:'2026-07-07T02:00',
  307:'2026-07-07T18:00', 308:'2026-07-07T22:00',
  401:'2026-07-09T22:00', 402:'2026-07-10T21:00',
  403:'2026-07-11T23:00', 404:'2026-07-12T03:00',
  501:'2026-07-14T21:00', 502:'2026-07-15T21:00',
  601:'2026-07-18T23:00', 701:'2026-07-19T21:00',
};
Object.assign(KICKOFFS, KO_KICKOFFS);

const NAME_MAP = {
  'Mexico':'mex','Korea Republic':'kor','Czech Republic':'cze','South Africa':'rsa',
  'Canada':'can','Bosnia and Herzegovina':'bih','Qatar':'qat','Switzerland':'sui',
  'Brazil':'bra','Haiti':'hai','Morocco':'mar','Scotland':'sco',
  'United States':'usa','Paraguay':'par','Turkey':'tur','Australia':'aus',
  'Germany':'ger','Curacao':'cur','Ecuador':'ecu',"Cote d'Ivoire":'civ',
  'Netherlands':'ned','Japan':'jpn','Sweden':'swe','Tunisia':'tun',
  'Belgium':'bel','Egypt':'egy','Iran':'irn','New Zealand':'nzl',
  'Spain':'esp','Saudi Arabia':'ksa','Cape Verde':'cpv','Uruguay':'ury',
  'France':'fra','Iraq':'irq','Norway':'nor','Senegal':'sen',
  'Argentina':'arg','Algeria':'alg','Austria':'aut','Jordan':'jor',
  'Portugal':'por','Colombia':'col','DR Congo':'cod','Uzbekistan':'uzb',
  'England':'eng','Croatia':'cro','Ghana':'gha','Panama':'pan',
};

// ─── K.o.-Runden ─────────────────────────────────────────────────────────────
const KO_ROUNDS = [
  {id:'r32',label:'Sechzehntelfinale',matches:[
    {id:201,home:{src:'grp',g:'A',p:1},away:{src:'grp',g:'C',p:2}},
    {id:202,home:{src:'grp',g:'B',p:1},away:{src:'grp',g:'D',p:2}},
    {id:203,home:{src:'grp',g:'C',p:1},away:{src:'grp',g:'A',p:2}},
    {id:204,home:{src:'grp',g:'D',p:1},away:{src:'grp',g:'B',p:2}},
    {id:205,home:{src:'grp',g:'E',p:1},away:{src:'grp',g:'G',p:2}},
    {id:206,home:{src:'grp',g:'F',p:1},away:{src:'grp',g:'H',p:2}},
    {id:207,home:{src:'grp',g:'G',p:1},away:{src:'grp',g:'E',p:2}},
    {id:208,home:{src:'grp',g:'H',p:1},away:{src:'grp',g:'F',p:2}},
    {id:209,home:{src:'grp',g:'I',p:1},away:{src:'grp',g:'K',p:2}},
    {id:210,home:{src:'grp',g:'J',p:1},away:{src:'grp',g:'L',p:2}},
    {id:211,home:{src:'grp',g:'K',p:1},away:{src:'grp',g:'I',p:2}},
    {id:212,home:{src:'grp',g:'L',p:1},away:{src:'grp',g:'J',p:2}},
    {id:213,home:{src:'b3',s:0},away:{src:'b3',s:1}},
    {id:214,home:{src:'b3',s:2},away:{src:'b3',s:3}},
    {id:215,home:{src:'b3',s:4},away:{src:'b3',s:5}},
    {id:216,home:{src:'b3',s:6},away:{src:'b3',s:7}},
  ]},
  {id:'r16',label:'Achtelfinale',matches:[
    {id:301,home:{src:'ko',m:201},away:{src:'ko',m:202}},
    {id:302,home:{src:'ko',m:203},away:{src:'ko',m:204}},
    {id:303,home:{src:'ko',m:205},away:{src:'ko',m:206}},
    {id:304,home:{src:'ko',m:207},away:{src:'ko',m:208}},
    {id:305,home:{src:'ko',m:209},away:{src:'ko',m:210}},
    {id:306,home:{src:'ko',m:211},away:{src:'ko',m:212}},
    {id:307,home:{src:'ko',m:213},away:{src:'ko',m:214}},
    {id:308,home:{src:'ko',m:215},away:{src:'ko',m:216}},
  ]},
  {id:'qf',label:'Viertelfinale',matches:[
    {id:401,home:{src:'ko',m:301},away:{src:'ko',m:302}},
    {id:402,home:{src:'ko',m:303},away:{src:'ko',m:304}},
    {id:403,home:{src:'ko',m:305},away:{src:'ko',m:306}},
    {id:404,home:{src:'ko',m:307},away:{src:'ko',m:308}},
  ]},
  {id:'sf',label:'Halbfinale',matches:[
    {id:501,home:{src:'ko',m:401},away:{src:'ko',m:402}},
    {id:502,home:{src:'ko',m:403},away:{src:'ko',m:404}},
  ]},
  {id:'3rd',label:'Platz 3',matches:[
    {id:601,home:{src:'los',m:501},away:{src:'los',m:502}},
  ]},
  {id:'fin',label:'🏆 Finale',matches:[
    {id:701,home:{src:'ko',m:501},away:{src:'ko',m:502}},
  ]},
];

// ─── Storage ──────────────────────────────────────────────────────────────────
let RES = {};
// LOCKED: Set von Match-IDs, die vom API als abgeschlossen gemeldet wurden
// Diese Ergebnisse sind offiziell und können nicht manuell überschrieben werden
let LOCKED = new Set();

function load() {
  try {
    const r = localStorage.getItem(SKEY); RES = r ? JSON.parse(r) : {};
    const l = localStorage.getItem(LOCKED_KEY); 
    LOCKED = l ? new Set(JSON.parse(l)) : new Set();
  } catch(e) { RES = {}; LOCKED = new Set(); }
}
function save() {
  try {
    localStorage.setItem(SKEY, JSON.stringify(RES));
    localStorage.setItem(LOCKED_KEY, JSON.stringify([...LOCKED]));
  } catch(e) {}
}
load();

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fl(code) {
  // Flagge als CSS-Klasse (flag-icons) UND als Fallback-Bild via flagcdn.com
  const iso = esc(code);
  return `<span class="fi fi-${iso}" title="${iso}"></span>`;
}
function gr(id) { return RES[String(id)] || {h:'',a:''}; }

// Schreibschutz: offiziell abgeschlossene Spiele können nicht überschrieben werden
function isLockedByAPI(id) { return LOCKED.has(String(id)); }

function sr(id, side, val) {
  if (!isUnlocked(id) || isLockedByAPI(id)) return; // gesperrt = nicht editierbar
  const k = String(id); if (!RES[k]) RES[k] = {h:'',a:''};
  RES[k][side] = val === '' ? '' : Math.max(0, Math.min(30, parseInt(val, 10)));
  save();
}
function sp(id, side, val) {
  if (!isUnlocked(id) || isLockedByAPI(id)) return;
  const k = String(id); if (!RES[k]) RES[k] = {h:'',a:''};
  RES[k]['p'+side] = val === '' ? '' : Math.max(0, Math.min(20, parseInt(val, 10)));
  save();
}
function resetMatch(id) {
  if (!isUnlocked(id) || isLockedByAPI(id)) return; // offiziell gesperrte nie resetten
  delete RES[String(id)]; save(); rerender();
}

function scorePrint(val)   { return `<span class="score-print">${val !== '' ? esc(String(val)) : '-'}</span>`; }
function koScorePrint(val) { return `<span class="ko-score-print">${val !== '' ? esc(String(val)) : '-'}</span>`; }

// ─── Kickoff-Hilfsfunktionen ──────────────────────────────────────────────────
function isInLiveWindow(id) {
  const ko = KICKOFFS[id]; if (!ko) return false;
  const t = new Date(ko), now = new Date();
  return now >= new Date(t.getTime() - 15*60*1000) && now <= new Date(t.getTime() + 120*60*1000);
}
function isUnlocked(id) {
  const ko = KICKOFFS[id]; if (!ko) return true;
  return new Date() >= new Date(ko);
}
function fmtKickoff(id) {
  const ko = KICKOFFS[id]; if (!ko) return '';
  const d = new Date(ko);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function isToday(id) {
  const ko = KICKOFFS[id]; if (!ko) return false;
  const d = new Date(ko), n = new Date();
  return d.getFullYear()===n.getFullYear() && d.getMonth()===n.getMonth() && d.getDate()===n.getDate();
}

// ─── Live-Polling + Auto-Lock ─────────────────────────────────────────────────
const LIVE_STATE = {};
let pollTimer = null;

async function fetchLiveScores() {
  const statusEl = document.getElementById('apiStatus');
  try {
    const resp = await fetch(`${API_BASE}/games`, {cache:'no-store'});
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    const games = Array.isArray(data) ? data
      : Array.isArray(data?.games)   ? data.games
      : Array.isArray(data?.matches) ? data.matches
      : [];
    let hasLive = false;

    games.forEach(g => {
      const status = (g.status || g.match_status || '').toLowerCase();
      const isLive     = status.includes('live') || status.includes('ongoing') ||
                         status.includes('in_progress') || status==='1h' || status==='2h' || status==='ht';
      const isFinished = status.includes('finish') || status.includes('complet') ||
                         status.includes('ended') || status==='ft' || status==='aet' ||
                         status==='full_time' || status==='finished';

      const hName = g.home_team || g.homeTeam || g.home || '';
      const aName = g.away_team || g.awayTeam || g.away || '';
      const hId = NAME_MAP[hName], aId = NAME_MAP[aName];
      if (!hId || !aId) return;

      const match = GM.find(m => m.home === hId && m.away === aId);
      if (!match) return;
      const mid = match.id;

      const hScore = parseInt(g.home_score ?? g.homeScore ?? g.score_home ?? -1, 10);
      const aScore = parseInt(g.away_score ?? g.awayScore ?? g.score_away ?? -1, 10);
      const rawMinute = g.minute || g.match_minute || g.elapsed || null;
      const minute = rawMinute ? esc(String(rawMinute)) : null;

      if (isLive) {
        hasLive = true;
        LIVE_STATE[mid] = {live:true, minute};
        // Live-Scores eintragen (noch editierbar bis Abpfiff)
        if (hScore >= 0 && aScore >= 0) RES[String(mid)] = {h:hScore, a:aScore};
      } else if (isFinished) {
        // ✅ ABGESCHLOSSEN: Ergebnis eintragen + dauerhaft sperren
        LIVE_STATE[mid] = {live:false, minute:null};
        if (hScore >= 0 && aScore >= 0) {
          RES[String(mid)] = {h:hScore, a:aScore}; // offizielles Ergebnis
          LOCKED.add(String(mid));                  // für immer gesperrt
        }
      }
    });

    save();
    const anyLive = hasLive;
    document.getElementById('liveBadge')?.classList.toggle('visible', anyLive);
    if (statusEl) {
      const now = new Date();
      statusEl.className = 'api-status ok';
      statusEl.textContent = `⟳ API: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')} · worldcup26.ir · ${LOCKED.size} Spiele offiziell abgeschlossen`;
    }
    rerender();
  } catch(err) {
    if (statusEl) {
      statusEl.className = 'api-status err';
      statusEl.textContent = `⚠ API nicht erreichbar: ${esc(err.message)}`;
    }
  }
}

function startPolling() {
  const hasLiveWindow = Object.keys(KICKOFFS).some(id => isInLiveWindow(Number(id)));
  if (hasLiveWindow) {
    fetchLiveScores();
    clearInterval(pollTimer);
    pollTimer = setInterval(fetchLiveScores, POLL_INTERVAL);
  } else {
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      if (Object.keys(KICKOFFS).some(id => isInLiveWindow(Number(id)))) {
        fetchLiveScores();
        clearInterval(pollTimer);
        pollTimer = setInterval(fetchLiveScores, POLL_INTERVAL);
      }
    }, 5 * 60 * 1000);
  }
}

// ─── Standings & K.o.-Logik ───────────────────────────────────────────────────
function calcStandings(gid) {
  const ids = GROUPS[gid], s = {};
  ids.forEach(id => { s[id] = {id,pl:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}; });
  GM.filter(m => m.group === gid).forEach(m => {
    const r = gr(m.id); if (r.h==='' || r.a==='') return;
    const hg = Number(r.h), ag = Number(r.a);
    s[m.home].pl++; s[m.away].pl++;
    s[m.home].gf += hg; s[m.home].ga += ag;
    s[m.away].gf += ag; s[m.away].ga += hg;
    if (hg > ag)      { s[m.home].pts += 3; s[m.home].w++; s[m.away].l++; }
    else if (hg < ag) { s[m.away].pts += 3; s[m.away].w++; s[m.home].l++; }
    else              { s[m.home].pts++; s[m.home].d++; s[m.away].pts++; s[m.away].d++; }
  });
  Object.values(s).forEach(t => { t.gd = t.gf - t.ga; });
  return Object.values(s).sort((a,b) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf);
}
function teamFromGroup(g, pos) { return calcStandings(g)[pos-1]?.id || null; }
function best8Third() {
  return Object.keys(GROUPS)
    .map(g => { const st = calcStandings(g); return st[2] ? {...st[2], g} : null; })
    .filter(Boolean).sort((a,b) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf)
    .slice(0,8).map(t => t.id);
}
function resolve(src) {
  if (!src) return null;
  if (src.src === 'grp') return teamFromGroup(src.g, src.p);
  if (src.src === 'b3')  return best8Third()[src.s] || null;
  if (src.src === 'ko')  return koWinner(src.m);
  if (src.src === 'los') return koLoser(src.m);
  return null;
}
function findKOM(id) {
  for (const r of KO_ROUNDS) { const m = r.matches.find(x => x.id === id); if (m) return m; }
  return null;
}
function koWinner(id) {
  const r = gr(id); if (r.h==='' || r.a==='') return null;
  const m = findKOM(id); if (!m) return null;
  const h = resolve(m.home), a = resolve(m.away);
  if (Number(r.h) > Number(r.a)) return h;
  if (Number(r.h) < Number(r.a)) return a;
  if (r.ph !== undefined && r.pa !== undefined && r.ph !== '' && r.pa !== '')
    return Number(r.ph) > Number(r.pa) ? h : a;
  return null;
}
function koLoser(id) {
  const w = koWinner(id); if (!w) return null;
  const m = findKOM(id); if (!m) return null;
  const h = resolve(m.home), a = resolve(m.away);
  return w === h ? a : h;
}

// ─── Render ───────────────────────────────────────────────────────────────────
const APP = document.getElementById('app');
let curTab = 'groups', focKey = null, saveTimer = null;

function rerender() {
  focKey = document.activeElement?.dataset?.fk || null;
  curTab === 'groups' ? renderGroups() : renderKO();
  if (focKey) { const el = document.querySelector(`[data-fk="${focKey}"]`); if (el) el.focus(); }
}
function schedSave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => rerender(), 0); }

function renderGroups() {
  APP.innerHTML = `
    <div class="toolbar">
      <button class="btn btn-cancel" id="btnReset">🗑 Alle Ergebnisse löschen</button>
      <span class="info-badge">🔒 = noch nicht angepfiffen &nbsp;|&nbsp; 🔐 = offiziell abgeschlossen &nbsp;|&nbsp; 🔴 = Live</span>
    </div>
    <div class="groups-grid" id="gg"></div>`;
  document.getElementById('btnReset').addEventListener('click', () =>
    openModal(() => {
      // Offiziell gesperrte Ergebnisse bleiben erhalten!
      Object.keys(RES).forEach(k => { if (!LOCKED.has(k)) delete RES[k]; });
      save(); rerender();
    }));
  const grid = document.getElementById('gg');

  Object.keys(GROUPS).forEach(gid => {
    const st = calcStandings(gid);
    const rows = st.map((t,i) => {
      const T = TEAMS[t.id], cls = i < 2 ? 'qualified' : i === 2 ? 'possible' : '';
      return `<tr class="${cls}"><td>${fl(T.f)} ${esc(T.n)}</td><td>${t.pl}</td><td>${t.pts}</td><td>${t.gf}:${t.ga}</td><td>${t.gd > 0 ? '+' : ''}${t.gd}</td></tr>`;
    }).join('');

    const groupMatches = GM.filter(m => m.group === gid)
      .sort((a,b) => new Date(a.kickoff) - new Date(b.kickoff));

    const mrows = groupMatches.map(m => {
      const ht = TEAMS[m.home], at = TEAMS[m.away], r = gr(m.id);
      const unlocked    = isUnlocked(m.id);
      const apiLocked   = isLockedByAPI(m.id);  // offiziell abgeschlossen
      const editable    = unlocked && !apiLocked;
      const live        = LIVE_STATE[m.id]?.live;
      const minute      = LIVE_STATE[m.id]?.minute;
      const today       = isToday(m.id);
      const hasResult   = r.h !== '' || r.a !== '';
      const ko          = fmtKickoff(m.id);

      let koLabel;
      if (live)           koLabel = `<span class="live-label">🔴 LIVE${minute ? ' '+minute+"'" : ''}</span>`;
      else if (apiLocked) koLabel = `<span class="match-kickoff locked-api">🔐 ${ko} · offiziell</span>`;
      else if (!unlocked) koLabel = `<span class="match-kickoff">🔒 ${ko}</span>`;
      else if (today)     koLabel = `<span class="match-kickoff today">▶ heute ${ko}</span>`;
      else                koLabel = `<span class="match-kickoff done">${ko}</span>`;

      const rowCls = [
        'match-row',
        !unlocked ? 'locked' : '',
        apiLocked ? 'api-locked' : '',
        live ? 'live-now' : '',
        today && !live ? 'today' : ''
      ].filter(Boolean).join(' ');

      return `<div class="${rowCls}">
        <span class="team-name">${fl(ht.f)} ${esc(ht.n)}</span>
        <div class="score-wrap">
          <input class="score-input" type="number" min="0" max="30" inputmode="numeric"
            value="${r.h!==''?r.h:''}" data-mid="${m.id}" data-side="h" data-fk="g${m.id}h"
            aria-label="${esc(ht.n)} Tore"
            ${editable?'':'disabled tabindex="-1"'}>${scorePrint(r.h)}
          <span class="match-sep">:</span>
          <input class="score-input" type="number" min="0" max="30" inputmode="numeric"
            value="${r.a!==''?r.a:''}" data-mid="${m.id}" data-side="a" data-fk="g${m.id}a"
            aria-label="${esc(at.n)} Tore"
            ${editable?'':'disabled tabindex="-1"'}>${scorePrint(r.a)}
        </div>
        <span class="team-name right">${esc(at.n)} ${fl(at.f)}</span>
        ${koLabel}
        <button class="btn-reset-match" data-rmid="${m.id}" title="Ergebnis zurücksetzen"
          style="${hasResult && editable ?'':'opacity:.25;pointer-events:none'}" aria-label="reset">✕</button>
      </div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `<h2>Gruppe ${gid}</h2>
      <table class="standings"><thead><tr><th>Team</th><th>Sp</th><th>Pkt</th><th>Tore</th><th>+/-</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="matches">${mrows}</div>`;
    grid.appendChild(card);
  });

  APP.addEventListener('input', e => {
    const el = e.target; if (!el.dataset.mid) return;
    sr(el.dataset.mid, el.dataset.side, el.value); schedSave();
  });
  APP.addEventListener('click', e => {
    const btn = e.target.closest('.btn-reset-match'); if (!btn) return;
    resetMatch(btn.dataset.rmid);
  });
}

function renderKO() {
  APP.innerHTML = `<div class="toolbar">
    <span class="info-badge">🟩 Sieger · ⚽ Elfmeter · 🔴 Live · 🔐 Offiziell gesperrt · 🔒 Noch nicht</span>
  </div><div class="ko-wrap"><div class="bracket" id="br"></div></div>`;
  const br = document.getElementById('br');

  KO_ROUNDS.forEach(rnd => {
    const col = document.createElement('div'); col.className = 'round';
    col.innerHTML = `<div class="round-header">${esc(rnd.label)}</div>`;
    const wrap = document.createElement('div'); wrap.className = 'round-matches';

    rnd.matches.forEach(m => {
      const hId = resolve(m.home), aId = resolve(m.away);
      const hT = hId ? TEAMS[hId] : null, aT = aId ? TEAMS[aId] : null;
      const r         = gr(m.id);
      const unlocked  = isUnlocked(m.id);
      const apiLocked = isLockedByAPI(m.id);
      const editable  = unlocked && !apiLocked;
      const live      = LIVE_STATE[m.id]?.live;
      const minute    = LIVE_STATE[m.id]?.minute;
      const today     = isToday(m.id);
      const hasResult = r.h !== '' || r.a !== '';
      const isDraw    = r.h !== '' && r.a !== '' && Number(r.h) === Number(r.a);
      const w = koWinner(m.id);
      const hWin = w && w === hId, aWin = w && w === aId;
      const hName = hT ? `${fl(hT.f)} ${esc(hT.n)}` : `<span class="tbd">TBD</span>`;
      const aName = aT ? `${fl(aT.f)} ${esc(aT.n)}` : `<span class="tbd">TBD</span>`;
      const penH = isDraw && editable
        ? `<input class="ko-pen-input" type="number" min="0" max="20" value="${r.ph!==undefined&&r.ph!==''?r.ph:''}" data-mid="${m.id}" data-side="ph" data-fk="k${m.id}ph" aria-label="Elfmeter">`
        : r.ph !== undefined && r.ph !== '' ? `<span class="ko-pen">(${r.ph})</span>` : '';
      const penA = isDraw && editable
        ? `<input class="ko-pen-input" type="number" min="0" max="20" value="${r.pa!==undefined&&r.pa!==''?r.pa:''}" data-mid="${m.id}" data-side="pa" data-fk="k${m.id}pa" aria-label="Elfmeter">`
        : r.pa !== undefined && r.pa !== '' ? `<span class="ko-pen">(${r.pa})</span>` : '';
      const koStr = fmtKickoff(m.id);
      let koBar;
      if (live)            koBar = `<div class="ko-kickoff today">🔴 LIVE${minute?' '+minute+"'":''}</div>`;
      else if (apiLocked)  koBar = `<div class="ko-kickoff locked-api">🔐 ${koStr} · offiziell</div>`;
      else if (koStr)      koBar = `<div class="ko-kickoff${today?' today':''}">${unlocked?(today?'▶ heute '+koStr:koStr):'🔒 '+koStr}</div>`;
      else                 koBar = '';

      const div = document.createElement('div');
      div.className = `ko-match${!editable?' locked':''}${apiLocked?' api-locked':''}${live?' live-now':''}`;
      div.innerHTML = `
        ${koBar}
        <button class="ko-match-reset" data-rmid="${m.id}" title="zurücksetzen"
          style="${hasResult&&editable?'':'opacity:.2;pointer-events:none'}">✕</button>
        <div class="ko-team${hWin?' winner':''}">
          ${hName}
          <input class="ko-score-input" type="number" min="0" max="30"
            value="${r.h!==''?r.h:''}" data-mid="${m.id}" data-side="h" data-fk="k${m.id}h"
            ${editable?'':'disabled tabindex="-1"'}>${koScorePrint(r.h)}
          ${penH}
        </div>
        <div class="ko-team${aWin?' winner':''}">
          ${aName}
          <input class="ko-score-input" type="number" min="0" max="30"
            value="${r.a!==''?r.a:''}" data-mid="${m.id}" data-side="a" data-fk="k${m.id}a"
            ${editable?'':'disabled tabindex="-1"'}>${koScorePrint(r.a)}
          ${penA}
        </div>`;
      wrap.appendChild(div);
    });
    col.appendChild(wrap); br.appendChild(col);
  });

  br.addEventListener('input', e => {
    const el = e.target; if (!el.dataset.mid) return;
    if (el.dataset.side === 'ph' || el.dataset.side === 'pa')
      sp(el.dataset.mid, el.dataset.side === 'ph' ? 'h' : 'a', el.value);
    else sr(el.dataset.mid, el.dataset.side, el.value);
    schedSave();
  });
  br.addEventListener('click', e => {
    const btn = e.target.closest('.ko-match-reset'); if (!btn) return;
    resetMatch(btn.dataset.rmid);
  });
}

function openModal(cb) {
  const ov = document.getElementById('overlay');
  const cn = document.getElementById('modalCancel');
  const cf = document.getElementById('modalConfirm');
  ov.classList.add('open'); cf.focus();
  function close() {
    ov.classList.remove('open');
    cn.removeEventListener('click', onNo);
    cf.removeEventListener('click', onYes);
    document.removeEventListener('keydown', onKey);
  }
  function onYes() { close(); cb(); }
  function onNo()  { close(); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  cf.addEventListener('click', onYes, {once:true});
  cn.addEventListener('click', onNo,  {once:true});
  document.addEventListener('keydown', onKey);
}

// ─── PWA: Service Worker ──────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] SW:', reg.scope))
      .catch(err => console.warn('[PWA] SW Fehler:', err));
  });
}

// ─── PWA: Install-Banner ───────────────────────────────────────────────────────
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

// ─── Theme ────────────────────────────────────────────────────────────────────
(function() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.body.dataset.theme = saved;
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';
})();
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.body.dataset.theme = newTheme;
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, newTheme);
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active'); curTab = t.dataset.tab; rerender();
}));

// ─── Start ────────────────────────────────────────────────────────────────────
renderGroups();
startPolling();
