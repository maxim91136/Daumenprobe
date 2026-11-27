'use strict';
// Tests der reinen Spiellogik (logic.js). Start: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../logic.js');

test('probYes: Tipp "stimmt" nimmt die Sicherheit, Tipp "stimmt nicht" das Gegenstück', () => {
  assert.equal(L.probYes(true, 80), 0.8);
  assert.ok(Math.abs(L.probYes(false, 80) - 0.2) < 1e-9);
});

test('isHit vergleicht Tipp und Ergebnis als Wahrheitswerte', () => {
  assert.equal(L.isHit(true, true), true);
  assert.equal(L.isHit(false, false), true);
  assert.equal(L.isHit(true, false), false);
});

test('points: Tabellenwerte an den Stufen', () => {
  assert.equal(L.points(true, 50, true), 5);
  assert.equal(L.points(true, 100, true), 10);
  assert.equal(L.points(true, 100, false), -30);
  assert.equal(L.points(true, 90, false), -17);
});

test('points: Zwischenwerte werden gerade verbunden, Grenzen gedeckelt', () => {
  assert.equal(L.points(true, 75, true), 8); // zwischen 7 und 8
  assert.equal(L.points(true, 30, true), 5); // unter 50 zählt als 50
  assert.equal(L.points(true, 150, true), 10); // über 100 zählt als 100
});

test('points: Schwierigkeit leicht und mittel', () => {
  assert.equal(L.points(true, 100, true, 's'), 5);
  assert.equal(L.points(true, 100, false, 's'), 0);
  assert.equal(L.points(true, 100, true, 'm'), 8);
  assert.equal(L.points(true, 100, false, 'm'), -18);
});

test('points: Münzwerfen (50 %) bringt im Schnitt nicht mehr als 0', () => {
  assert.ok(L.points(true, 50, true) + L.points(true, 50, false) <= 0);
});

test('peak: Höchststand, nie unter 0, nur aufgelöste Tipps', () => {
  assert.equal(L.peak([]), 0);
  assert.equal(L.peak(null), 0);
  const tips = [
    { resolved: true, pts: 5, ts: 1 }, { resolved: true, pts: 5, ts: 2 },
    { resolved: true, pts: -8, ts: 3 }, { resolved: false, pts: 99, ts: 4 },
  ];
  assert.equal(L.peak(tips), 10);
  assert.equal(L.peak([{ resolved: true, pts: -5, ts: 1 }]), 0);
});

test('peak: wer zehn Tipps hinter sich hat, steht mindestens auf 10', () => {
  const tips = Array.from({ length: 10 }, (_, i) => ({ resolved: true, pts: 0, ts: i }));
  assert.equal(L.peak(tips), 10);
});

test('inSector: Himmelsrichtungen inklusive Nord über 0 Grad', () => {
  assert.equal(L.inSector(0, 'N'), true);
  assert.equal(L.inSector(350, 'N'), true);
  assert.equal(L.inSector(44, 'N'), true);
  assert.equal(L.inSector(45, 'N'), false);
  assert.equal(L.inSector(90, 'E'), true);
  assert.equal(L.inSector(180, 'S'), true);
  assert.equal(L.inSector(270, 'W'), true);
  assert.equal(L.inSector(-90, 'W'), true);
});

test('stats: leere Liste und Auswertung', () => {
  const leer = L.stats([]);
  assert.equal(leer.total, 0);
  assert.equal(leer.hitRate, null);
  assert.equal(leer.calibration, null);
  const r = L.stats([
    { tip: true, conf: 80, outcome: true, pts: 8 },
    { tip: true, conf: 80, outcome: false, pts: -11 },
    { tip: false, conf: 60, outcome: false, pts: 6 },
    { tip: true, conf: 90, outcome: 'offen', pts: 0 }, // nicht aufgelöst, zählt nicht
  ]);
  assert.equal(r.total, 3);
  assert.equal(r.hits, 2);
  assert.equal(r.pts, 3);
  assert.equal(r.calibration, null); // unter 5 Tipps keine Kalibrierung
});

test('stats: perfekte Kalibrierung ergibt 100', () => {
  const list = [];
  for (let i = 0; i < 10; i++) list.push({ tip: true, conf: 90, outcome: i < 9, pts: 0 }); // 90 % Sicherheit, 90 % Treffer
  assert.equal(L.stats(list).calibration, 100);
});

test('stats: überheblich (100 % Sicherheit, 50 % Treffer) ergibt niedrige Kalibrierung', () => {
  const list = [];
  for (let i = 0; i < 10; i++) list.push({ tip: true, conf: 100, outcome: i < 5, pts: 0 });
  assert.ok(L.stats(list).calibration <= 5);
});

test('dayKey und addDays: Monats-, Jahres- und Schaltjahrwechsel', () => {
  assert.equal(L.dayKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(L.addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(L.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(L.addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(L.addDays('2026-03-01', -1), '2026-02-28');
});

test('moonIllum: bleibt zwischen 0 und 1, Neumond am 06.01.2000 fast dunkel', () => {
  const neumond = L.moonIllum(Date.UTC(2000, 0, 6, 18, 14));
  assert.ok(neumond >= 0 && neumond < 0.02, 'Neumond ' + neumond);
  const voll = L.moonIllum(Date.UTC(2000, 0, 21, 4, 40));
  assert.ok(voll > 0.95 && voll <= 1, 'Vollmond ' + voll);
});

test('sunElevation: Äquator zur Tagundnachtgleiche mittags fast senkrecht, nachts unter dem Horizont', () => {
  const mittag = L.sunElevation(0, 0, Date.UTC(2024, 2, 20, 12, 0));
  assert.ok(mittag > 85, 'Mittag ' + mittag);
  const nacht = L.sunElevation(0, 0, Date.UTC(2024, 2, 20, 0, 0));
  assert.ok(nacht < -80, 'Nacht ' + nacht);
});

test('measure: Messregeln liefern null bei fehlenden Daten, sonst Ergebnis und gezeigten Wert', () => {
  assert.equal(L.measure.temp({ T: 10 }, null), null);
  assert.equal(L.measure.temp({ T: 10 }, { current: {} }), null);
  assert.deepEqual(L.measure.temp({ T: 10 }, { current: { temperature_2m: 12 } }), { outcome: true, shown: 12 });
  assert.deepEqual(L.measure.temp({ T: 10 }, { current: { temperature_2m: 8 } }), { outcome: false, shown: 8 });
  assert.deepEqual(L.measure.isday({}, { current: { is_day: 1 } }), { outcome: true, shown: 1 });
  assert.deepEqual(L.measure.rain({}, { current: { precipitation: 0 } }), { outcome: false, shown: 0 });
  assert.deepEqual(L.measure.wind({ W: 20 }, { current: { wind_speed_10m: 25 } }), { outcome: true, shown: 25 });
  assert.deepEqual(L.measure.iss({}, { latitude: -10 }), { outcome: false, shown: -10 });
  assert.deepEqual(L.measure.quake({ N: 2 }, { features: [1, 2, 3] }), { outcome: true, shown: 3 });
  assert.equal(L.measure.quake({ N: 2 }, {}), null);
});

test('mergeState: ungültige Sicherung wird abgelehnt', () => {
  assert.throws(() => L.mergeState({ tips: [] }, null), /Ungültige Sicherung/);
  assert.throws(() => L.mergeState({ tips: [] }, { tips: 'x' }), /Ungültige Sicherung/);
});

test('mergeState: führt zusammen, ohne Doppelte, aufgelöst gewinnt, Kaputtes wird übersprungen', () => {
  const aktuell = { name: 'x', tips: [{ id: 'a', tip: true, conf: 70, ts: 2, resolved: false }, { id: 'b', tip: false, conf: 60, ts: 3, resolved: true }] };
  const neu = { tips: [
    { id: 'a', tip: true, conf: 70, ts: 2, resolved: true },
    { id: 'b', tip: false, conf: 60, ts: 3, resolved: false },
    { id: 'c', tip: true, conf: 80, ts: 1 },
    { id: 'd', tip: 'ja', conf: 80, ts: 4 },
    null,
  ] };
  const r = L.mergeState(aktuell, neu);
  assert.equal(r.name, 'x');
  assert.deepEqual(r.tips.map(t => t.id), ['c', 'a', 'b']);
  assert.equal(r.tips.find(t => t.id === 'a').resolved, true);
  assert.equal(r.tips.find(t => t.id === 'b').resolved, true);
});

test('measure: Erdbeben-Stärke, Luft, Windrichtung, Tageslänge, Druck, Feuchte, Wolken', () => {
  const M = L.measure;
  assert.deepEqual(M.quakemax({ M: 5 }, { features: [{ properties: { mag: 4.2 } }, { properties: { mag: 5.1 } }, null] }), { outcome: true, shown: 5.1 });
  assert.equal(M.quakemax({ M: 5 }, { features: [] }), null);
  assert.equal(M.quakemax({ M: 5 }, {}), null);
  assert.deepEqual(M.aqi({ A: 40 }, { current: { european_aqi: 20 } }), { outcome: true, shown: 20 });
  assert.deepEqual(M.winddir({ D: 'N' }, { current: { wind_direction_10m: 350 } }), { outcome: true, shown: 350 });
  const lang = { daily: { daylight_duration: [36000] } };
  const kurz = { daily: { daylight_duration: [32400] } };
  assert.deepEqual(M.daylen({}, [lang, kurz]), { outcome: true, shown: { a: 10, b: 9 } });
  assert.equal(M.daylen({}, [lang]), null);
  assert.deepEqual(M.pressure({ P: 1013 }, { current: { pressure_msl: 1000 } }), { outcome: false, shown: 1000 });
  assert.deepEqual(M.humidity({ H: 50 }, { current: { relative_humidity_2m: 80 } }), { outcome: true, shown: 80 });
  assert.deepEqual(M.cloud({}, { current: { cloud_cover: 20 } }), { outcome: false, shown: 20 });
  assert.equal(M.cloud({}, {}), null);
});

test('measure: warmer, Uhrzeit, Station, Sonnenhöhe', () => {
  const M = L.measure;
  assert.deepEqual(M.warmer({}, [{ current: { temperature_2m: 12 } }, { current: { temperature_2m: 9 } }]), { outcome: true, shown: { a: 12, b: 9 } });
  assert.equal(M.warmer({}, [{ current: { temperature_2m: 12 } }]), null);
  assert.deepEqual(M.clock({ H: 12 }, { hour: 13, minute: 5 }), { outcome: true, shown: 785 });
  assert.equal(M.clock({ H: 12 }, { hour: 'x' }), null);
  assert.deepEqual(M.isssun({}, { visibility: 'daylight' }), { outcome: true, shown: 'daylight' });
  assert.deepEqual(M.isssun({}, { visibility: 'eclipsed' }), { outcome: false, shown: 'eclipsed' });
  assert.equal(M.isssun({}, { visibility: '' }), null);
  assert.deepEqual(M.isseast({}, { longitude: 12 }), { outcome: true, shown: 12 });
  assert.equal(M.isseast({}, { longitude: Infinity }), null);
  const jetzt = Date.UTC(2024, 2, 20, 12, 0);
  const r = M.sunhigh({}, { now: jetzt, a: { lat: 0, lon: 0 }, b: { lat: 0, lon: 180 } });
  assert.equal(r.outcome, true);
  assert.equal(M.sunhigh({}, { now: jetzt }), null);
});

test('measure: Sonnenwind liest Tabelle und Objektliste, jüngster Wert zählt', () => {
  const M = L.measure;
  const tabelle = [['time_tag', 'density', 'speed'], ['2026-11-27 10:00', '5', '300'], ['2026-11-27 11:00', '5', '450']];
  assert.deepEqual(M.solarwind({ S: 400 }, tabelle), { outcome: true, shown: 450 });
  const objekte = [{ time_tag: '2026-11-27T11:00', speed: 350 }, { time_tag: '2026-11-27T10:00', speed: 500 }, null];
  assert.deepEqual(M.solarwind({ S: 400 }, objekte), { outcome: false, shown: 350 });
  assert.equal(M.solarwind({ S: 400 }, [['a', 'b']]), null);
  assert.equal(M.solarwind({ S: 400 }, []), null);
  assert.equal(M.solarwind({ S: 400 }, [{ speed: 0 }]), null);
});

test('measure: Polarlicht liest altes und neues Format', () => {
  const M = L.measure;
  const alt = [['time_tag', 'Kp', 'a_running'], ['2026-11-27 09:00', '2', '1'], ['2026-11-27 12:00', '5', '1']];
  assert.deepEqual(M.aurora({ K: 4 }, alt), { outcome: true, shown: 5 });
  const neu = [{ time_tag: '2026-11-27T12:00', Kp: 3, kp_fraction: 3.3 }, { time_tag: '2026-11-27T09:00', Kp: 6 }, 'x'];
  assert.deepEqual(M.aurora({ K: 4 }, neu), { outcome: false, shown: 3 });
  assert.equal(M.aurora({ K: 4 }, [['a', 'b']]), null);
  assert.equal(M.aurora({ K: 4 }, []), null);
  assert.equal(M.aurora({ K: 4 }, [{ foo: 1 }]), null);
});

test('measure: Mond, morgen, Wikipedia-Vergleiche', () => {
  const M = L.measure;
  const voll = M.moon({}, { now: Date.UTC(2000, 0, 21, 4, 40) });
  assert.equal(voll.outcome, true);
  assert.ok(voll.shown > 90);
  assert.equal(M.moon({}, {}), null);
  const tage = { daily: { time: ['2026-11-27', '2026-11-28'], temperature_2m_max: [8, 11] } };
  assert.deepEqual(M.tomorrow({ created: '2026-11-27', due: '2026-11-28' }, tage), { outcome: true, shown: { today: 8, tomorrow: 11 } });
  assert.equal(M.tomorrow({ created: '2026-11-27', due: '2026-12-01' }, tage), null);
  assert.equal(M.tomorrow({}, {}), null);
  assert.deepEqual(M.wikisize({}, { a: 10, b: 4 }), { outcome: true, shown: { a: 10, b: 4 } });
  assert.equal(M.wikisize({}, { a: 'x', b: 4 }), null);
  assert.deepEqual(M.wikihist({}, { a: 1, b: 4 }), { outcome: false, shown: { a: 1, b: 4 } });
  assert.deepEqual(M.wikixnatur({ F: 2 }, { a: 9, b: 4 }), { outcome: true, shown: { a: 9, b: 4 } });
  assert.equal(M.wikixgeo({ F: 0 }, { a: 9, b: 4 }), null);
});
