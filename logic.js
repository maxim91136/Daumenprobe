/* Daumenprobe: reine Spiellogik ohne Browser-Abhängigkeit (testbar mit Node). */
(function (root) {
  'use strict';
  const L = {};

  /* Wahrscheinlichkeit, die der Tipp auf „stimmt" legt. conf = Sicherheit in Prozent (50 bis 100). */
  L.probYes = function (tip, conf) {
    return tip ? conf / 100 : 1 - conf / 100;
  };

  /* Spielpunkte (nie Geld), streng und ehrlich:
     Treffer: +5 (geraten, 50 %) bis +10 (ganz sicher, 100 %).
     Daneben: -5 (geraten) bis -20 (ganz sicher).
     Reines Münzwerfen bringt im Schnitt genau 0. Wer sicherer tippt, kann mehr gewinnen und mehr
     verlieren; wer seine Sicherheit ehrlich einschätzt, steht auf Dauer am besten da (Brier-Regel).
     Aufbau: 5 * (1 - 4 * (p - o)^2) plus 5 Punkte bei Treffer, minus 5 bei Daneben. Der Treffer-Anteil
     (+5/-5) hängt nicht von der Sicherheit ab, ändert also nicht, welche Sicherheit sich lohnt. */
  /* level: 's' (klein): Daneben kostet nichts. 'm' (mittel): Daneben kostet höchstens 10. 'l' (groß, Standard): wie oben. */
  L.points = function (tip, conf, outcome, level) {
    const p = L.probYes(tip, conf);
    const o = outcome ? 1 : 0;
    const base = 5 * (1 - 4 * (p - o) * (p - o));
    const isHit = L.isHit(tip, outcome);
    const v = Math.round(base + (isHit ? 5 : -5));
    if (!isHit && level === 's') return 0;
    if (!isHit && level === 'm') return Math.max(v, -10);
    return v;
  };

  /* Beleuchteter Anteil des Mondes (0 bis 1), gerechnet aus dem mittleren Mondalter. */
  L.moonIllum = function (ms) {
    const jd = ms / 86400000 + 2440587.5;
    const age = (((jd - 2451550.1) % 29.530588853) + 29.530588853) % 29.530588853;
    return (1 - Math.cos(2 * Math.PI * age / 29.530588853)) / 2;
  };
  const SECTORS = { N: [315, 45], E: [45, 135], S: [135, 225], W: [225, 315] };
  L.inSector = function (deg, key) {
    const s = SECTORS[key];
    const d = ((deg % 360) + 360) % 360;
    return s[0] > s[1] ? (d >= s[0] || d < s[1]) : (d >= s[0] && d < s[1]);
  };

  L.isHit = function (tip, outcome) {
    return Boolean(tip) === Boolean(outcome);
  };

  const BINS = [[50, 59], [60, 69], [70, 79], [80, 89], [90, 100]];
  L.BINS = BINS;

  /* results: Liste aufgelöster Tipps mit {tip, conf, outcome, pts}. */
  L.stats = function (results) {
    const done = results.filter(function (r) { return typeof r.outcome === 'boolean'; });
    const total = done.length;
    const hits = done.filter(function (r) { return L.isHit(r.tip, r.outcome); }).length;
    const pts = done.reduce(function (s, r) { return s + (r.pts || 0); }, 0);
    const buckets = BINS.map(function (b) {
      const inBin = done.filter(function (r) { return r.conf >= b[0] && r.conf <= b[1]; });
      const n = inBin.length;
      const avgConf = n ? inBin.reduce(function (s, r) { return s + r.conf; }, 0) / n / 100 : null;
      const hitRate = n ? inBin.filter(function (r) { return L.isHit(r.tip, r.outcome); }).length / n : null;
      return { range: b, n: n, avgConf: avgConf, hitRate: hitRate };
    });
    let calibration = null;
    if (total >= 5) {
      let weighted = 0;
      buckets.forEach(function (b) {
        if (b.n) weighted += b.n * Math.abs(b.avgConf - b.hitRate);
      });
      const miscal = weighted / total;
      calibration = Math.max(0, Math.min(100, Math.round(100 * (1 - 2 * miscal))));
    }
    return {
      total: total,
      hits: hits,
      hitRate: total ? hits / total : null,
      pts: pts,
      buckets: buckets,
      calibration: calibration
    };
  };

  /* Lokales Datum als JJJJ-MM-TT. */
  L.dayKey = function (d) {
    const dt = d || new Date();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return dt.getFullYear() + '-' + m + '-' + day;
  };

  L.addDays = function (key, n) {
    const p = key.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + n);
    return L.dayKey(d);
  };

  /* Messregeln: nehmen Messdaten und geben {outcome, shown} zurück oder null, wenn Daten fehlen. */
  L.measure = {
    temp: function (claim, data) {
      const t = data && data.current && data.current.temperature_2m;
      if (typeof t !== 'number') return null;
      return { outcome: t > claim.T, shown: t };
    },
    isday: function (claim, data) {
      const v = data && data.current && data.current.is_day;
      if (typeof v !== 'number') return null;
      return { outcome: v === 1, shown: v };
    },
    rain: function (claim, data) {
      const v = data && data.current && data.current.precipitation;
      if (typeof v !== 'number') return null;
      return { outcome: v > 0, shown: v };
    },
    wind: function (claim, data) {
      const v = data && data.current && data.current.wind_speed_10m;
      if (typeof v !== 'number') return null;
      return { outcome: v > claim.W, shown: v };
    },
    iss: function (claim, data) {
      const v = data && data.latitude;
      if (typeof v !== 'number') return null;
      return { outcome: v > 0, shown: v };
    },
    quake: function (claim, data) {
      const f = data && data.features;
      if (!Array.isArray(f)) return null;
      return { outcome: f.length > claim.N, shown: f.length };
    },
    quakemax: function (claim, data) {
      const f = data && data.features;
      if (!Array.isArray(f)) return null;
      let mx = 0;
      f.forEach(function (x) { const m = x && x.properties && x.properties.mag; if (typeof m === 'number' && m > mx) mx = m; });
      if (!mx) return null;
      return { outcome: mx >= claim.M, shown: mx };
    },
    aqi: function (claim, data) {
      const v = data && data.current && data.current.european_aqi;
      if (typeof v !== 'number') return null;
      return { outcome: v < claim.A, shown: v };
    },
    winddir: function (claim, data) {
      const v = data && data.current && data.current.wind_direction_10m;
      if (typeof v !== 'number') return null;
      return { outcome: L.inSector(v, claim.D), shown: v };
    },
    daylen: function (claim, data) {
      const a = data && data[0] && data[0].daily && data[0].daily.daylight_duration && data[0].daily.daylight_duration[0];
      const b = data && data[1] && data[1].daily && data[1].daily.daylight_duration && data[1].daily.daylight_duration[0];
      if (typeof a !== 'number' || typeof b !== 'number') return null;
      return { outcome: a > b, shown: { a: a / 3600, b: b / 3600 } };
    },
    moon: function (claim, data) {
      const now = data && data.now;
      if (typeof now !== 'number') return null;
      const f = L.moonIllum(now);
      return { outcome: f > 0.5, shown: Math.round(f * 100) };
    },
    tomorrow: function (claim, data) {
      const dl = data && data.daily;
      if (!dl || !Array.isArray(dl.time) || !Array.isArray(dl.temperature_2m_max)) return null;
      const i0 = dl.time.indexOf(claim.created);
      const i1 = dl.time.indexOf(claim.due);
      const a = dl.temperature_2m_max[i0];
      const b = dl.temperature_2m_max[i1];
      if (i0 < 0 || i1 < 0 || typeof a !== 'number' || typeof b !== 'number') return null;
      return { outcome: b > a, shown: { today: a, tomorrow: b } };
    }
  };

  /* Sicherungsdatei: prüft und führt Spielstände zusammen (ohne Doppelte). */
  L.mergeState = function (current, incoming) {
    if (!incoming || typeof incoming !== 'object' || !Array.isArray(incoming.tips)) {
      throw new Error('Ungültige Sicherung');
    }
    const byId = {};
    current.tips.forEach(function (t) { byId[t.id] = t; });
    incoming.tips.forEach(function (t) {
      if (!t || typeof t.id !== 'string' || typeof t.tip !== 'boolean' || typeof t.conf !== 'number') return;
      const known = byId[t.id];
      if (!known || (!known.resolved && t.resolved)) byId[t.id] = t;
    });
    const tips = Object.keys(byId).map(function (k) { return byId[k]; })
      .sort(function (a, b) { return a.ts - b.ts; });
    return Object.assign({}, current, { tips: tips });
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = L;
  else root.DP = L;
})(typeof window !== 'undefined' ? window : this);
