/* Daumenprobe: Tipp vorher, Wirklichkeit danach gemessen. Spielstand nur im Browser. */
(function () {
  'use strict';
  const DP = window.DP;
  const KEY = 'daumenprobe.v1';
  const DAILY_LIMIT = 5;

  const CITIES = [
    { id: 'hannover', lat: 52.37, lon: 9.73, de: 'Hannover', en: 'Hanover', eu: true },
    { id: 'berlin', lat: 52.52, lon: 13.41, de: 'Berlin', en: 'Berlin', eu: true },
    { id: 'muenchen', lat: 48.14, lon: 11.58, de: 'München', en: 'Munich', eu: true },
    { id: 'hamburg', lat: 53.55, lon: 9.99, de: 'Hamburg', en: 'Hamburg', eu: true },
    { id: 'tokio', lat: 35.68, lon: 139.69, de: 'Tokio', en: 'Tokyo', eu: false },
    { id: 'sydney', lat: -33.87, lon: 151.21, de: 'Sydney', en: 'Sydney', eu: false },
    { id: 'newyork', lat: 40.71, lon: -74.01, de: 'New York', en: 'New York', eu: false },
    { id: 'kapstadt', lat: -33.92, lon: 18.42, de: 'Kapstadt', en: 'Cape Town', eu: false }
  ];

  const I18N = {
    de: {
      title: 'Daumenprobe',
      tagline: 'Erst tippen, dann messen.',
      swipe_hint: 'Wische oder tippe',
      measure: 'Messen',
      pts_unit: 'Punkte',
      rules_title: 'So geht\'s',
      howto: [
        'Du bekommst eine Behauptung.',
        'Tippe: stimmt (👍) oder stimmt nicht (👎).',
        'Sag, wie sicher du bist: 50 % ist geraten, 100 % ist ganz sicher.',
        'Wir messen live nach. Recht gehabt gibt Punkte, Daneben kostet Punkte.'
      ],
      rules_goal: 'Es gewinnt, wer die meisten Punkte hat. Treffer bringen Punkte, Daneben kosten Punkte, und zwar mehr, je sicherer du dich gibst.',
      rules_cols: ['Sicherheit', 'Treffer', 'Daneben'],
      rules_foot: 'Fünf Behauptungen pro Tag. Nur Spielpunkte, nie Geld.',
      conf_hint: '50 % = geraten, 100 % = ganz sicher. Je sicherer, desto mehr Punkte, aber auch desto mehr Abzug.',
      go: 'Neue Behauptung',
      goDone: 'Das war\'s für heute. Morgen gibt es neue.',
      left: 'noch {n} heute',
      stat_hit: 'Treffer', stat_pts: 'Punkte', stat_cal: 'Kalibrierung',
      cal_need: 'ab 5 Tipps',
      cal_title: 'Stimmt deine Sicherheit?',
      cal_help: 'Der Balken ist die Trefferquote, der Strich deine Sicherheit. Liegen sie beieinander, schätzt du gut ein.',
      claimLead: 'Stimmt das?',
      yes: 'Stimmt', no: 'Stimmt nicht',
      confTitle: 'Wie sicher bist du?',
      conf50: 'geraten', conf100: 'ganz sicher',
      measuring: 'Wird gemessen …',
      hit: 'Treffer!', miss: 'Daneben.',
      truth_yes: 'Die Behauptung stimmte.', truth_no: 'Die Behauptung stimmte nicht.',
      you_tipped: 'Dein Tipp: {tip}, {conf} % sicher.',
      pts: '{n} Punkte',
      rule: 'Messregel',
      measured: 'Gemessen',
      next: 'Weiter', home: 'Zur Startseite',
      err: 'Die Messung hat gerade nicht geklappt. Dein Tipp wird erst gezählt, wenn gemessen wurde.',
      retry: 'Nochmal messen',
      cancel: 'Verwerfen (zählt als Versuch)',
      waiting: 'Wartet auf morgen',
      open_title: 'Offene Behauptungen',
      resolve: 'Jetzt auflösen',
      due: 'Auflösung ab {d}',
      history: 'Zuletzt',
      none: 'Noch nichts getippt.',
      backup: 'Sichern und laden',
      backup_help: 'Dein Spielstand liegt nur in diesem Browser. Sichere ihn ab und zu, falls der Browser Daten löscht (Safari kann das nach etwa 7 Tagen ohne Besuch).',
      export_file: 'Datei sichern', export_code: 'Code kopieren', copied: 'Kopiert.',
      import_title: 'Laden',
      import_ph: 'Code oder Sicherungsdatei-Inhalt hier einfügen',
      import_btn: 'Laden', import_file: 'Datei wählen',
      import_ok: 'Geladen: {n} Tipps.', import_bad: 'Das hat nicht geklappt. Ist es ein Code von Daumenprobe?',
      remind: 'Du hast länger nicht gesichert. Sichere deinen Stand unten.',
      lang: 'Sprache',
      made_by: 'Ein Spiel von', imprint: 'Impressum', privacy: 'Datenschutz',
      privacy_text: 'Daumenprobe speichert Tipps und Punkte nur in deinem Browser (localStorage). Kein Konto, kein Tracking, keine Cookies. Zum Messen ruft dein Browser Open-Meteo.com (Wetter, Luft), wheretheiss.at (ISS) und earthquake.usgs.gov (Erdbeben) ab; diese Dienste sehen dabei deine IP-Adresse. Dein Standort wird nicht abgefragt, die Orte sind fest vorgegeben. Hosting: Cloudflare.',
      data_credit: 'Wetterdaten: Open-Meteo.com (CC BY 4.0). ISS-Position: wheretheiss.at. Erdbeben: USGS. Nur Spielpunkte, nie Geld.',
      measure_msg: {
        quake: 'Der USGS meldet {v} Beben ab Stärke 4,5 in den letzten 24 Stunden.',
        quakemax: 'Das stärkste Beben hatte Stärke {v}.',
        aqi: 'In {city} liegt der Luftindex bei {v}.',
        winddir: 'In {city} kommt der Wind aus {v}° ({dir}).',
        daylen: '{city}: {a} Stunden Tageslicht, {city2}: {b} Stunden.',
        moon: 'Der Mond ist zu {v} % beleuchtet.',
        temp: 'In {city} sind es {v} °C.',
        isday: 'In {city} steht die Sonne gerade {v}.',
        rain: 'In {city} fallen gerade {v} mm Regen pro Stunde.',
        wind: 'In {city} weht der Wind mit {v} km/h.',
        iss: 'Die ISS ist bei {v}° Breite.',
        tomorrow: 'Höchstwert {a} °C am Tag des Tipps, {b} °C am Tag danach.'
      },
      day: 'über dem Horizont', night: 'unter dem Horizont',
      lvl_title: 'Schwierigkeit', lvl: { s: 'Leicht', m: 'Mittel', l: 'Schwer' },
      words: {
        s: ['Geraten 🤷', 'Ziemlich sicher 🙂', 'Ganz sicher 💪'],
        m: ['Geraten', 'Eher sicher', 'Ziemlich sicher', 'Sehr sicher', 'Fast sicher', 'Ganz sicher']
      },
      lv: {
        s: { how3: 'Sag, wie sicher du bist: geraten, ziemlich sicher oder ganz sicher.', goal: 'Treffer bringen Punkte. Daneben kostet dich nichts.', hint: 'Je sicherer du bist, desto mehr Punkte gibt ein Treffer.' },
        m: { how3: 'Sag, wie sicher du bist: von geraten bis ganz sicher.', goal: 'Es gewinnt, wer die meisten Punkte hat. Treffer bringen Punkte, Daneben kostet höchstens 10.', hint: 'Je sicherer du bist, desto mehr Punkte gibt ein Treffer, aber ein Daneben kostet auch mehr.' }
      },
      you_tipped_w: 'Dein Tipp: {tip}, {conf}.',
      dir: { N: 'Norden', E: 'Osten', S: 'Süden', W: 'Westen' },
      claims: {
        quake: 'Weltweit gab es in den letzten 24 Stunden mehr als {N} Erdbeben ab Stärke 4,5.',
        quakemax: 'Das stärkste Erdbeben der letzten 24 Stunden hatte mindestens Stärke {M}.',
        aqi: 'Die Luft in {city} ist gerade besser als Stufe {A} (EU-Luftindex, kleiner ist besser).',
        winddir: 'In {city} kommt der Wind gerade aus {D}.',
        daylen: 'In {city} ist der heutige Tag länger als in {city2}.',
        moon: 'Der Mond ist gerade mehr als halb beleuchtet.',
        temp: 'In {city} sind es gerade mehr als {T} °C.',
        isday: 'In {city} ist die Sonne gerade über dem Horizont (nach Sonnenuntergang: nein).',
        rain: 'In {city} regnet es gerade.',
        wind: 'In {city} weht gerade mehr als {W} km/h Wind.',
        iss: 'Die ISS fliegt gerade nördlich des Äquators.',
        tomorrow: 'Morgen wird es in {city} wärmer als heute (Tageshöchstwert).'
      },
      rules: {
        quake: 'Stimmt, wenn der Erdbebendienst USGS für die letzten 24 Stunden mehr als {N} Beben ab Stärke 4,5 meldet.',
        quakemax: 'Stimmt, wenn das stärkste vom USGS gemeldete Beben der letzten 24 Stunden mindestens Stärke {M} hat.',
        aqi: 'Stimmt, wenn der europäische Luftqualitäts-Index laut Open-Meteo jetzt unter {A} liegt.',
        winddir: 'Stimmt, wenn die gemessene Windrichtung im Sektor {D} liegt (90° breit, Open-Meteo).',
        daylen: 'Stimmt, wenn die Zeit mit Sonne über dem Horizont heute in {city} länger ist als in {city2} (Open-Meteo).',
        moon: 'Stimmt, wenn der Mond jetzt zu mehr als 50 % beleuchtet ist. Das wird aus dem Mondalter gerechnet, nicht gemessen.',
        temp: 'Stimmt, wenn die gemessene Temperatur über {T} °C liegt (Open-Meteo, aktueller Wert).',
        isday: 'Stimmt, wenn die Sonne am Ort laut Open-Meteo jetzt über dem Horizont steht. Dämmerung nach Sonnenuntergang zählt als nein.',
        rain: 'Stimmt, wenn Open-Meteo jetzt Niederschlag über 0 mm meldet.',
        wind: 'Stimmt, wenn die gemessene Windgeschwindigkeit über {W} km/h liegt (Open-Meteo, 10 m Höhe).',
        iss: 'Stimmt, wenn die gemeldete Breite der ISS größer als 0° ist (wheretheiss.at).',
        tomorrow: 'Stimmt, wenn der Tageshöchstwert am Folgetag höher ist als am Tag des Tipps (Open-Meteo).'
      }
    },
    en: {
      title: 'Daumenprobe',
      tagline: 'Guess first, then measure.',
      swipe_hint: 'Swipe or tap',
      measure: 'Measure',
      pts_unit: 'points',
      rules_title: 'How it works',
      howto: [
        'You get a claim.',
        'Tip: true (👍) or not true (👎).',
        'Say how sure you are: 50 % is a guess, 100 % is totally sure.',
        'We measure it live. Being right earns points, being wrong costs points.'
      ],
      rules_goal: 'The one with the most points wins. Hits earn points, misses cost points, and the more so the surer you say you are.',
      rules_cols: ['Confidence', 'Hit', 'Miss'],
      rules_foot: 'Five claims per day. Play points only, never money.',
      conf_hint: '50 % = a guess, 100 % = totally sure. The surer you are, the more you win, but also the more you lose.',
      go: 'New claim',
      goDone: 'That\'s it for today. New ones tomorrow.',
      left: '{n} left today',
      stat_hit: 'Hits', stat_pts: 'Points', stat_cal: 'Calibration',
      cal_need: 'after 5 tips',
      cal_title: 'Is your confidence right?',
      cal_help: 'The bar is how often you were right, the line is how sure you were. If they match, you judge well.',
      claimLead: 'True or not?',
      yes: 'True', no: 'Not true',
      confTitle: 'How sure are you?',
      conf50: 'a guess', conf100: 'totally sure',
      measuring: 'Measuring …',
      hit: 'Hit!', miss: 'Missed.',
      truth_yes: 'The claim was true.', truth_no: 'The claim was not true.',
      you_tipped: 'Your tip: {tip}, {conf} % sure.',
      pts: '{n} points',
      rule: 'Measuring rule',
      measured: 'Measured',
      next: 'Next', home: 'Home',
      err: 'The measurement did not work right now. Your tip only counts once it has been measured.',
      retry: 'Measure again',
      cancel: 'Discard (counts as an attempt)',
      waiting: 'Waiting for tomorrow',
      open_title: 'Open claims',
      resolve: 'Resolve now',
      due: 'Resolves from {d}',
      history: 'Recent',
      none: 'No tips yet.',
      backup: 'Save and load',
      backup_help: 'Your progress lives only in this browser. Save it now and then in case the browser clears data (Safari can do that after about 7 days without a visit).',
      export_file: 'Save file', export_code: 'Copy code', copied: 'Copied.',
      import_title: 'Load',
      import_ph: 'Paste a code or the contents of a backup file here',
      import_btn: 'Load', import_file: 'Choose file',
      import_ok: 'Loaded: {n} tips.', import_bad: 'That did not work. Is it a Daumenprobe code?',
      remind: 'You have not saved for a while. Save your progress below.',
      lang: 'Language',
      made_by: 'A game by', imprint: 'Legal notice', privacy: 'Privacy',
      privacy_text: 'Daumenprobe stores tips and points only in your browser (localStorage). No account, no tracking, no cookies. To measure, your browser calls Open-Meteo.com (weather, air), wheretheiss.at (ISS) and earthquake.usgs.gov (earthquakes); these services see your IP address. Your location is not requested, the places are fixed. Hosting: Cloudflare.',
      data_credit: 'Weather data: Open-Meteo.com (CC BY 4.0). ISS position: wheretheiss.at. Earthquakes: USGS. Play points only, never money.',
      measure_msg: {
        quake: 'The USGS reports {v} quakes of magnitude 4.5+ in the last 24 hours.',
        quakemax: 'The strongest quake had magnitude {v}.',
        aqi: 'The air index in {city} is {v}.',
        winddir: 'In {city} the wind comes from {v}° ({dir}).',
        daylen: '{city}: {a} hours of daylight, {city2}: {b} hours.',
        moon: 'The moon is {v} % lit.',
        temp: 'It is {v} °C in {city}.',
        isday: 'In {city} the sun is {v} right now.',
        rain: 'In {city} {v} mm of rain per hour are falling.',
        wind: 'In {city} the wind blows at {v} km/h.',
        iss: 'The ISS is at {v}° latitude.',
        tomorrow: 'High of {a} °C on the day of your tip, {b} °C the day after.'
      },
      day: 'above the horizon', night: 'below the horizon',
      lvl_title: 'Difficulty', lvl: { s: 'Easy', m: 'Medium', l: 'Hard' },
      words: {
        s: ['A guess 🤷', 'Pretty sure 🙂', 'Totally sure 💪'],
        m: ['A guess', 'Leaning yes', 'Pretty sure', 'Very sure', 'Almost certain', 'Totally sure']
      },
      lv: {
        s: { how3: 'Say how sure you are: a guess, pretty sure or totally sure.', goal: 'Hits earn points. A miss costs you nothing.', hint: 'The surer you are, the more a hit is worth.' },
        m: { how3: 'Say how sure you are: from a guess to totally sure.', goal: 'The one with the most points wins. Hits earn points, a miss costs 10 at most.', hint: 'The surer you are, the more a hit is worth, but a miss costs more too.' }
      },
      you_tipped_w: 'Your tip: {tip}, {conf}.',
      dir: { N: 'north', E: 'east', S: 'south', W: 'west' },
      claims: {
        quake: 'In the last 24 hours there were more than {N} earthquakes of magnitude 4.5 or higher worldwide.',
        quakemax: 'The strongest earthquake of the last 24 hours had a magnitude of at least {M}.',
        aqi: 'The air in {city} is better than level {A} right now (EU air index, lower is better).',
        winddir: 'The wind in {city} is coming from the {D} right now.',
        daylen: 'Today is longer in {city} than in {city2}.',
        moon: 'The moon is more than half lit right now.',
        temp: 'It is warmer than {T} °C in {city} right now.',
        isday: 'The sun is above the horizon in {city} right now (after sunset: no).',
        rain: 'It is raining in {city} right now.',
        wind: 'The wind in {city} is faster than {W} km/h right now.',
        iss: 'The ISS is north of the equator right now.',
        tomorrow: 'Tomorrow will be warmer than today in {city} (daily high).'
      },
      rules: {
        quake: 'True if the USGS reports more than {N} quakes of magnitude 4.5+ for the last 24 hours.',
        quakemax: 'True if the strongest quake the USGS reports for the last 24 hours is at least magnitude {M}.',
        aqi: 'True if the European air quality index per Open-Meteo is below {A} right now.',
        winddir: 'True if the measured wind direction is within the {D} sector (90° wide, Open-Meteo).',
        daylen: 'True if the time with the sun above the horizon today is longer in {city} than in {city2} (Open-Meteo).',
        moon: 'True if the moon is more than 50 % lit right now. This is calculated from the moon age, not measured.',
        temp: 'True if the measured temperature is above {T} °C (Open-Meteo, current value).',
        isday: 'True if, per Open-Meteo, the sun is above the horizon at the place right now. Twilight after sunset counts as no.',
        rain: 'True if Open-Meteo reports precipitation above 0 mm right now.',
        wind: 'True if the measured wind speed is above {W} km/h (Open-Meteo, 10 m height).',
        iss: 'True if the reported latitude of the ISS is greater than 0° (wheretheiss.at).',
        tomorrow: 'True if the daily high on the following day is higher than on the day of your tip (Open-Meteo).'
      }
    }
  };

  /* ---------- Behauptungen ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function cityById(id) { return CITIES.filter(function (c) { return c.id === id; })[0]; }

  const MAKERS = {
    temp: function () { return { tpl: 'temp', city: pick(CITIES).id, T: pick([0, 5, 10, 15, 20, 25]) }; },
    isday: function () { return { tpl: 'isday', city: pick(CITIES).id }; },
    rain: function () { return { tpl: 'rain', city: pick(CITIES).id }; },
    wind: function () { return { tpl: 'wind', city: pick(CITIES).id, W: pick([10, 15, 20, 30]) }; },
    iss: function () { return { tpl: 'iss' }; },
    quake: function () { return { tpl: 'quake', N: pick([10, 15, 20, 25]) }; },
    quakemax: function () { return { tpl: 'quakemax', M: pick([5, 5.5, 6]) }; },
    aqi: function () { return { tpl: 'aqi', city: pick(CITIES).id, A: pick([20, 40]) }; },
    winddir: function () { return { tpl: 'winddir', city: pick(CITIES).id, D: pick(['N', 'E', 'S', 'W']) }; },
    daylen: function () {
      const a = pick(CITIES);
      let b = pick(CITIES);
      while (b.id === a.id) b = pick(CITIES);
      return { tpl: 'daylen', city: a.id, city2: b.id };
    },
    moon: function () { return { tpl: 'moon' }; },
    tomorrow: function () {
      const today = DP.dayKey();
      const eu = CITIES.filter(function (c) { return c.eu; });
      return { tpl: 'tomorrow', city: pick(eu).id, created: today, due: DP.addDays(today, 1) };
    }
  };
  const POOLS = {
    s: ['temp', 'isday', 'isday', 'rain', 'wind', 'daylen', 'moon'],
    m: ['temp', 'isday', 'rain', 'wind', 'iss', 'tomorrow', 'quake', 'quakemax', 'aqi', 'winddir', 'daylen', 'moon'],
    l: ['temp', 'temp', 'isday', 'rain', 'wind', 'iss', 'tomorrow', 'quake', 'quakemax', 'aqi', 'winddir', 'daylen', 'moon']
  };
  const NOCITY = { iss: 1, quake: 1, quakemax: 1, moon: 1 };

  function newClaim() { return MAKERS[pick(POOLS[S.level] || POOLS.l)](); }
  function isLater(claim) { return claim.tpl === 'tomorrow'; }
  function validClaim(c) {
    if (!c || !MAKERS[c.tpl]) return false;
    if (!NOCITY[c.tpl] && !cityById(c.city)) return false;
    if (c.tpl === 'daylen' && !cityById(c.city2)) return false;
    if (c.tpl === 'winddir' && ['N', 'E', 'S', 'W'].indexOf(c.D) < 0) return false;
    if (c.tpl === 'tomorrow' && !(/^\d{4}-\d{2}-\d{2}$/.test(c.created) && /^\d{4}-\d{2}-\d{2}$/.test(c.due))) return false;
    return true;
  }

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] === undefined ? m : vars[k]; });
  }
  function claimVars(claim, lang) {
    const c = claim.city ? cityById(claim.city) : null;
    const c2 = claim.city2 ? cityById(claim.city2) : null;
    return { city: c ? c[lang] : '', city2: c2 ? c2[lang] : '', T: claim.T, W: claim.W, N: claim.N, A: claim.A,
      M: claim.M === undefined ? undefined : num(claim.M, lang, 1), D: claim.D ? I18N[lang].dir[claim.D] : undefined };
  }
  function claimText(claim, lang) { return fill(I18N[lang].claims[claim.tpl], claimVars(claim, lang)); }
  function ruleText(claim, lang) { return fill(I18N[lang].rules[claim.tpl], claimVars(claim, lang)); }
  function num(v, lang, d) {
    return Number(v).toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: d === undefined ? 1 : d });
  }
  function measuredText(claim, shown, lang) {
    const t = I18N[lang];
    const vars = claimVars(claim, lang);
    if (claim.tpl === 'tomorrow') { vars.a = num(shown.today, lang); vars.b = num(shown.tomorrow, lang); }
    else if (claim.tpl === 'daylen') { vars.a = num(shown.a, lang); vars.b = num(shown.b, lang); }
    else if (claim.tpl === 'winddir') { vars.v = Math.round(shown); vars.dir = t.dir[['N', 'E', 'S', 'W'].filter(function (k) { return DP.inSector(shown, k); })[0]]; }
    else if (claim.tpl === 'isday') vars.v = shown === 1 ? t.day : t.night;
    else vars.v = num(shown, lang, claim.tpl === 'iss' ? 2 : 1);
    return fill(t.measure_msg[claim.tpl], vars);
  }

  /* ---------- Messung ---------- */
  function fetchJson(url) {
    const ctl = new AbortController();
    const timer = setTimeout(function () { ctl.abort(); }, 10000);
    return fetch(url, { signal: ctl.signal }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).finally(function () { clearTimeout(timer); });
  }
  function getData(claim) {
    if (claim.tpl === 'iss') return fetchJson('https://api.wheretheiss.at/v1/satellites/25544');
    if (claim.tpl === 'quake' || claim.tpl === 'quakemax') return fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
    if (claim.tpl === 'moon') return Promise.resolve({ now: Date.now() });
    if (claim.tpl === 'aqi') {
      const ca = cityById(claim.city);
      return fetchJson('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + ca.lat + '&longitude=' + ca.lon + '&current=european_aqi&timezone=auto');
    }
    if (claim.tpl === 'daylen') {
      const a = cityById(claim.city), b = cityById(claim.city2);
      return fetchJson('https://api.open-meteo.com/v1/forecast?latitude=' + a.lat + ',' + b.lat + '&longitude=' + a.lon + ',' + b.lon + '&daily=daylight_duration&forecast_days=1&timezone=auto');
    }
    const c = cityById(claim.city);
    let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&timezone=auto';
    if (claim.tpl === 'tomorrow') url += '&daily=temperature_2m_max&past_days=5&forecast_days=2';
    else url += '&current=temperature_2m,is_day,precipitation,wind_speed_10m,wind_direction_10m';
    return fetchJson(url);
  }
  function measure(claim) {
    return getData(claim).then(function (data) {
      const m = DP.measure[claim.tpl](claim, data);
      if (!m) throw new Error('no data');
      return m;
    });
  }

  /* ---------- Speicher ---------- */
  let memory = null;
  function blank() { return { v: 1, level: 'l', lang: null, tips: [], lastExport: null, draws: [], current: null }; }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.tips)) return Object.assign(blank(), s);
      }
    } catch (e) { /* Speicher gesperrt */ }
    return memory || blank();
  }
  function save(s) {
    memory = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* nur im Speicher weiter */ }
  }

  let S = load();
  if (!S.lang) S.lang = (navigator.language || 'de').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  const ui = { view: 'home', claim: null, tip: null, conf: null, result: null, error: false, busy: false, msg: '' };

  function T() { return I18N[S.lang]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c];
    });
  }
  /* Gezogene Behauptungen heute: Wegwerfen und Neuladen zählen mit, damit man sich keine leichten aussucht. */
  function todayCount() {
    const k = DP.dayKey();
    const drawn = (S.draws || []).filter(function (ts) { return DP.dayKey(new Date(ts)) === k; }).length;
    const tipped = S.tips.filter(function (t) { return DP.dayKey(new Date(t.ts)) === k; }).length;
    return Math.max(drawn, tipped);
  }
  function resolvedTips() { return S.tips.filter(function (t) { return t.resolved; }); }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ---------- Ablauf ---------- */
  function finishTip(rec, m) {
    rec.resolved = true;
    rec.outcome = m.outcome;
    rec.shown = m.shown;
    rec.pts = DP.points(rec.tip, rec.conf, m.outcome, rec.level);
    rec.measuredAt = Date.now();
  }

  function submitInstant() {
    ui.busy = true; ui.error = false; render();
    measure(ui.claim).then(function (m) {
      const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, level: S.level, ts: Date.now(), resolved: false };
      finishTip(rec, m);
      S.tips.push(rec); S.current = null; save(S);
      ui.result = rec; ui.view = 'result'; ui.busy = false; render();
    }).catch(function () {
      ui.busy = false; ui.error = true; render();
    });
  }

  function submitLater() {
    const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, level: S.level, ts: Date.now(), resolved: false };
    S.tips.push(rec); S.current = null; save(S);
    ui.result = rec; ui.view = 'later'; render();
  }

  function resolveLater(id) {
    const rec = S.tips.filter(function (t) { return t.id === id; })[0];
    if (!rec) return;
    ui.busy = true; ui.msg = ''; render();
    measure(rec.claim).then(function (m) {
      finishTip(rec, m); save(S);
      ui.result = rec; ui.view = 'result'; ui.busy = false; render();
    }).catch(function () {
      ui.busy = false; ui.msg = T().err; render();
    });
  }

  /* ---------- Ansichten ---------- */
  const THEME_HEX = { home: '#3a2cff', c0: '#3a2cff', c1: '#ffe45c', c2: '#ff7a1a', c3: '#43c7ff', yes: '#19e0a0', no: '#ff3b8d', hit: '#19e0a0', miss: '#ff3b8d', wait: '#ffe45c' };
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function claimTheme(claim) { return 'c' + (hashStr(JSON.stringify(claim)) % 4); }
  function themeFor() {
    if (ui.view === 'tip') return claimTheme(ui.claim);
    if (ui.view === 'conf') return ui.tip ? 'yes' : 'no';
    if (ui.view === 'result') return DP.isHit(ui.result.tip, ui.result.outcome) ? 'hit' : 'miss';
    if (ui.view === 'later') return 'wait';
    return 'home';
  }
  const STEPS = { s: [50, 75, 100], m: [50, 60, 70, 80, 90, 100], l: [50, 60, 70, 80, 90, 100] };
  function lvl() { return STEPS[S.level] ? S.level : 'l'; }
  function steps() { return STEPS[lvl()]; }
  function confWord(c, level) {
    const L2 = level || lvl();
    if (L2 === 'l') return null;
    const st = STEPS[L2];
    const i = st.indexOf(c);
    return T().words[L2][i < 0 ? 0 : i];
  }
  function signed(n) { return n > 0 ? '+' + n : String(n).replace('-', '−'); }

  function langs() {
    return '<div class="langs">' +
      '<button class="chip" data-act="lang" data-v="de" aria-pressed="' + (S.lang === 'de') + '">DE</button>' +
      '<button class="chip" data-act="lang" data-v="en" aria-pressed="' + (S.lang === 'en') + '">EN</button></div>';
  }
  function header() { return '<header class="top"><div><h1 class="mark">' + esc(T().title) + '</h1><p class="tagline">' + esc(T().tagline) + '</p></div>' + langs() + '</header>'; }
  function topbar() {
    const n = Math.min(DAILY_LIMIT, todayCount());
    let d = '<div class="dots" role="img" aria-label="' + n + ' / ' + DAILY_LIMIT + '">';
    for (let i = 0; i < DAILY_LIMIT; i++) d += '<i class="' + (i < n ? 'on' : '') + '"></i>';
    return '<header class="top">' + d + '</div>' + langs() + '</header>';
  }

  function rulesSheet() {
    const t = T();
    let h = '<details class="sheet"' + (S.tips.length ? '' : ' open') + '><summary>' + esc(t.rules_title) + '</summary><ol class="howto">';
    const lv = t.lv[lvl()];
    t.howto.forEach(function (r, i) { h += '<li>' + esc(i === 2 && lv ? lv.how3 : r) + '</li>'; });
    h += '</ol><p class="goal">' + esc(lv ? lv.goal : t.rules_goal) + '</p>';
    h += '<table class="scale"><thead><tr><th>' + esc(t.rules_cols[0]) + '</th><th>' + esc(t.rules_cols[1]) + '</th><th>' + esc(t.rules_cols[2]) + '</th></tr></thead><tbody>';
    (lvl() === 's' ? [50, 75, 100] : [50, 70, 100]).forEach(function (c) {
      const w = lvl() === 's' ? confWord(c) : null;
      const label = w ? w : c + ' %' + (c === 50 ? ' (' + t.conf50 + ')' : c === 100 ? ' (' + t.conf100 + ')' : '');
      h += '<tr><td>' + esc(label) + '</td><td class="hit">' + signed(DP.points(true, c, true, lvl())) + '</td><td class="miss">' + signed(DP.points(true, c, false, lvl())) + '</td></tr>';
    });
    h += '</tbody></table><p class="small">' + esc(t.rules_foot) + '</p></details>';
    return h;
  }

  function viewHome() {
    const t = T();
    const st = DP.stats(resolvedTips());
    const left = DAILY_LIMIT - todayCount();
    const open = S.tips.filter(function (x) { return !x.resolved; });
    const today = DP.dayKey();
    let h = header();

    const lastExport = S.lastExport ? Date.now() - S.lastExport : Infinity;
    if (S.tips.length >= 3 && lastExport > 7 * 86400000) h += '<div class="notice">' + esc(t.remind) + '</div>';

    h += '<div class="hero"><b class="hero-n">' + signed(st.pts) + '</b><span class="hero-l">' + esc(t.stat_pts) + '</span>' +
      '<div class="hero-sub"><span>' + (st.total ? Math.round(st.hitRate * 100) + ' %' : '–') + ' ' + esc(t.stat_hit) + '</span>' +
      '<span>' + esc(t.stat_cal) + ' ' + (st.calibration === null ? '–' : st.calibration + ' %') + '</span></div></div>';
    h += '<div class="levels" role="group" aria-label="' + esc(t.lvl_title) + '"><span>' + esc(t.lvl_title) + '</span>' +
      ['s', 'm', 'l'].map(function (k) { return '<button class="chip" data-act="level" data-v="' + k + '" aria-pressed="' + (lvl() === k) + '">' + esc(t.lvl[k]) + '</button>'; }).join('') + '</div>';
    if (left > 0) h += '<button class="btn" data-act="start">' + esc(t.go) + '</button><p class="hint" style="margin-top:10px">' + esc(fill(t.left, { n: left })) + '</p>';
    else h += '<p class="small" style="margin-top:14px">' + esc(t.goDone) + '</p>';

    h += rulesSheet();

    if (open.length) {
      h += '<details class=\"dark\"' + '' + '><summary>' + esc(t.open_title) + '</summary>';
      open.forEach(function (o) {
        const ready = today > o.claim.due;
        h += '<div class="row"><div>' + esc(claimText(o.claim, S.lang)) +
          '<div class="small">' + esc(o.tip ? t.yes : t.no) + ', ' + o.conf + ' %</div></div><div>' +
          (ready ? '<button class="chip" data-act="resolve" data-id="' + esc(o.id) + '"' + (ui.busy ? ' disabled' : '') + '>' + esc(t.resolve) + '</button>'
            : '<span class="small">' + esc(fill(t.due, { d: DP.addDays(o.claim.due, 1) })) + '</span>') +
          '</div></div>';
      });
      if (ui.msg) h += '<p class="small">' + esc(ui.msg) + '</p>';
      h += '</details>';
    }

    if (st.total >= 5) {
      h += '<details class=\"dark\"' + '' + '><summary>' + esc(t.cal_title) + '</summary><div class="bars">';
      st.buckets.forEach(function (b) {
        if (!b.n) return;
        h += '<div class="bar"><span>' + b.range[0] + '–' + b.range[1] + '</span><div class="track"><div class="fill" style="width:' +
          Math.round(b.hitRate * 100) + '%"></div><div class="mark-line" style="left:calc(' + Math.round(b.avgConf * 100) + '% - 2px)"></div></div><span>' +
          Math.round(b.hitRate * 100) + '%</span></div>';
      });
      h += '</div><p class="small" style="margin-top:10px">' + esc(t.cal_help) + '</p></details>';
    }

    h += '<details class=\"dark\"' + '' + '><summary>' + esc(t.history) + '</summary>';
    const recent = resolvedTips().slice(-8).reverse();
    if (!recent.length) h += '<p class="small">' + esc(t.none) + '</p>';
    recent.forEach(function (r) {
      h += '<div class="row"><span>' + esc(claimText(r.claim, S.lang)) + '</span><span class="' + (r.pts >= 0 ? 'pts-pos' : 'pts-neg') + '">' + signed(r.pts) + '</span></div>';
    });
    h += '</details>';

    h += '<details class=\"dark\"' + '' + '><summary>' + esc(t.backup) + '</summary><p class="small">' + esc(t.backup_help) + '</p>' +
      '<button class="btn ghost" data-act="export-file">' + esc(t.export_file) + '</button>' +
      '<button class="btn ghost" data-act="export-code">' + esc(t.export_code) + '</button>' +
      '<h2 style="margin-top:18px">' + esc(t.import_title) + '</h2>' +
      '<textarea id="imp" placeholder="' + esc(t.import_ph) + '"></textarea>' +
      '<button class="btn ghost" data-act="import-text">' + esc(t.import_btn) + '</button>' +
      '<button class="btn ghost" data-act="import-file">' + esc(t.import_file) + '</button>' +
      '<input id="impfile" type="file" accept="application/json,.json,.txt" hidden>' +
      '<p class="small" id="bmsg" style="margin-top:10px"></p></details>';
    return h;
  }

  function viewTip() {
    const t = T();
    return topbar() + '<main class="stage"><div class="deck"><div class="swipe" id="swipe">' +
      '<div class="tint yes"></div><div class="tint no"></div>' +
      '<span class="stamp yes">' + esc(t.yes) + '!</span><span class="stamp no">' + esc(t.no) + '!</span>' +
      '<p class="claim-big" lang="' + S.lang + '">' + esc(claimText(ui.claim, S.lang)) + '</p></div></div>' +
      '<p class="hint">' + esc(t.swipe_hint) + '</p>' +
      '<div class="thumbs">' +
      '<button class="thumb" data-act="tip" data-v="0"><span class="emoji" aria-hidden="true">👎</span>' + esc(t.no) + '</button>' +
      '<button class="thumb" data-act="tip" data-v="1"><span class="emoji" aria-hidden="true">👍</span>' + esc(t.yes) + '</button></div>' +
      '<button class="linkbtn" data-act="home">' + esc(t.cancel) + '</button></main>';
  }

  function stakeFor(c) {
    return { hit: DP.points(ui.tip, c, ui.tip, lvl()), miss: DP.points(ui.tip, c, !ui.tip, lvl()) };
  }
  function confLabel(c) { return lvl() === 'l' ? (c === 50 ? T().conf50 : c === 100 ? T().conf100 : ' ') : ' '; }
  function sliderPos(c) { const st = steps(); return st.indexOf(c) / (st.length - 1) * 100; }

  function viewConf() {
    const t = T();
    const c = 50;
    const s = stakeFor(c);
    let h = topbar() + '<main class="stage conf">' +
      '<p class="small-claim">' + esc(claimText(ui.claim, S.lang)) + '</p>' +
      '<p class="verdict">' + esc(ui.tip ? t.yes : t.no) + '.</p>' +
      '<p class="ask">' + esc(t.confTitle) + '</p>' +
      (lvl() === 'l' ? '<div class="pct"><span id="pct">' + c + '</span><small>%</small></div>'
        : '<div class="pct word"><span id="pct">' + esc(confWord(c)) + '</span></div>') +
      '<p class="lbl" id="lbl">' + esc(confLabel(c)) + '</p>' +
      '<input id="sl" class="slider" type="range" min="0" max="' + (steps().length - 1) + '" step="1" value="0" style="--p:0%" aria-label="' + esc(t.confTitle) + '"' + (ui.busy ? ' disabled' : '') + '>' +
      '<div class="stake"><div class="plus"><span>' + esc(t.rules_cols[1]) + '</span><b id="pHit">' + signed(s.hit) + '</b></div>' +
      '<div class="minus"><span>' + esc(t.rules_cols[2]) + '</span><b id="pMiss">' + signed(s.miss) + '</b></div></div>' +
      '<p class="small" style="margin-top:10px">' + esc(t.lv[lvl()] ? t.lv[lvl()].hint : t.conf_hint) + '</p>' +
      '<div class="spacer"></div>';
    if (ui.busy) h += '<p class="hint" style="margin-top:12px">' + esc(t.measuring) + '</p>';
    if (ui.error) h += '<div class="notice" style="margin-top:12px">' + esc(t.err) + '</div><button class="btn" data-act="retry">' + esc(t.retry) + '</button>';
    else h += '<button class="btn" data-act="measure"' + (ui.busy ? ' disabled' : '') + '>' + esc(t.measure) + '</button>';
    h += '<button class="linkbtn" data-act="home">' + esc(t.cancel) + '</button></main>';
    return h;
  }

  function viewResult() {
    const t = T();
    const r = ui.result;
    const hit = DP.isHit(r.tip, r.outcome);
    return topbar() + '<main class="stage">' +
      '<p class="small-claim">' + esc(claimText(r.claim, S.lang)) + '</p>' +
      '<p class="big-word">' + esc(hit ? t.hit : t.miss) + '</p>' +
      '<div class="points"><span id="pn" data-v="' + r.pts + '">' + signed(r.pts) + '</span><small>' + esc(t.pts_unit) + '</small></div>' +
      '<p class="said">' + esc(r.outcome ? t.truth_yes : t.truth_no) + ' ' + esc((r.level === 's' || r.level === 'm') ? fill(t.you_tipped_w, { tip: r.tip ? t.yes : t.no, conf: confWord(r.conf, r.level).toLowerCase() }) : fill(t.you_tipped, { tip: r.tip ? t.yes : t.no, conf: r.conf })) + '</p>' +
      '<div class="measure"><b>' + esc(t.measured) + ':</b> ' + esc(measuredText(r.claim, r.shown, S.lang)) +
      '<span class="small"><b>' + esc(t.rule) + ':</b> ' + esc(ruleText(r.claim, S.lang)) + '</span></div>' +
      '<div class="spacer"></div>' +
      (todayCount() < DAILY_LIMIT ? '<button class="btn" data-act="start">' + esc(t.next) + '</button>' : '') +
      '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></main>';
  }

  function viewLater() {
    const t = T();
    const r = ui.result;
    return topbar() + '<main class="stage">' +
      '<p class="small-claim">' + esc(claimText(r.claim, S.lang)) + '</p>' +
      '<p class="big-word" style="font-size:clamp(3rem,15vw,5rem)">' + esc(t.waiting) + '</p>' +
      '<div class="measure"><span class="small" style="margin:0"><b>' + esc(t.rule) + ':</b> ' + esc(ruleText(r.claim, S.lang)) + '<br>' +
      esc(fill(t.due, { d: DP.addDays(r.claim.due, 1) })) + '</span></div>' +
      '<div class="spacer"></div>' +
      (todayCount() < DAILY_LIMIT ? '<button class="btn" data-act="start">' + esc(t.next) + '</button>' : '') +
      '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></main>';
  }

  function countUp() {
    const el = document.getElementById('pn');
    if (!el) return;
    const v = Number(el.getAttribute('data-v'));
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, ((now || performance.now()) - t0) / 700);
      el.textContent = signed(Math.round(v * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step); else el.textContent = signed(v);
    })(t0);
  }

  function celebrate(hit) {
    try { if (navigator.vibrate) navigator.vibrate(hit ? 40 : [70, 50, 70]); } catch (e) { /* egal */ }
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const app = document.getElementById('app');
    if (!hit) { app.classList.add('shake'); setTimeout(function () { app.classList.remove('shake'); }, 500); return; }
    const cv = document.createElement('canvas');
    if (!cv.getContext) return;
    cv.className = 'confetti';
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    document.body.appendChild(cv);
    const cx = cv.getContext('2d');
    if (!cx) { cv.remove(); return; }
    const cols = ['#0d0b1f', '#ffffff', '#ffe45c', '#3a2cff', '#ff3b8d'];
    const ps = [];
    for (let i = 0; i < 90; i++) ps.push({ x: cv.width / 2, y: cv.height * 0.35, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, r: Math.random() * 6 + 4, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - .5) * .4 });
    const t0 = performance.now();
    (function frame(now) {
      const el = (now || performance.now()) - t0;
      cx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(function (p) { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += p.va; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore(); });
      if (el < 1700) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  function render() {
    const root = document.getElementById('app');
    document.documentElement.lang = S.lang;
    const views = { home: viewHome, tip: viewTip, conf: viewConf, result: viewResult, later: viewLater };
    const theme = themeFor();
    document.body.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_HEX[theme]);
    root.innerHTML = views[ui.view]();
    const t = T();
    document.getElementById('foot').innerHTML =
      '<p>' + esc(t.made_by) + ' <a href="https://dreierlabs.com/" rel="noopener"><b>Dreier Labs</b></a> · <a href="https://dreierlabs.com/impressum.html" rel="noopener">' + esc(t.imprint) + '</a></p>' +
      '<details><summary>' + esc(t.privacy) + '</summary><p>' + esc(t.privacy_text) + '</p></details>' +
      '<p class="credit">' + esc(t.data_credit) + '</p>';
    window.scrollTo(0, 0);
    if (ui.view === 'result') { countUp(); celebrate(DP.isHit(ui.result.tip, ui.result.outcome)); }
  }

  function chooseTip(yes) {
    ui.tip = yes; ui.view = 'conf'; ui.error = false; render();
  }

  /* ---------- Sichern und Laden ---------- */
  function exportJson() { return JSON.stringify({ app: 'daumenprobe', v: 1, tips: S.tips }); }
  function toCode(json) { return btoa(unescape(encodeURIComponent(json))); }
  function fromInput(text) {
    const s = text.trim();
    if (!s) throw new Error('leer');
    const json = s.charAt(0) === '{' ? s : decodeURIComponent(escape(atob(s)));
    return JSON.parse(json);
  }
  function importText(text) {
    try {
      const inc = fromInput(text);
      inc.tips = (inc.tips || []).filter(function (t) { return t && validClaim(t.claim); });
      const before = S.tips.length;
      S = DP.mergeState(S, inc);
      save(S);
      return { ok: true, n: S.tips.length - before };
    } catch (e) { return { ok: false }; }
  }
  function say(msg) {
    const el = document.getElementById('bmsg');
    if (el) el.textContent = msg;
  }

  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.getAttribute('data-act');
    const v = el.getAttribute('data-v');
    if (act === 'lang') { S.lang = v; save(S); render(); }
    else if (act === 'level') { if (STEPS[v]) { S.level = v; save(S); render(); } }
    else if (act === 'home') {
      if ((ui.view === 'tip' || ui.view === 'conf') && S.current && !ui.busy) {
        if (ui.error && S.draws && S.draws.length) S.draws.pop(); /* Messung ausgefallen: nicht anrechnen */
        S.current = null; save(S);
      }
      ui.view = 'home'; ui.error = false; ui.busy = false; ui.msg = ''; render();
    }
    else if (act === 'start') {
      if (todayCount() >= DAILY_LIMIT) return;
      ui.claim = newClaim(); ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip';
      S.current = { claim: ui.claim, ts: Date.now() };
      S.draws = (S.draws || []).concat(Date.now());
      save(S); render();
    }
    else if (act === 'tip') { chooseTip(v === '1'); }
    else if (act === 'measure') {
      if (ui.busy) return;
      const sl = document.getElementById('sl');
      ui.conf = sl ? steps()[Number(sl.value)] : 50;
      if (isLater(ui.claim)) submitLater(); else submitInstant();
    }
    else if (act === 'retry') { submitInstant(); }
    else if (act === 'resolve') { if (!ui.busy) resolveLater(el.getAttribute('data-id')); }
    else if (act === 'export-file') {
      const blob = new Blob([exportJson()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'daumenprobe-' + DP.dayKey() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      S.lastExport = Date.now(); save(S);
    }
    else if (act === 'export-code') {
      const code = toCode(exportJson());
      S.lastExport = Date.now(); save(S);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { say(T().copied); }, function () { document.getElementById('imp').value = code; });
      } else { document.getElementById('imp').value = code; }
    }
    else if (act === 'import-text') {
      const r = importText(document.getElementById('imp').value);
      if (r.ok) { render(); say(fill(T().import_ok, { n: r.n })); } else say(T().import_bad);
    }
    else if (act === 'import-file') {
      const f = document.getElementById('impfile');
      f.onchange = function () {
        const file = f.files && f.files[0];
        if (!file) return;
        file.text().then(function (txt) {
          const r = importText(txt);
          if (r.ok) { render(); say(fill(T().import_ok, { n: r.n })); } else say(T().import_bad);
        });
      };
      f.click();
    }
  });

  /* Schieber: zeigt live, was ein Treffer und ein Daneben jetzt wert sind. */
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'sl') return;
    const c = steps()[Number(e.target.value)];
    const s = stakeFor(c);
    document.getElementById('pct').textContent = lvl() === 'l' ? c : confWord(c);
    document.getElementById('lbl').textContent = confLabel(c);
    document.getElementById('pHit').textContent = signed(s.hit);
    document.getElementById('pMiss').textContent = signed(s.miss);
    e.target.style.setProperty('--p', sliderPos(c) + '%');
  });

  /* Wischen: rechts = stimmt, links = stimmt nicht. */
  let drag = null;
  function applyDrag(el, dx) {
    el.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 18) + 'deg)';
    const k = Math.min(1, Math.abs(dx) / 110);
    el.querySelector('.tint.yes').style.opacity = dx > 0 ? k * 0.85 : 0;
    el.querySelector('.tint.no').style.opacity = dx < 0 ? k * 0.85 : 0;
    el.querySelector('.stamp.yes').style.opacity = dx > 0 ? k : 0;
    el.querySelector('.stamp.no').style.opacity = dx < 0 ? k : 0;
  }
  document.addEventListener('pointerdown', function (e) {
    const el = e.target.closest && e.target.closest('.swipe');
    if (!el || ui.view !== 'tip') return;
    drag = { el: el, x0: e.clientX, dx: 0, id: e.pointerId };
    el.classList.remove('back');
    el.classList.add('dragging');
    if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignorieren */ } }
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x0;
    applyDrag(drag.el, drag.dx);
  });
  function endDrag() {
    if (!drag) return;
    const d = drag; drag = null;
    d.el.classList.remove('dragging');
    if (Math.abs(d.dx) > 90) {
      const yes = d.dx > 0;
      d.el.classList.add('back');
      d.el.style.transform = 'translateX(' + (yes ? 1 : -1) * window.innerWidth + 'px) rotate(' + (yes ? 24 : -24) + 'deg)';
      setTimeout(function () { chooseTip(yes); }, 200);
    } else {
      d.el.classList.add('back');
      applyDrag(d.el, 0);
    }
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener('keydown', function (e) {
    if (ui.view !== 'tip') return;
    if (e.key === 'ArrowRight') chooseTip(true);
    else if (e.key === 'ArrowLeft') chooseTip(false);
  });

  if (S.current && validClaim(S.current.claim) && DP.dayKey(new Date(S.current.ts)) === DP.dayKey()) {
    ui.claim = S.current.claim; ui.view = 'tip';
  } else if (S.current) { S.current = null; save(S); }

  render();
})();
