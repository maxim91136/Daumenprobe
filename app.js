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
      data_credit: 'Wetterdaten: Open-Meteo.com (CC BY 4.0). ISS-Position: wheretheiss.at. Nur Spielpunkte, nie Geld.',
      measure_msg: {
        temp: 'In {city} sind es {v} °C.',
        isday: 'In {city} ist es gerade {v}.',
        rain: 'In {city} fallen gerade {v} mm Regen pro Stunde.',
        wind: 'In {city} weht der Wind mit {v} km/h.',
        iss: 'Die ISS ist bei {v}° Breite.',
        tomorrow: 'Höchstwert {a} °C am Tag des Tipps, {b} °C am Tag danach.'
      },
      day: 'Tag', night: 'Nacht',
      claims: {
        temp: 'In {city} sind es gerade mehr als {T} °C.',
        isday: 'In {city} ist gerade Tag.',
        rain: 'In {city} regnet es gerade.',
        wind: 'In {city} weht gerade mehr als {W} km/h Wind.',
        iss: 'Die ISS fliegt gerade nördlich des Äquators.',
        tomorrow: 'Morgen wird es in {city} wärmer als heute (Tageshöchstwert).'
      },
      rules: {
        temp: 'Stimmt, wenn die gemessene Temperatur über {T} °C liegt (Open-Meteo, aktueller Wert).',
        isday: 'Stimmt, wenn Open-Meteo für den Ort jetzt Tageslicht meldet.',
        rain: 'Stimmt, wenn Open-Meteo jetzt Niederschlag über 0 mm meldet.',
        wind: 'Stimmt, wenn die gemessene Windgeschwindigkeit über {W} km/h liegt (Open-Meteo, 10 m Höhe).',
        iss: 'Stimmt, wenn die gemeldete Breite der ISS größer als 0° ist (wheretheiss.at).',
        tomorrow: 'Stimmt, wenn der Tageshöchstwert am Folgetag höher ist als am Tag des Tipps (Open-Meteo).'
      }
    },
    en: {
      title: 'Daumenprobe',
      tagline: 'Guess first, then measure.',
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
      data_credit: 'Weather data: Open-Meteo.com (CC BY 4.0). ISS position: wheretheiss.at. Play points only, never money.',
      measure_msg: {
        temp: 'It is {v} °C in {city}.',
        isday: 'In {city} it is {v} right now.',
        rain: 'In {city} {v} mm of rain per hour are falling.',
        wind: 'In {city} the wind blows at {v} km/h.',
        iss: 'The ISS is at {v}° latitude.',
        tomorrow: 'High of {a} °C on the day of your tip, {b} °C the day after.'
      },
      day: 'daytime', night: 'night',
      claims: {
        temp: 'It is warmer than {T} °C in {city} right now.',
        isday: 'It is daytime in {city} right now.',
        rain: 'It is raining in {city} right now.',
        wind: 'The wind in {city} is faster than {W} km/h right now.',
        iss: 'The ISS is north of the equator right now.',
        tomorrow: 'Tomorrow will be warmer than today in {city} (daily high).'
      },
      rules: {
        temp: 'True if the measured temperature is above {T} °C (Open-Meteo, current value).',
        isday: 'True if Open-Meteo reports daylight for the place right now.',
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
    tomorrow: function () {
      const today = DP.dayKey();
      const eu = CITIES.filter(function (c) { return c.eu; });
      return { tpl: 'tomorrow', city: pick(eu).id, created: today, due: DP.addDays(today, 1) };
    }
  };
  const WEIGHTS = ['temp', 'temp', 'isday', 'isday', 'rain', 'wind', 'iss', 'tomorrow'];

  function newClaim() { return MAKERS[pick(WEIGHTS)](); }
  function isLater(claim) { return claim.tpl === 'tomorrow'; }
  function validClaim(c) {
    if (!c || !MAKERS[c.tpl]) return false;
    if (c.tpl !== 'iss' && !cityById(c.city)) return false;
    if (c.tpl === 'tomorrow' && !(/^\d{4}-\d{2}-\d{2}$/.test(c.created) && /^\d{4}-\d{2}-\d{2}$/.test(c.due))) return false;
    return true;
  }

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] === undefined ? m : vars[k]; });
  }
  function claimVars(claim, lang) {
    const c = claim.city ? cityById(claim.city) : null;
    return { city: c ? c[lang] : '', T: claim.T, W: claim.W };
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
    const c = cityById(claim.city);
    let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&timezone=auto';
    if (claim.tpl === 'tomorrow') url += '&daily=temperature_2m_max&past_days=5&forecast_days=2';
    else url += '&current=temperature_2m,is_day,precipitation,wind_speed_10m';
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
  function blank() { return { v: 1, lang: null, tips: [], lastExport: null, draws: [], current: null }; }
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
    rec.pts = DP.points(rec.tip, rec.conf, m.outcome);
    rec.measuredAt = Date.now();
  }

  function submitInstant() {
    ui.busy = true; ui.error = false; render();
    measure(ui.claim).then(function (m) {
      const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, ts: Date.now(), resolved: false };
      finishTip(rec, m);
      S.tips.push(rec); S.current = null; save(S);
      ui.result = rec; ui.view = 'result'; ui.busy = false; render();
    }).catch(function () {
      ui.busy = false; ui.error = true; render();
    });
  }

  function submitLater() {
    const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, ts: Date.now(), resolved: false };
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
  function header() {
    return '<header class="top"><h1>' + esc(T().title) + '</h1><div class="tools">' +
      '<button class="chip" data-act="lang" data-v="de" aria-pressed="' + (S.lang === 'de') + '">DE</button>' +
      '<button class="chip" data-act="lang" data-v="en" aria-pressed="' + (S.lang === 'en') + '">EN</button>' +
      '</div></header>';
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

    h += '<section class="card"><p class="kicker">' + esc(t.tagline) + '</p>';
    h += '<div class="stats" style="margin-top:12px">' +
      '<div class="stat"><b>' + (st.total ? Math.round(st.hitRate * 100) + ' %' : '–') + '</b><span>' + esc(t.stat_hit) + '</span></div>' +
      '<div class="stat"><b>' + st.pts + '</b><span>' + esc(t.stat_pts) + '</span></div>' +
      '<div class="stat"><b>' + (st.calibration === null ? '–' : st.calibration + ' %') + '</b><span>' + esc(st.calibration === null ? t.stat_cal + ' (' + t.cal_need + ')' : t.stat_cal) + '</span></div>' +
      '</div>';
    if (left > 0) {
      h += '<button class="btn" data-act="start">' + esc(t.go) + ' · ' + esc(fill(t.left, { n: left })) + '</button>';
    } else {
      h += '<p class="small" style="margin:14px 0 0">' + esc(t.goDone) + '</p>';
    }
    h += '</section>';

    if (open.length) {
      h += '<section class="card"><h2>' + esc(t.open_title) + '</h2>';
      open.forEach(function (o) {
        const ready = today > o.claim.due;
        h += '<div class="row"><div>' + esc(claimText(o.claim, S.lang)) +
          '<div class="small">' + esc(o.tip ? t.yes : t.no) + ', ' + o.conf + ' %</div></div><div>' +
          (ready ? '<button class="chip" style="color:var(--ink);border-color:var(--ink)" data-act="resolve" data-id="' + esc(o.id) + '"' + (ui.busy ? ' disabled' : '') + '>' + esc(t.resolve) + '</button>'
            : '<span class="small">' + esc(fill(t.due, { d: DP.addDays(o.claim.due, 1) })) + '</span>') +
          '</div></div>';
      });
      if (ui.msg) h += '<p class="small">' + esc(ui.msg) + '</p>';
      h += '</section>';
    }

    if (st.total >= 5) {
      h += '<section class="card"><h2>' + esc(t.cal_title) + '</h2><div class="bars">';
      st.buckets.forEach(function (b) {
        if (!b.n) return;
        h += '<div class="bar"><span>' + b.range[0] + '–' + b.range[1] + '</span><div class="track"><div class="fill" style="width:' +
          Math.round(b.hitRate * 100) + '%"></div><div class="mark" style="left:calc(' + Math.round(b.avgConf * 100) + '% - 1px)"></div></div><span>' +
          Math.round(b.hitRate * 100) + '%</span></div>';
      });
      h += '</div><p class="small">' + esc(t.cal_help) + '</p></section>';
    }

    h += '<section class="card"><h2>' + esc(t.history) + '</h2>';
    const recent = resolvedTips().slice(-8).reverse();
    if (!recent.length) h += '<p class="small">' + esc(t.none) + '</p>';
    recent.forEach(function (r) {
      h += '<div class="row"><span>' + esc(claimText(r.claim, S.lang)) + '</span><span class="' + (r.pts >= 0 ? 'pts-pos' : 'pts-neg') + '">' + (r.pts > 0 ? '+' : '') + r.pts + '</span></div>';
    });
    h += '</section>';

    h += '<section class="card"><h2>' + esc(t.backup) + '</h2><p class="small">' + esc(t.backup_help) + '</p>' +
      '<button class="btn ghost" data-act="export-file">' + esc(t.export_file) + '</button>' +
      '<button class="btn ghost" data-act="export-code">' + esc(t.export_code) + '</button>' +
      '<h2 style="margin-top:16px">' + esc(t.import_title) + '</h2>' +
      '<textarea id="imp" placeholder="' + esc(t.import_ph) + '"></textarea>' +
      '<button class="btn ghost" data-act="import-text">' + esc(t.import_btn) + '</button>' +
      '<button class="btn ghost" data-act="import-file">' + esc(t.import_file) + '</button>' +
      '<input id="impfile" type="file" accept="application/json,.json,.txt" hidden>' +
      '<p class="small" id="bmsg"></p></section>';
    return h;
  }

  function viewTip() {
    const t = T();
    return header() + '<section class="card"><p class="kicker">' + esc(t.claimLead) + '</p>' +
      '<p class="claim">' + esc(claimText(ui.claim, S.lang)) + '</p>' +
      '<div class="thumbs">' +
      '<button class="thumb yes" data-act="tip" data-v="1"><span class="emoji" aria-hidden="true">👍</span>' + esc(t.yes) + '</button>' +
      '<button class="thumb no" data-act="tip" data-v="0"><span class="emoji" aria-hidden="true">👎</span>' + esc(t.no) + '</button>' +
      '</div><button class="btn ghost" data-act="home">' + esc(t.cancel) + '</button></section>';
  }

  function viewConf() {
    const t = T();
    const levels = [50, 60, 70, 80, 90, 100];
    let h = header() + '<section class="card"><p class="kicker">' + esc(claimText(ui.claim, S.lang)) + '</p>' +
      '<p class="claim">' + esc(t.confTitle) + '</p><div class="conf-grid">';
    levels.forEach(function (c) {
      h += '<button class="conf" data-act="conf" data-v="' + c + '"' + (ui.busy ? ' disabled' : '') + '>' + c + ' %' +
        (c === 50 ? '<small>' + esc(t.conf50) + '</small>' : c === 100 ? '<small>' + esc(t.conf100) + '</small>' : '<small>&nbsp;</small>') + '</button>';
    });
    h += '</div>';
    if (ui.busy) h += '<p class="small" style="margin-top:12px">' + esc(t.measuring) + '</p>';
    if (ui.error) h += '<p class="notice" style="margin-top:12px">' + esc(t.err) + '</p><button class="btn" data-act="retry">' + esc(t.retry) + '</button>';
    h += '<button class="btn ghost" data-act="home">' + esc(t.cancel) + '</button></section>';
    return h;
  }

  function viewResult() {
    const t = T();
    const r = ui.result;
    const hit = DP.isHit(r.tip, r.outcome);
    return header() + '<section class="card"><p class="kicker">' + esc(claimText(r.claim, S.lang)) + '</p>' +
      '<p class="result-big ' + (hit ? 'good' : 'bad') + '">' + esc(hit ? t.hit : t.miss) + '</p>' +
      '<p class="claim" style="font-size:1.1rem">' + esc(r.outcome ? t.truth_yes : t.truth_no) + ' ' +
      esc(fill(t.you_tipped, { tip: r.tip ? t.yes : t.no, conf: r.conf })) + '</p>' +
      '<p class="result-big ' + (r.pts >= 0 ? 'good' : 'bad') + '" style="font-size:1.5rem">' + esc(fill(t.pts, { n: (r.pts > 0 ? '+' : '') + r.pts })) + '</p>' +
      '<div class="measure"><b>' + esc(t.measured) + ':</b> ' + esc(measuredText(r.claim, r.shown, S.lang)) + '<br><span class="small"><b>' + esc(t.rule) + ':</b> ' + esc(ruleText(r.claim, S.lang)) + '</span></div>' +
      (todayCount() < DAILY_LIMIT ? '<button class="btn" data-act="start">' + esc(t.next) + '</button>' : '') +
      '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></section>';
  }

  function viewLater() {
    const t = T();
    const r = ui.result;
    return header() + '<section class="card"><p class="kicker">' + esc(claimText(r.claim, S.lang)) + '</p>' +
      '<p class="result-big">' + esc(t.waiting) + '</p>' +
      '<div class="measure"><span class="small"><b>' + esc(t.rule) + ':</b> ' + esc(ruleText(r.claim, S.lang)) + '<br>' +
      esc(fill(t.due, { d: DP.addDays(r.claim.due, 1) })) + '</span></div>' +
      (todayCount() < DAILY_LIMIT ? '<button class="btn" data-act="start">' + esc(t.next) + '</button>' : '') +
      '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></section>';
  }

  function render() {
    const root = document.getElementById('app');
    document.documentElement.lang = S.lang;
    const views = { home: viewHome, tip: viewTip, conf: viewConf, result: viewResult, later: viewLater };
    root.innerHTML = views[ui.view]();
    document.getElementById('foot').textContent = T().data_credit;
    window.scrollTo(0, 0);
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
    else if (act === 'tip') { ui.tip = v === '1'; ui.view = 'conf'; render(); }
    else if (act === 'conf') {
      if (ui.busy) return;
      ui.conf = Number(v);
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

  if (S.current && validClaim(S.current.claim) && DP.dayKey(new Date(S.current.ts)) === DP.dayKey()) {
    ui.claim = S.current.claim; ui.view = 'tip';
  } else if (S.current) { S.current = null; save(S); }

  render();
})();
