import { teams } from './data/teams.js';
import { matches } from './data/matches.js';

const appEl = document.getElementById('app');
const tabs = document.querySelectorAll('.tabs button');
const STORAGE_KEY = 'wm2026_results';
let results = loadResults();

function loadResults() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveResults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function teamId(name) {
  return name.toLowerCase().replace(/ /g,'_').replace(/ü/g,'u').replace(/ç/g,'c').replace(/ã/g,'a');
}

function getTeam(id) {
  return teams.find(t => t.id === id);
}

function calcStandings(groupTeams, groupMatches) {
  const stats = {};
  groupTeams.forEach(t => {
    stats[t.id] = { ...t, played:0, points:0, goalsFor:0, goalsAgainst:0, goalDiff:0 };
  });
  groupMatches.forEach(m => {
    const res = results[String(m.id)];
    if (!res || res.home === '' || res.away === '') return;
    const h = stats[m.home], a = stats[m.away];
    if (!h || !a) return;
    h.played++; a.played++;
    h.goalsFor += +res.home; h.goalsAgainst += +res.away;
    a.goalsFor += +res.away; a.goalsAgainst += +res.home;
    if (+res.home > +res.away) { h.points += 3; }
    else if (+res.home < +res.away) { a.points += 3; }
    else { h.points += 1; a.points += 1; }
  });
  Object.values(stats).forEach(t => { t.goalDiff = t.goalsFor - t.goalsAgainst; });
  return Object.values(stats).sort((a,b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });
}

function flagEl(flagCode) {
  const sp = document.createElement('span');
  sp.className = `fi fi-${flagCode}`;
  sp.style.marginRight = '4px';
  return sp;
}

function renderGroups() {
  appEl.innerHTML = '';
  appEl.style.display = 'grid';
  const groups = [...new Set(teams.map(t => t.group))].sort();
  groups.forEach(groupId => {
    const groupTeams = teams.filter(t => t.group === groupId);
    const groupMatches = matches.filter(m => m.stage === 'group' && m.group === groupId);
    const section = document.createElement('section');
    section.className = 'group';
    const h2 = document.createElement('h2');
    h2.textContent = `Gruppe ${groupId}`;
    section.appendChild(h2);
    // Tabelle
    const table = document.createElement('table');
    const thead = table.createTHead();
    const hr = thead.insertRow();
    ['Team','Sp','Pkt','Tore','Diff'].forEach(txt => { const th = document.createElement('th'); th.textContent = txt; hr.appendChild(th); });
    const tbody = table.createTBody();
    calcStandings(groupTeams, groupMatches).forEach((t,i) => {
      const tr = tbody.insertRow();
      const tdTeam = tr.insertCell();
      tdTeam.style.fontWeight = i < 2 ? 'bold' : 'normal';
      tdTeam.appendChild(flagEl(t.flagCode));
      tdTeam.appendChild(document.createTextNode(t.name));
      [t.played, t.points, `${t.goalsFor}:${t.goalsAgainst}`, t.goalDiff].forEach(v => {
        const td = tr.insertCell(); td.textContent = v;
      });
    });
    section.appendChild(table);
    // Spiele
    groupMatches.forEach(m => {
      const home = getTeam(m.home);
      const away = getTeam(m.away);
      if (!home || !away) return;
      const res = results[String(m.id)] || { home:'', away:'' };
      const row = document.createElement('div');
      row.className = 'match-row';
      const hn = document.createElement('span'); hn.className = 'team-name';
      hn.appendChild(flagEl(home.flagCode)); hn.appendChild(document.createTextNode(home.name));
      const sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = ':';
      const hi = document.createElement('input'); hi.type='number'; hi.min='0'; hi.value=res.home; hi.dataset.match=m.id; hi.dataset.side='home';
      const ai = document.createElement('input'); ai.type='number'; ai.min='0'; ai.value=res.away; ai.dataset.match=m.id; ai.dataset.side='away';
      const an = document.createElement('span'); an.className = 'away-name';
      an.appendChild(flagEl(away.flagCode)); an.appendChild(document.createTextNode(away.name));
      row.appendChild(hn); row.appendChild(hi); row.appendChild(sep); row.appendChild(ai); row.appendChild(an);
      section.appendChild(row);
    });
    appEl.appendChild(section);
  });
  appEl.addEventListener('change', onScoreChange);
}

function onScoreChange(e) {
  const input = e.target;
  if (input.tagName !== 'INPUT') return;
  const matchId = input.dataset.match;
  const side = input.dataset.side;
  if (!results[matchId]) results[matchId] = { home:'', away:'' };
  results[matchId][side] = input.value === '' ? '' : parseInt(input.value,10);
  saveResults();
  switchView('groups');
}

function renderKnockout() {
  appEl.innerHTML = '';
  appEl.style.display = 'block';
  const container = document.createElement('div');
  container.id = 'knockout-view';
  const roundNames = {
    'round_of_32': 'Runde der 32',
    'round_of_16': 'Achtelfinale',
    'quarter_final': 'Viertelfinale',
    'semi_final': 'Halbfinale',
    'third_place': 'Spiel um Platz 3',
    'final': 'Finale'
  };
  const stages = ['round_of_32','round_of_16','quarter_final','semi_final','third_place','final'];
  stages.forEach(stage => {
    const stageMatches = matches.filter(m => m.stage === stage);
    if (!stageMatches.length) return;
    const col = document.createElement('div');
    col.className = 'ko-round';
    const h3 = document.createElement('h3');
    h3.textContent = roundNames[stage] || stage;
    col.appendChild(h3);
    stageMatches.forEach(m => {
      const box = document.createElement('div');
      box.className = 'ko-match';
      const homeTeam = getTeam(m.home);
      const awayTeam = getTeam(m.away);
      const res = results[String(m.id)] || { home:'', away:'' };
      const makeRow = (team, side, val) => {
        const row = document.createElement('div'); row.className = 'ko-team';
        if (team) { row.appendChild(flagEl(team.flagCode)); row.appendChild(document.createTextNode(team.name)); }
        else { row.appendChild(document.createTextNode(m[side])); }
        const inp = document.createElement('input'); inp.type='number'; inp.min='0'; inp.value=val; inp.dataset.match=m.id; inp.dataset.side=side;
        row.appendChild(inp);
        return row;
      };
      box.appendChild(makeRow(homeTeam,'home',res.home));
      box.appendChild(makeRow(awayTeam,'away',res.away));
      col.appendChild(box);
    });
    container.appendChild(col);
  });
  appEl.appendChild(container);
  appEl.addEventListener('change', onKoScoreChange);
}

function onKoScoreChange(e) {
  const input = e.target;
  if (input.tagName !== 'INPUT') return;
  const matchId = input.dataset.match;
  const side = input.dataset.side;
  if (!results[matchId]) results[matchId] = { home:'', away:'' };
  results[matchId][side] = input.value === '' ? '' : parseInt(input.value,10);
  saveResults();
}

function switchView(view) {
  tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  if (view === 'groups') renderGroups();
  else renderKnockout();
}

tabs.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
switchView('groups');
