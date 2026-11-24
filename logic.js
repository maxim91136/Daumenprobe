/* Daumenprobe: reine Spiellogik ohne Browser-Abhängigkeit (testbar mit Node). */
(function (root) {
  'use strict';
  const L = {};

  /* Wahrscheinlichkeit, die der Tipp auf „stimmt" legt. conf = Sicherheit in Prozent (50 bis 100). */
  L.probYes = function (tip, conf) {
    return tip ? conf / 100 : 1 - conf / 100;
  };

  /* Spielpunkte (nie Geld), streng und ehrlich. Pro Stufe der Sicherheit gibt es klar abgestufte Punkte:
     Sicherheit  50  60  70  80  90  100
     Treffer     +5  +6  +7  +8  +9  +10
     Daneben     -5  -6  -8  -11 -17 -30
     Treffer wachsen gleichmäßig, die Strafe wächst von Stufe zu Stufe schneller (logarithmische Regel,
     bis 90 % im Kern ehrlich, bei 100 % gedeckelt). Münzwerfen bringt im Schnitt 0 oder weniger. Wer seine
     Sicherheit ehrlich einschätzt, steht auf Dauer am besten da. Zwischenwerte (75 %) werden gerade verbunden.
     level: Schwierigkeit zählt. 'l' (schwer, Standard) volle Punkte. 'm' (mittel) Treffer drei Viertel, Daneben sechs Zehntel (so lohnt sich ehrliches Melden auch hier).
     's' (leicht) die Hälfte, Daneben kostet nichts. */
  const HIT = { 50: 5, 60: 6, 70: 7, 80: 8, 90: 9, 100: 10 };
  const MISS = { 50: -5, 60: -6, 70: -8, 80: -11, 90: -17, 100: -30 };
  function tab(T, conf) {
    const c = Math.min(100, Math.max(50, conf));
    const lo = Math.floor(c / 10) * 10;
    if (lo >= 100) return T[100];
    return T[lo] + (T[lo + 10] - T[lo]) * (c - lo) / 10;
  }
  L.points = function (tip, conf, outcome, level) {
    const isHit = L.isHit(tip, outcome);
    const raw = Math.round(isHit ? tab(HIT, conf) : tab(MISS, conf));
    if (level === 's') return isHit ? Math.round(raw * 0.5) : 0;
    if (level === 'm') return isHit ? Math.round(raw * 0.75) : Math.round(raw * 0.6);
    return raw;
  };

  /* Höchststand der Punkte (nie unter 0): Rang richtet sich danach, damit man beim Abrutschen nichts verliert. */
  L.peak = function (tips) {
    const list = (tips || []).filter(function (t) { return t && t.resolved; }).slice().sort(function (a, b) { return (a.measuredAt || a.ts || 0) - (b.measuredAt || b.ts || 0); });
    let sum = 0, mx = 0;
    list.forEach(function (t) { sum += t.pts || 0; if (sum > mx) mx = sum; });
    if (list.length >= 10 && mx < 10) mx = 10; /* wer 10 Tipps hinter sich hat, ist kein Neuling mehr */
    return mx;
  };

  /* Beleuchteter Anteil des Mondes (0 bis 1), gerechnet aus dem mittleren Mondalter. */
  L.moonIllum = function (ms) {
    const jd = ms / 86400000 + 2440587.5;
    const age = (((jd - 2451550.1) % 29.530588853) + 29.530588853) % 29.530588853;
    return (1 - Math.cos(2 * Math.PI * age / 29.530588853)) / 2;
  };
  /* Höhe der Sonne über dem Horizont in Grad (Näherung nach NOAA, auf etwa ein Grad genau). */
  L.sunElevation = function (lat, lon, ms) {
    const rad = Math.PI / 180;
    const n = ms / 86400000 + 2440587.5 - 2451545.0;
    const L0 = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * rad;
    const lam = (L0 + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
    const eps = (23.439 - 0.0000004 * n) * rad;
    const decl = Math.asin(Math.sin(eps) * Math.sin(lam));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)) / rad;
    const gmst = (280.46061837 + 360.98564736629 * n) % 360;
    const ha = (gmst + lon - ra) * rad;
    const la = lat * rad;
    return Math.asin(Math.sin(la) * Math.sin(decl) + Math.cos(la) * Math.cos(decl) * Math.cos(ha)) / rad;
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
    pressure: function (claim, data) {
      const v = data && data.current && data.current.pressure_msl;
      if (typeof v !== 'number') return null;
      return { outcome: v > claim.P, shown: v };
    },
    humidity: function (claim, data) {
      const v = data && data.current && data.current.relative_humidity_2m;
      if (typeof v !== 'number') return null;
      return { outcome: v > claim.H, shown: v };
    },
    cloud: function (claim, data) {
      const v = data && data.current && data.current.cloud_cover;
      if (typeof v !== 'number') return null;
      return { outcome: v > 50, shown: v };
    },
    warmer: function (claim, data) {
      const a = data && data[0] && data[0].current && data[0].current.temperature_2m;
      const b = data && data[1] && data[1].current && data[1].current.temperature_2m;
      if (typeof a !== 'number' || typeof b !== 'number') return null;
      return { outcome: a > b, shown: { a: a, b: b } };
    },
    sunhigh: function (claim, data) {
      if (!data || typeof data.now !== 'number' || !data.a || !data.b) return null;
      const a = L.sunElevation(data.a.lat, data.a.lon, data.now);
      const b = L.sunElevation(data.b.lat, data.b.lon, data.now);
      return { outcome: a > b, shown: { a: a, b: b } };
    },
    clock: function (claim, data) {
      if (!data || typeof data.hour !== 'number' || typeof data.minute !== 'number') return null;
      const mins = data.hour * 60 + data.minute;
      return { outcome: mins > claim.H * 60, shown: mins };
    },
    aurora: function (claim, data) {
      /* NOAA SWPC: altes Format = erste Zeile Spaltennamen, neues Format = Liste von Objekten mit time_tag. Beides lesen. */
      if (!Array.isArray(data) || data.length < 1) return null;
      let rows = [];
      if (Array.isArray(data[0])) {
        const head = data[0].map(function (h) { return String(h); });
        const ki = head.findIndex(function (h) { return /^kp/i.test(h) && !/frac/i.test(h); });
        const ti = head.findIndex(function (h) { return /time/i.test(h); });
        if (ki < 0) return null;
        rows = data.slice(1).map(function (r) { return { t: ti >= 0 ? String(r[ti]) : '', v: Number(r[ki]) }; });
      } else {
        rows = data.map(function (o) {
          if (!o || typeof o !== 'object') return { t: '', v: NaN };
          const k = Object.keys(o).find(function (x) { return /^kp/i.test(x) && !/frac/i.test(x); });
          return { t: String(o.time_tag || ''), v: k === undefined ? NaN : Number(o[k]) };
        });
      }
      rows = rows.filter(function (r) { return isFinite(r.v); });
      if (!rows.length) return null;
      rows.sort(function (a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; });
      const kp = rows[rows.length - 1].v;
      return { outcome: kp > claim.K, shown: kp };
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
