// KSC Dashboard – Gepflegte Daten (Kader, News, Vereinsinfos)
// -----------------------------------------------------------
// Daten, die nicht über freie APIs zuverlässig kommen, werden hier gepflegt.
// ⚠️ Kader/News bitte regelmäßig aktualisieren (Saison 2026/27).

export const KSC_CLUB = {
  name: 'Karlsruher SC',
  short: 'KSC',
  colors: { primary: '#1f5caf', secondary: '#ffffff' },
  logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Karlsruher_SC_Logo_2.svg',
  stadion: 'BBBank Wildparkstadion',
    stadt: 'Karlsruhe',
  gegründet: 1894,
  badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Karlsruher_SC_Logo_2.svg',
};

// ── Spielerstatusfarben (CSS-Klassen) ───────────────────────────────────────
// .status-fit      { color: #3fb950; }  /* Grün – fit */
/// .status-injured  { color: #f85149; }  /* Rot – verletzt */
/// .status-suspended { color: #555555; }  /* Grau – gesperrt */

// ── Kader ────────────────────────────────────────────────────────────────────
export const SQUAD = [
  // ── Profis (Hauptteam) ────────────────────────────────────────────────
  { team: 'profis', nr:  1, name: 'Hannes Berndt', pos: 'TW', status: 'fit' },
  { team: 'profis', nr:  2, name: 'Felix Zingeler', pos: 'AB', status: 'fit' },
  { team: 'profis', nr:  3, name: 'Leonardo Bittencourt', pos: 'AB', status: 'fit' },
  { team: 'profis', nr:  4, name: 'Julius Düker', pos: 'AB', status: 'fit' },
  { team: 'profis', nr:  5, name: 'Marvin Böcker', pos: 'MF', status: 'fit' },
  { team: 'profis', nr:  6, name: 'Jannis Heuer', pos: 'MF', status: 'fit' },
  { team: 'profis', nr:  7, name: 'Kilian Emde', pos: 'MF', status: 'fit' },
  { team: 'profis', nr:  8, name: 'Christian Kinsombi', pos: 'MF', status: 'fit' },
  { team: 'profis', nr:  9, name: 'Kilian Ehlers', pos: 'ST', status: 'fit' },
  { team: 'profis', nr: 10, name: 'Tom Krauß', pos: 'ST', status: 'fit' },
    { team: 'profis', nr: 11, name: 'Marcel Beifus', pos: 'AB', status: 'fit' },
    { team: 'profis', nr: 12, name: 'Lukas Klaus', pos: 'MF', status: 'fit' },
    { team: 'profis', nr: 13, name: 'Elias Huth', pos: 'TW', status: 'fit' },
    { team: 'profis', nr: 14, name: 'Philipp Hofmann', pos: 'ST', status: 'fit' },

    // ── Amateure (Reserveteam) ──────────────────────────────────────────────
    { team: 'amateure', nr:  1, name: 'Luca Ritter', pos: 'TW', status: 'fit' },
    { team: 'amateure', nr:  7, name: 'Leon Strba', pos: 'MF', status: 'fit' },
    { team: 'amateure', nr: 10, name: 'Moritz Heinrich', pos: 'AB', status: 'fit' },
    { team: 'amateure', nr: 15, name: 'Tim Krone', pos: 'MF', status: 'fit' },

    // ── Frauen (Frauenteam) ────────────────────────────────────────────────
    { team: 'frauen', nr:  1, name: 'Leila Henn', pos: 'TW', status: 'fit' },
    { team: 'frauen', nr:  5, name: 'Sophie Kraus', pos: 'AB', status: 'fit' },
    { team: 'frauen', nr: 10, name: 'Lena Petermann', pos: 'ST', status: 'fit' },
    { team: 'frauen', nr: 15, name: 'Svenja Huth', pos: 'MF', status: 'fit' },
  ];

// ── News ───────────────────────────────────────────────────────────────────
// Format: { id, team, datum, titel, text, link }
export const NEWS = [
  {
    id: 1, team: 'profis', datum: '2026-08-04',
    titel: 'Vorbereitung auf Saisonstart abgeschlossen',
    text: 'Der KSC hat das Trainingslager in der Ortenau abgeschlossen und bereitet sich auf das Saisonauftaktspiel gegen Arminia Bielefeld am 8. August vor. Trainer Christian Eichner zeigte sich zufrieden mit der Fitness und der Teamleistung.',
    link: 'https://www.ksc.de/profis/saison/news/show/article/vorbereitung-saisonstart-abgeschlossen',
  },
  {
    id: 2, team: 'profis', datum: '2026-07-28',
    titel: 'Co-Trainer Daniel Scherning vorgestellt',
    text: 'Der KSC präsentiert Daniel Scherning als neuen Co-Trainer. Der zuvor beim SV Wehen Wiesbaden tätige Defensivspezialist soll die Abwehrarbeit mitgestalten und das Training intensivieren.',
    link: 'https://www.ksc.de/profis/saison/news/show/article/neuer-co-trainer-daniel-scherning',
  },
  {
    id: 3, team: 'profis', datum: '2026-07-22',
    titel: 'Testspiele gegen Weiden und Bayern II',
    text: 'In der Vorbereitung bestreitet der KSC zwei Testspiele: gegen den SV Weiden und den FC Bayern München II. Sie dienen der Feinabstimmung vor dem Saisonauftakt gegen Bielefeld.',
    link: 'https://www.ksc.de/profis/saison/news/show/article/testspiele-weiden-bayern2',
  },
  {
    id: 4, team: 'amateure', datum: '2026-08-03',
    titel: 'Amateure starten stark in die Vorbereitung',
    text: 'Die zweite Mannschaft des KSC hat ihr Trainingslager in Bad Ditzenbach erfolgreich abgeschlossen. Mehrere Talente drängen in die Profi-Kader, geführt von Coach Mehmet Polat.',
    link: 'https://www.ksc.de/akademie/mannschaften/news/show/article/amateure-vorbereitung-2026',
  },
  {
    id: 5, team: 'amateure', datum: '2026-07-29',
    titel: 'Talentsichtung für U19 und U17',
    text: 'Bei der Talentsichtung am Konstantinplatz wurden mehrere vielversprechende Nachwuchsspieler für die U19 und U17 des KSC gewonnen.',
    link: 'https://www.ksc.de/akademie/mannschaften/news/show/article/talentsichtung-u19-u17-august-2026',
  },
  {
    id: 6, team: 'frauen', datum: '2026-08-02',
    titel: 'Frauen gewinnen Testspiel gegen Hoffenheim',
    text: 'Die Frauenmannschaft des KSC hat ihr erstes Testspiel der Vorbereitung gegen die TSG Hoffenheim mit 2:1 gewonnen. Coach Petra Werneyer lobte die kämpferische Einstellung und die verbesserte Chancenverwertung.',
    link: 'https://www.ksc.de/frauen/news/show/article/testspiel-sieg-hoffenheim-august-2026',
  },
  {
    id: 7, team: 'frauen', datum: '2026-07-25',
    titel: 'Neuzugang im Angriff',
    text: 'Der KSC Frauen verstärkt seinen Sturm: Die Neuzugänge bringen Torgefährlichkeit und internationale Erfahrung in die Mannschaft für die kommende Saison.',
    link: 'https://www.ksc.de/frauen/news/show/article/neuzugang-angriff-juli-2026',
  },
  {
    id: 8, team: 'profis', datum: '2026-08-06',
    titel: 'Saisonauftakt gegen Bielefeld',
    text: 'Am 8. August 2026 beginnt der KSC mit dem Heimspiel gegen Arminia Bielefeld. Das Saisonauftaktspiel steht unter dem Motto „Alles für den Klassenerhalt“.',
    link: 'https://www.ksc.de/profis/saison/news/show/article/saisonauftakt-bielefeld-2026',
  },
  {
    id: 9, team: 'amateure', datum: '2026-08-05',
    titel: 'U19-Titelverteidiger mit Sieg',
    text: 'Die U19-Mannschaft des KSC hat ihr erstes Testspiel der Saison gegen den SV Weiden mit 3:0 gewonnen und belegt damit den ersten Platz in der Südstaffel.',
    link: 'https://www.ksc.de/akademie/mannschaften/news/show/article/u19-sieg-weiden',
  }
];