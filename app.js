/* Daumenprobe: Tipp vorher, Wirklichkeit danach gemessen. Spielstand nur im Browser. */
(function () {
  'use strict';
  const DP = window.DP;
  const KEY = 'daumenprobe.v1';
  const DAILY_LIMIT = 10;

  const CITIES = [
    { id: 'hannover', tz: 'Europe/Berlin', flag: '🇩🇪', lat: 52.37, lon: 9.73, de: 'Hannover', en: 'Hanover', eu: true },
    { id: 'berlin', tz: 'Europe/Berlin', flag: '🇩🇪', lat: 52.52, lon: 13.41, de: 'Berlin', en: 'Berlin', eu: true },
    { id: 'muenchen', tz: 'Europe/Berlin', flag: '🇩🇪', lat: 48.14, lon: 11.58, de: 'München', en: 'Munich', eu: true },
    { id: 'hamburg', tz: 'Europe/Berlin', flag: '🇩🇪', lat: 53.55, lon: 9.99, de: 'Hamburg', en: 'Hamburg', eu: true },
    { id: 'tokio', tz: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.68, lon: 139.69, de: 'Tokio', en: 'Tokyo', eu: false },
    { id: 'sydney', tz: 'Australia/Sydney', flag: '🇦🇺', lat: -33.87, lon: 151.21, de: 'Sydney', en: 'Sydney', eu: false },
    { id: 'newyork', tz: 'America/New_York', flag: '🇺🇸', lat: 40.71, lon: -74.01, de: 'New York', en: 'New York', eu: false },
    { id: 'kapstadt', tz: 'Africa/Johannesburg', flag: '🇿🇦', lat: -33.92, lon: 18.42, de: 'Kapstadt', en: 'Cape Town', eu: false }
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
        'Wir messen live nach. Recht gehabt gibt Punkte, Daneben kostet Punkte.',
        'Verklickt? Einmal pro Frage kannst du vor dem Messen zurück und neu antworten.'
      ],
      rules_goal: 'Es gewinnt, wer die meisten Punkte hat. Treffer bringen Punkte, Daneben kosten Punkte, und zwar mehr, je sicherer du dich gibst.',
      rules_cols: ['Sicherheit', 'Treffer', 'Daneben'],
      rules_foot: 'Schwer zählt volle Punkte, Mittel dreiviertel, Leicht die Hälfte. Fünf Behauptungen pro Tag. Nur Spielpunkte, nie Geld.',
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
      faq_btn: 'FAQ', faq_title: 'Häufige Fragen', faq_back: 'Zurück zum Spiel',
      faq: [
        ['Worum geht es?', 'Du bekommst eine Behauptung über die Wirklichkeit, tippst „stimmt“ oder „stimmt nicht“ und sagst, wie sicher du bist. Danach messen wir live aus offenen Daten nach.'],
        ['Wie kommen die Punkte zustande?', 'Je sicherer du bist, desto mehr bringt ein Treffer, aber desto mehr kostet ein Irrtum. Bei Schwer gibt es von +5 (geraten) bis +10 (ganz sicher) und von −5 bis −30. Die Tabelle steht unter „So geht’s“.'],
        ['Warum kostet „ganz sicher“ so viel?', 'Wer immer „ganz sicher“ sagt, soll auf Dauer verlieren. Wer ehrlich einschätzt, steht am besten da. Darum geht es im Spiel.'],
        ['Ich habe mich verklickt.', 'Einmal pro Frage kannst du vor dem Messen mit „Antwort ändern“ zurück und neu antworten.'],
        ['Was heißen Leicht, Mittel und Schwer?', 'Leicht: Wörter statt Prozent, halbe Punkte, kein Minus. Mittel: Wörter, drei Viertel der Punkte, Minus höchstens −8. Schwer: Prozent, volle Punkte. Die Stufe ändert nur Bedienung und Punkte, nie die Inhalte.'],
        ['Woher kommen die Daten?', 'Wetter und Luft von Open-Meteo, Erdbeben vom USGS, den Polarlicht-Index (Kp) von der NOAA, die ISS von wheretheiss.at. Mond, Sonnenhöhe und Ortszeit rechnet dein Gerät selbst.'],
        ['Was sind Tagesfrage, Duell und Aufstiegsprüfung?', 'Die Tagesfrage ist für alle auf der Welt dieselbe. Beim Duell spielst du mit einem Freund per Link dieselben 5 Behauptungen. Die Aufstiegsprüfung brauchst du an manchen Rängen: 3 Behauptungen, mindestens 2 Treffer. Alle drei zählen nicht zu den zehn pro Tag.'],
        ['Warum nur zehn Fragen am Tag?', 'Damit es nicht endlos wird. Danach ist Schluss für heute und morgen gibt es neue.'],
        ['Was passiert mit meinen Daten?', 'Alles bleibt in deinem Browser. Kein Konto, kein Tracking. Mit „Sicherung“ kannst du deinen Stand als Datei oder Code speichern und laden.'],
        ['Eine Frage ist unklar oder die Messung stimmt nicht.', 'Auf dem Ergebnis-Bildschirm gibt es „Unklar“, „Langweilig“ und „Messung komisch“. So hilfst du, das Spiel besser zu machen.'],
        ['Kann ich es als App installieren?', 'Ja. Im Browser „Zum Home-Bildschirm“ wählen. Dann startet es wie eine App.'],
        ['Dürfen Kinder mitspielen?', 'Ja. Es gibt nur Spielpunkte, nie Geld, nichts Kritisches, kein Konto und keine Altersabfrage.']
      ],
      rules_more: ['Zehn Behauptungen pro Tag, danach ist Schluss für heute.', 'Eine Frage zu verwerfen zählt als Versuch.', 'Die Messregel steht vorher fest und wird nach dem Tipp gezeigt.', 'Tagesfrage, Duell und Aufstiegsprüfung zählen nicht zu den zehn.', 'Ehrlich einschätzen lohnt sich: Wer immer „ganz sicher“ sagt, verliert auf Dauer.', 'Es gibt nur Spielpunkte, nie Geld.'],
      back: 'Antwort ändern',
      first_go: 'Los geht\'s', pr_swipe: 'Wische nach rechts: stimmt. Nach links: stimmt nicht.', pr_conf: 'Je sicherer du bist, desto mehr bringt ein Treffer, aber desto mehr kostet ein Irrtum.', pr_done: 'Das war nur Übung, hier zählt nichts. Ab jetzt wird echt gemessen.', pr_next: 'Erste echte Frage', pr_unit: 'Übung',
      rep_q: 'Stimmt etwas mit der Frage nicht?', rep_unclear: 'Unklar', rep_boring: 'Langweilig', rep_odd: 'Messung komisch', rep_thanks: 'Danke, gemerkt.',
      export_file: 'Datei sichern', export_code: 'Code kopieren', copied: 'Kopiert.',
      import_title: 'Laden',
      import_ph: 'Code oder Sicherungsdatei-Inhalt hier einfügen',
      import_btn: 'Laden', import_file: 'Datei wählen',
      import_ok: 'Geladen: {n} Tipps.', import_bad: 'Das hat nicht geklappt. Ist es ein Code von Daumenprobe?',
      remind: 'Du hast länger nicht gesichert. Sichere deinen Stand unten.',
      lang: 'Sprache',
      made_by: 'Ein Spiel von', imprint: 'Impressum', privacy: 'Datenschutz',
      privacy_text: 'Daumenprobe speichert Tipps und Punkte nur in deinem Browser (localStorage). Kein Konto, kein Tracking, keine Cookies. Zum Messen ruft dein Browser Open-Meteo.com (Wetter, Luft), wheretheiss.at (ISS) und earthquake.usgs.gov (Erdbeben) und services.swpc.noaa.gov (Polarlicht-Index) ab; diese Dienste sehen dabei deine IP-Adresse. Dein Standort wird nicht abgefragt, die Orte sind fest vorgegeben. Hosting: Cloudflare.',
      data_credit: 'Wetterdaten: Open-Meteo.com (CC BY 4.0). ISS-Position: wheretheiss.at. Erdbeben: USGS. Polarlicht-Index: NOAA SWPC. Nur Spielpunkte, nie Geld.',
      measure_msg: {
        quake: 'Der USGS meldet {v} Beben ab Stärke 4,5 in den letzten 24 Stunden.',
        quakemax: 'Das stärkste Beben hatte Stärke {v}.',
        aqi: 'In {city} liegt der Luftindex bei {v}.',
        winddir: 'In {city} kommt der Wind aus {v}° ({dir}).',
        daylen: 'Sonnenaufgang bis Sonnenuntergang: {city} {a} Stunden, {city2} {b} Stunden.',
        practice: 'Die Sonne geht im Osten auf.',
        pressure: 'In {city} liegt der Luftdruck bei {v} hPa.',
        humidity: 'In {city} liegt die Luftfeuchtigkeit bei {v} %.',
        cloud: 'In {city} sind {v} % des Himmels bewölkt.',
        warmer: 'In {city} sind es {a} °C, in {city2} {b} °C.',
        sunhigh: 'In {city} steht die Sonne {a}° hoch, in {city2} {b}°.',
        clock: 'In {city} ist es jetzt {v} Uhr.',
        aurora: 'Der Kp-Index liegt gerade bei {v}.',
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
        s: { how3: 'Sag, wie sicher du bist: geraten, ziemlich sicher oder ganz sicher.', goal: 'Treffer bringen halbe Punkte. Daneben kostet dich nichts.', hint: 'Je sicherer du bist, desto mehr Punkte gibt ein Treffer.' },
        m: { how3: 'Sag, wie sicher du bist: von geraten bis ganz sicher.', goal: 'Es gewinnt, wer die meisten Punkte hat. Treffer zählen dreiviertel, Daneben kostet höchstens 8.', hint: 'Je sicherer du bist, desto mehr Punkte gibt ein Treffer, aber ein Daneben kostet auch mehr.' }
      },
      badges_title: 'Abzeichen', badge_new: 'Neues Abzeichen', locked: 'Noch gesperrt',
      badges: {
        first: ['Erster Tipp', 'Einen Tipp abgeben und messen lassen.'],
        hit1: ['Erster Treffer', 'Zum ersten Mal richtig liegen.'],
        combo3: ['Heiße Phase', '3 Treffer in Folge.'],
        combo5: ['Auf Draht', '5 Treffer in Folge.'],
        combo10: ['Unaufhaltsam', '10 Treffer in Folge.'],
        bold: ['Volltreffer', 'Auf Schwer mit 100 % sicher und richtig.'],
        ouch: ['Autsch', 'Mit mindestens 90 % sicher und daneben. Passiert den Besten.'],
        honest: ['Ehrliche Haut', 'Kalibrierung ab 85 % nach mindestens 10 Tipps.'],
        t10: ['Zehner', '10 Tipps gemessen.'],
        t50: ['Fünfziger', '50 Tipps gemessen.'],
        t100: ['Hunderter', '100 Tipps gemessen.'],
        d3: ['Dranbleiber', '3 Tage in Folge gespielt.'],
        d7: ['Wochenmeister', '7 Tage in Folge gespielt.'],
        full: ['Volles Haus', 'Alle zehn Behauptungen an einem Tag gespielt.'],
        world: ['Weltenbummler', 'Fünf verschiedene Themen gespielt.'],
        exam: ['Geprüft', 'Eine Aufstiegsprüfung bestanden.'],
        pass: ['Weltreisender', 'In allen acht Städten einen Stempel geholt.'],
        duel: ['Duellant', 'Ein Duell zu Ende gespielt.']
      },
      story_title: 'Der Orden der Daumen',
      story: 'Es gibt einen alten Brauch: Wer wissen will, woher der Wind weht, hält den Daumen hoch. Du bist neu im Orden der Daumen. Tippe, lass die Welt nachmessen und steige auf, bis du den Himmel lesen kannst wie ein Buch.',
      rank_lore: [
        'Du hast den Daumen noch nicht einmal gehoben.',
        'Du riechst den Regen, bevor er fällt. Meistens.',
        'Der Orden nimmt dich auf. Dein Daumen darf in den Wind.',
        'Du entscheidest schneller, als andere Wolken zählen.',
        'Selbst die Alten hören zu, wenn du den Himmel liest.',
        'Das Barometer ist neidisch.',
        'Sicherheit ist bei dir keine Behauptung mehr, sondern ein Messwert.',
        'Du siehst Beben, die noch keiner gespürt hat. Fast.',
        'Die Stadt fragt dich, ob sie den Schirm mitnehmen soll.',
        'Du sagst 100 % und hast recht. Selten, aber das macht den Ruf.',
        'Man erzählt, dein Daumen ersetze den Wetterdienst.',
        'Der Orden hat dir nichts mehr beizubringen. Außer Demut.'
      ],
      duel_new: 'Duell mit Freund', duel_sub: 'Gleiche 5 Behauptungen, ein Link, kein Konto', duel_once: 'Ein Duell pro Tag.', duel_cont: 'Duell fortsetzen ({i}/5)',
      duel_invite: 'Duell-Einladung', duel_friend: 'Freund: {row} · {p} Punkte', duel_accept: 'Annehmen', duel_next: 'Weiter ({i}/5)', duel_eval: 'Auswerten',
      duel_title: 'Duell', duel_you: 'Du', duel_them: 'Freund', duel_win: 'Gewonnen!', duel_lose: 'Knapp verloren.', duel_draw: 'Unentschieden.',
      duel_share_text: 'Daumenprobe-Duell ⚔️ {row} · {p} Punkte. Schaffst du mehr?', duel_waiting: 'Schick den Link. Dein Freund spielt dieselben 5 Behauptungen und sieht dein Ergebnis.', duel_show: 'Duell-Ergebnis',
      types: {
        coin: ['🪙', 'Der Münzwerfer', 'Du tippst fast immer auf Nummer sicher bei 50 %. Mut bringt mehr Punkte, wenn du etwas ahnst.'],
        wolf: ['🐺', 'Der Draufgänger', 'Du bist sicherer, als es die Treffer hergeben. Etwas weniger Prozent, und es gibt weniger Autsch.'],
        turtle: ['🐢', 'Der Zauderer', 'Du triffst öfter, als du dir zutraust. Trau dich, höher zu gehen.'],
        falcon: ['🦅', 'Der Falke', 'Du bist mutig und liegst dabei richtig. Selten und stark.'],
        fox: ['🦊', 'Der Fuchs', 'Du schätzt dich fast genau richtig ein. Das ist die Kunst.']
      },
      type_title: 'Dein Daumen-Typ', type_more: 'Noch {n} Tipps bis dein Typ feststeht.', type_stats: 'Ø Sicherheit {c} % · Trefferquote {h} %', type_share: 'Mein Daumen-Typ: {e} {n}. {d}',
      exam_title: 'Aufstiegsprüfung', exam_ready: 'Prüfung für {r}: 3 schwere Behauptungen, mindestens 2 Treffer.', exam_start: 'Prüfung starten', exam_cont: 'Prüfung fortsetzen ({i}/3)',
      exam_tomorrow: 'Nicht bestanden. Neuer Versuch morgen.', exam_next: 'Weiter ({i}/3)', exam_eval: 'Auswerten', exam_pass: 'Bestanden!', exam_fail: 'Nicht bestanden.', exam_newrank: 'Neuer Rang: {r}', exam_again: 'Du brauchtest 2 Treffer. Morgen gibt es einen neuen Versuch.',
      pass_title: 'Weltreise-Pass', pass_help: 'Triff einmal in jeder Stadt, dann bekommst du den Stempel.',
      skin_title: 'Farbwelt', skins: { night: 'Nacht', dawn: 'Morgenrot', aurora: 'Polarlicht', storm: 'Gewitter', gold: 'Gold' }, skin_locked: 'Ab Rang {r}',
      you_tipped_w: 'Dein Tipp: {tip}, {conf}.',
      daily_title: 'Frage des Tages', daily_sub: 'Für alle gleich, weltweit', daily_go: 'Heute mitmachen', daily_done: 'Heute erledigt', share: 'Teilen', share_copied: 'Kopiert. Jetzt einfügen und verschicken.',
      share_head: 'Daumenprobe #{n}', share_pts: '{p} Punkte',
      ranks: ['Neuling', 'Schnupperer', 'Daumen-Lehrling', 'Daumenschnipper', 'Daumen-Kenner', 'Wetterprophet', 'Daumen-Profi', 'Seher', 'Orakel', 'Großes Orakel', 'Daumen-Legende', 'Daumenprobe-Meister'],
      streak_n: '{n} Tage in Folge', streak_1: '1 Tag', combo_n: '{n} Treffer in Folge', rankup: 'Neuer Rang: {r}', to_next: 'noch {n} bis {r}', top_rank: 'Höchster Rang', sound_on: 'Ton an', sound_off: 'Ton aus',
      dir: { N: 'Norden', E: 'Osten', S: 'Süden', W: 'Westen' },
      claims: {
        quake: 'Weltweit gab es in den letzten 24 Stunden mehr als {N} Erdbeben ab Stärke 4,5.',
        quakemax: 'Das stärkste Erdbeben der letzten 24 Stunden hatte mindestens Stärke {M}.',
        aqi: 'Die Luft in {city} ist gerade besser als Stufe {A} (EU-Luftindex, kleiner ist besser).',
        winddir: 'In {city} kommt der Wind gerade aus {D}.',
        daylen: 'Heute vergeht zwischen Sonnenaufgang und Sonnenuntergang in {city} mehr Zeit als in {city2}.',
        practice: 'Die Sonne geht im Osten auf.',
        pressure: 'Der Luftdruck in {city} (auf Meereshöhe umgerechnet) liegt gerade über {P} hPa.',
        humidity: 'Die Luftfeuchtigkeit in {city} liegt gerade über {H} %.',
        cloud: 'In {city} ist der Himmel gerade mehr als zur Hälfte bewölkt.',
        warmer: 'Gerade ist es in {city} wärmer als in {city2}.',
        sunhigh: 'Die Sonne steht gerade in {city} höher am Himmel als in {city2}.',
        clock: 'In {city} ist es gerade später als {H} Uhr (Ortszeit).',
        aurora: 'Der Kp-Index (Maß für Polarlicht-Chancen) liegt gerade über {K}.',
        moon: 'Der Mond ist gerade mehr als halb beleuchtet.',
        temp: 'In {city} sind es gerade mehr als {T} °C.',
        isday: 'In {city} steht die Sonne gerade über dem Horizont.',
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
        daylen: 'Stimmt, wenn die Zeit von Sonnenaufgang bis Sonnenuntergang heute in {city} länger ist als in {city2}. Wolken zählen nicht (Open-Meteo).',
        practice: 'Das stimmt immer.',
        pressure: 'Stimmt, wenn der auf Meereshöhe umgerechnete Luftdruck in {city} jetzt über {P} hPa liegt (Open-Meteo).',
        humidity: 'Stimmt, wenn die relative Luftfeuchtigkeit in {city} jetzt über {H} % liegt (Open-Meteo).',
        cloud: 'Stimmt, wenn der Bewölkungsgrad in {city} jetzt über 50 % liegt (Open-Meteo).',
        warmer: 'Stimmt, wenn die Temperatur jetzt in {city} höher ist als in {city2} (Open-Meteo).',
        sunhigh: 'Stimmt, wenn der Winkel der Sonne über dem Horizont jetzt in {city} größer ist als in {city2}. Minuswerte heißen: Die Sonne ist unten. Berechnet aus Ort und Uhrzeit.',
        clock: 'Stimmt, wenn die Uhrzeit vor Ort jetzt nach {H}:00 Uhr liegt. Das Gerät kennt die Zeitzone der Stadt.',
        aurora: 'Stimmt, wenn der Kp-Index der NOAA (0 bis 9, misst die Unruhe im Magnetfeld der Erde) im jüngsten Wert über {K} liegt. Ab 5 gibt es Polarlicht weit im Süden.',
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
        'We measure it live. Being right earns points, being wrong costs points.',
        'Mis-tapped? Once per claim you can go back before measuring and answer again.'
      ],
      rules_goal: 'The one with the most points wins. Hits earn points, misses cost points, and the more so the surer you say you are.',
      rules_cols: ['Confidence', 'Hit', 'Miss'],
      rules_foot: 'Hard counts full points, Medium three quarters, Easy half. Five claims per day. Play points only, never money.',
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
      faq_btn: 'FAQ', faq_title: 'Frequently asked questions', faq_back: 'Back to the game',
      faq: [
        ['What is this about?', 'You get a claim about the real world, tip “true” or “not true” and say how sure you are. Then we measure it live from open data.'],
        ['How do points work?', 'The surer you are, the more a hit earns, but the more a mistake costs. On Hard it runs from +5 (a guess) to +10 (totally sure) and from −5 to −30. The table is under “How it works”.'],
        ['Why does “totally sure” cost so much?', 'If you always say “totally sure” you should lose in the long run. Honest guessing wins. That is the game.'],
        ['I tapped the wrong thing.', 'Once per claim you can go back with “Change answer” before measuring and answer again.'],
        ['What do Easy, Medium and Hard mean?', 'Easy: words instead of percent, half points, no minus. Medium: words, three quarters of the points, minus at most −8. Hard: percent, full points. The level only changes controls and points, never the content.'],
        ['Where does the data come from?', 'Weather and air from Open-Meteo, earthquakes from USGS, the aurora index (Kp) from NOAA, the ISS from wheretheiss.at. Your device calculates moon, sun height and local time itself.'],
        ['What are the daily claim, duel and rank exam?', 'The daily claim is the same for everyone worldwide. In a duel you play the same 5 claims as a friend via a link. The rank exam is needed at some ranks: 3 claims, at least 2 hits. None of them count towards the ten per day.'],
        ['Why only ten claims a day?', 'So it does not go on forever. After that you are done for today and there are new ones tomorrow.'],
        ['What happens to my data?', 'Everything stays in your browser. No account, no tracking. With “Backup” you can save and load your progress as a file or code.'],
        ['A claim is unclear or the measurement is wrong.', 'On the result screen there are “Unclear”, “Boring” and “Odd measurement”. That helps make the game better.'],
        ['Can I install it as an app?', 'Yes. Choose “Add to Home Screen” in your browser. Then it starts like an app.'],
        ['Can children play?', 'Yes. There are only play points, never money, nothing critical, no account and no age check.']
      ],
      rules_more: ['Ten claims per day, then you are done for today.', 'Discarding a claim counts as an attempt.', 'The measuring rule is fixed beforehand and shown after your tip.', 'Daily claim, duel and rank exam do not count towards the ten.', 'Honest guessing pays off: always saying “totally sure” loses in the long run.', 'Play points only, never money.'],
      back: 'Change answer',
      first_go: 'Let\'s go', pr_swipe: 'Swipe right: true. Swipe left: not true.', pr_conf: 'The surer you are, the more a hit earns, but the more a mistake costs.', pr_done: 'That was only practice, nothing counts here. From now on it is measured for real.', pr_next: 'First real claim', pr_unit: 'practice',
      rep_q: 'Something off about this question?', rep_unclear: 'Unclear', rep_boring: 'Boring', rep_odd: 'Odd measurement', rep_thanks: 'Thanks, noted.',
      export_file: 'Save file', export_code: 'Copy code', copied: 'Copied.',
      import_title: 'Load',
      import_ph: 'Paste a code or the contents of a backup file here',
      import_btn: 'Load', import_file: 'Choose file',
      import_ok: 'Loaded: {n} tips.', import_bad: 'That did not work. Is it a Daumenprobe code?',
      remind: 'You have not saved for a while. Save your progress below.',
      lang: 'Language',
      made_by: 'A game by', imprint: 'Legal notice', privacy: 'Privacy',
      privacy_text: 'Daumenprobe stores tips and points only in your browser (localStorage). No account, no tracking, no cookies. To measure, your browser calls Open-Meteo.com (weather, air), wheretheiss.at (ISS) and earthquake.usgs.gov (earthquakes) and services.swpc.noaa.gov (aurora index); these services see your IP address. Your location is not requested, the places are fixed. Hosting: Cloudflare.',
      data_credit: 'Weather data: Open-Meteo.com (CC BY 4.0). ISS position: wheretheiss.at. Earthquakes: USGS. Aurora index: NOAA SWPC. Play points only, never money.',
      measure_msg: {
        quake: 'The USGS reports {v} quakes of magnitude 4.5+ in the last 24 hours.',
        quakemax: 'The strongest quake had magnitude {v}.',
        aqi: 'The air index in {city} is {v}.',
        winddir: 'In {city} the wind comes from {v}° ({dir}).',
        daylen: 'Sunrise to sunset: {city} {a} hours, {city2} {b} hours.',
        practice: 'The sun rises in the east.',
        pressure: 'In {city} the air pressure is {v} hPa.',
        humidity: 'In {city} the humidity is {v} %.',
        cloud: 'In {city} {v} % of the sky is covered by clouds.',
        warmer: 'In {city} it is {a} °C, in {city2} {b} °C.',
        sunhigh: 'In {city} the sun is {a}° high, in {city2} {b}°.',
        clock: 'In {city} it is {v} right now.',
        aurora: 'The Kp index is {v} right now.',
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
        s: { how3: 'Say how sure you are: a guess, pretty sure or totally sure.', goal: 'Hits earn half points. A miss costs you nothing.', hint: 'The surer you are, the more a hit is worth.' },
        m: { how3: 'Say how sure you are: from a guess to totally sure.', goal: 'The one with the most points wins. Hits count three quarters, a miss costs 8 at most.', hint: 'The surer you are, the more a hit is worth, but a miss costs more too.' }
      },
      badges_title: 'Badges', badge_new: 'New badge', locked: 'Locked',
      badges: {
        first: ['First tip', 'Make a tip and have it measured.'],
        hit1: ['First hit', 'Be right for the first time.'],
        combo3: ['Hot streak', '3 hits in a row.'],
        combo5: ['On a roll', '5 hits in a row.'],
        combo10: ['Unstoppable', '10 hits in a row.'],
        bold: ['Bullseye', 'On Hard: 100 % sure and right.'],
        ouch: ['Ouch', 'At least 90 % sure and wrong. Happens to the best.'],
        honest: ['Honest soul', 'Calibration of 85 % or more after at least 10 tips.'],
        t10: ['Tenner', '10 tips measured.'],
        t50: ['Fifty', '50 tips measured.'],
        t100: ['Hundred', '100 tips measured.'],
        d3: ['Keeping at it', 'Played 3 days in a row.'],
        d7: ['Week master', 'Played 7 days in a row.'],
        full: ['Full house', 'Played all ten claims in one day.'],
        world: ['Globetrotter', 'Played five different topics.'],
        exam: ['Examined', 'Passed a rank exam.'],
        pass: ['Globe trotter', 'Collected a stamp in all eight cities.'],
        duel: ['Duelist', 'Finished a duel.']
      },
      story_title: 'The Order of the Thumbs',
      story: 'There is an old custom: whoever wants to know where the wind blows holds up a thumb. You are new to the Order of the Thumbs. Tip, let the world measure itself and climb until you can read the sky like a book.',
      rank_lore: [
        'You have not even raised your thumb yet.',
        'You smell the rain before it falls. Mostly.',
        'The Order takes you in. Your thumb may test the wind.',
        'You decide faster than others count clouds.',
        'Even the elders listen when you read the sky.',
        'The barometer is jealous.',
        'For you, certainty is no longer a claim but a measurement.',
        'You see quakes nobody has felt yet. Almost.',
        'The town asks you whether to bring an umbrella.',
        'You say 100 % and you are right. Rare, but that is how legends start.',
        'They say your thumb replaces the weather service.',
        'The Order has nothing left to teach you. Except humility.'
      ],
      duel_new: 'Duel a friend', duel_sub: 'Same 5 claims, one link, no account', duel_once: 'One duel per day.', duel_cont: 'Continue duel ({i}/5)',
      duel_invite: 'Duel invitation', duel_friend: 'Friend: {row} · {p} points', duel_accept: 'Accept', duel_next: 'Next ({i}/5)', duel_eval: 'See result',
      duel_title: 'Duel', duel_you: 'You', duel_them: 'Friend', duel_win: 'You won!', duel_lose: 'Narrowly lost.', duel_draw: 'A draw.',
      duel_share_text: 'Daumenprobe duel ⚔️ {row} · {p} points. Can you beat it?', duel_waiting: 'Send the link. Your friend plays the same 5 claims and sees your result.', duel_show: 'Duel result',
      types: {
        coin: ['🪙', 'The Coin Flipper', 'You almost always play it safe at 50 %. Boldness pays more when you sense something.'],
        wolf: ['🐺', 'The Daredevil', 'You are surer than your hits justify. A few percent less, and fewer ouches.'],
        turtle: ['🐢', 'The Hesitant One', 'You hit more often than you think. Dare to go higher.'],
        falcon: ['🦅', 'The Falcon', 'You are bold and right at the same time. Rare and strong.'],
        fox: ['🦊', 'The Fox', 'You judge yourself almost exactly right. That is the art.']
      },
      type_title: 'Your thumb type', type_more: '{n} more tips until your type is set.', type_stats: 'Avg. confidence {c} % · hit rate {h} %', type_share: 'My thumb type: {e} {n}. {d}',
      exam_title: 'Rank exam', exam_ready: 'Exam for {r}: 3 hard claims, at least 2 hits.', exam_start: 'Start exam', exam_cont: 'Continue exam ({i}/3)',
      exam_tomorrow: 'Not passed. Try again tomorrow.', exam_next: 'Next ({i}/3)', exam_eval: 'See result', exam_pass: 'Passed!', exam_fail: 'Not passed.', exam_newrank: 'New rank: {r}', exam_again: 'You needed 2 hits. A new attempt opens tomorrow.',
      pass_title: 'World pass', pass_help: 'Hit once in every city to earn its stamp.',
      skin_title: 'Theme', skins: { night: 'Night', dawn: 'Dawn', aurora: 'Aurora', storm: 'Storm', gold: 'Gold' }, skin_locked: 'From rank {r}',
      you_tipped_w: 'Your tip: {tip}, {conf}.',
      daily_title: 'Daily claim', daily_sub: 'The same for everyone, worldwide', daily_go: 'Play today', daily_done: 'Done today', share: 'Share', share_copied: 'Copied. Paste it and send it.',
      share_head: 'Daumenprobe #{n}', share_pts: '{p} points',
      ranks: ['Rookie', 'Sniffer', 'Thumb Apprentice', 'Thumb Flicker', 'Thumb Expert', 'Weather Prophet', 'Thumb Pro', 'Seer', 'Oracle', 'Grand Oracle', 'Thumb Legend', 'Thumb Master'],
      streak_n: '{n} days in a row', streak_1: '1 day', combo_n: '{n} hits in a row', rankup: 'New rank: {r}', to_next: '{n} to {r}', top_rank: 'Top rank', sound_on: 'Sound on', sound_off: 'Sound off',
      dir: { N: 'north', E: 'east', S: 'south', W: 'west' },
      claims: {
        quake: 'In the last 24 hours there were more than {N} earthquakes of magnitude 4.5 or higher worldwide.',
        quakemax: 'The strongest earthquake of the last 24 hours had a magnitude of at least {M}.',
        aqi: 'The air in {city} is better than level {A} right now (EU air index, lower is better).',
        winddir: 'The wind in {city} is coming from the {D} right now.',
        daylen: 'Today, more time passes between sunrise and sunset in {city} than in {city2}.',
        practice: 'The sun rises in the east.',
        pressure: 'The air pressure in {city} (sea level) is above {P} hPa right now.',
        humidity: 'The humidity in {city} is above {H} % right now.',
        cloud: 'The sky in {city} is more than half covered by clouds right now.',
        warmer: 'Right now it is warmer in {city} than in {city2}.',
        sunhigh: 'Right now the sun is higher in the sky in {city} than in {city2}.',
        clock: 'In {city} it is later than {H}:00 local time right now.',
        aurora: 'The Kp index (a measure of aurora chances) is above {K} right now.',
        moon: 'The moon is more than half lit right now.',
        temp: 'It is warmer than {T} °C in {city} right now.',
        isday: 'The sun is above the horizon in {city} right now.',
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
        daylen: 'True if the time from sunrise to sunset today is longer in {city} than in {city2}. Clouds do not matter (Open-Meteo).',
        practice: 'Always true.',
        pressure: 'True if the sea-level air pressure in {city} is above {P} hPa right now (Open-Meteo).',
        humidity: 'True if the relative humidity in {city} is above {H} % right now (Open-Meteo).',
        cloud: 'True if cloud cover in {city} is above 50 % right now (Open-Meteo).',
        warmer: 'True if the temperature right now is higher in {city} than in {city2} (Open-Meteo).',
        sunhigh: 'True if the angle of the sun above the horizon is bigger in {city} than in {city2} right now. Negative values mean the sun is down. Calculated from place and time.',
        clock: 'True if the local time in {city} is after {H}:00 right now. Your device knows the time zone of the city.',
        aurora: 'True if the NOAA Kp index (0 to 9, measures how restless Earth\'s magnetic field is) is above {K} in its latest value. From 5 up, aurora reaches far south.',
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
  let RNG = null;
  function rnd() { return RNG ? RNG() : Math.random(); }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* Gleiche Zufallsfolge für alle mit demselben Startwort: Tagesfrage und Duell. Nur sofort messbare Themen. */
  const SHARED_POOL = ['temp', 'isday', 'rain', 'wind', 'iss', 'quake', 'quakemax', 'aqi', 'winddir', 'daylen', 'moon', 'pressure', 'humidity', 'cloud', 'warmer', 'sunhigh', 'clock', 'aurora'];
  /* Erst die Kategorie, dann das Thema: Wetter, Luft, Erde, Weltraum, Himmel, Zeit wechseln sich ab. */
  const CAT_OF = { temp: 'w', isday: 'w', rain: 'w', wind: 'w', cloud: 'w', humidity: 'w', pressure: 'w', winddir: 'w', warmer: 'w', tomorrow: 'w', aqi: 'luft', quake: 'erde', quakemax: 'erde', iss: 'raum', aurora: 'raum', moon: 'himmel', daylen: 'himmel', sunhigh: 'himmel', clock: 'zeit' };
  function balanced(pool, used) {
    const cats = {};
    pool.forEach(function (t) { (cats[CAT_OF[t]] = cats[CAT_OF[t]] || []).push(t); });
    const names = Object.keys(cats);
    const cnt = function (c) { return used.filter(function (t) { return CAT_OF[t] === c; }).length; };
    const min = Math.min.apply(null, names.map(cnt));
    const cat = pick(names.filter(function (c) { return cnt(c) === min; }));
    const fresh = cats[cat].filter(function (t) { return used.indexOf(t) < 0; });
    return pick(fresh.length ? fresh : cats[cat]);
  }
  function claimsFromSeed(seed, n) {
    RNG = mulberry(hashStr(seed));
    try {
      const out = [];
      const used = [];
      for (let i = 0; i < n; i++) { const t = balanced(SHARED_POOL, used); used.push(t); out.push(MAKERS[t]()); }
      return out;
    } finally { RNG = null; }
  }
  function utcKey(offset) { return new Date(Date.now() + (offset || 0) * 86400000).toISOString().slice(0, 10); }
  function dailyNumber(key) {
    const p = key.split('-').map(Number);
    return Math.round((Date.UTC(p[0], p[1] - 1, p[2]) - Date.UTC(2026, 10, 24)) / 86400000) + 1;
  }
  function dailyClaim(key) { return claimsFromSeed('tag:' + key, 1)[0]; }
  function dailyTip(key) { return S.tips.filter(function (t) { return t.daily === key; })[0]; }
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
    pressure: function () { return { tpl: 'pressure', city: pick(CITIES).id, P: pick([1000, 1010, 1020]) }; },
    humidity: function () { return { tpl: 'humidity', city: pick(CITIES).id, H: pick([50, 65, 80]) }; },
    cloud: function () { return { tpl: 'cloud', city: pick(CITIES).id }; },
    warmer: function () {
      const a = pick(CITIES);
      let b = pick(CITIES);
      while (b.id === a.id) b = pick(CITIES);
      return { tpl: 'warmer', city: a.id, city2: b.id };
    },
    sunhigh: function () {
      const a = pick(CITIES);
      let b = pick(CITIES);
      while (b.id === a.id) b = pick(CITIES);
      return { tpl: 'sunhigh', city: a.id, city2: b.id };
    },
    aurora: function () { return { tpl: 'aurora', K: pick([1, 2, 3]) }; },
    clock: function () { return { tpl: 'clock', city: pick(CITIES).id, H: pick([6, 12, 18, 21]) }; },
    moon: function () { return { tpl: 'moon' }; },
    tomorrow: function () {
      const today = DP.dayKey();
      const eu = CITIES.filter(function (c) { return c.eu; });
      return { tpl: 'tomorrow', city: pick(eu).id, created: today, due: DP.addDays(today, 1) };
    }
  };
  const POOLS = {
    s: ['temp', 'isday', 'rain', 'wind', 'cloud', 'warmer', 'humidity', 'daylen', 'moon', 'sunhigh', 'clock', 'aurora'],
    m: ['temp', 'isday', 'rain', 'wind', 'cloud', 'warmer', 'humidity', 'iss', 'tomorrow', 'quake', 'quakemax', 'aqi', 'winddir', 'daylen', 'moon', 'sunhigh', 'clock', 'aurora'],
    l: ['temp', 'isday', 'rain', 'wind', 'cloud', 'warmer', 'humidity', 'pressure', 'iss', 'tomorrow', 'quake', 'quakemax', 'aqi', 'winddir', 'daylen', 'moon', 'sunhigh', 'clock', 'aurora']
  };
  const NOCITY = { iss: 1, quake: 1, quakemax: 1, moon: 1, aurora: 1 };

  /* Abwechslung: heute noch nicht gespielte Themen zuerst, und keine Stadt aus den letzten drei Behauptungen. */
  function firstRun() { return !S.onbDone && !S.tips.length; }
  function newClaim() {
    const pool = POOLS[S.level] || POOLS.l;
    const k = DP.dayKey();
    const todays = S.tips.filter(function (x) { return !x.daily && !x.duel && !x.exam && DP.dayKey(new Date(x.ts)) === k && x.claim; }).sort(function (a, b) { return a.ts - b.ts; });
    const recent = todays.slice(-3).reduce(function (a, x) { return a.concat([x.claim.city, x.claim.city2]); }, []);
    let c;
    for (let i = 0; i < 8; i++) {
      c = MAKERS[balanced(pool, todays.map(function (x) { return x.claim.tpl; }))]();
      if (!c.city || recent.indexOf(c.city) < 0) break;
    }
    return c;
  }
  function isLater(claim) { return claim.tpl === 'tomorrow'; }
  function validClaim(c) {
    if (!c || !MAKERS[c.tpl]) return false;
    if (!NOCITY[c.tpl] && !cityById(c.city)) return false;
    if ((c.tpl === 'daylen' || c.tpl === 'warmer' || c.tpl === 'sunhigh') && !cityById(c.city2)) return false;
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
    return { city: c ? c[lang] : '', city2: c2 ? c2[lang] : '', T: claim.T, W: claim.W, N: claim.N, A: claim.A, P: claim.P, H: claim.H, K: claim.K, P: claim.P, H: claim.H,
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
    else if (claim.tpl === 'daylen' || claim.tpl === 'warmer') { vars.a = num(shown.a, lang); vars.b = num(shown.b, lang); }
    else if (claim.tpl === 'sunhigh') { vars.a = num(shown.a, lang, 0); vars.b = num(shown.b, lang, 0); }
    else if (claim.tpl === 'clock') { vars.v = String(Math.floor(shown / 60)).padStart(2, '0') + ':' + String(shown % 60).padStart(2, '0'); }
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
    if (claim.tpl === 'aurora') return fetchJson('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    if (claim.tpl === 'moon') return Promise.resolve({ now: Date.now() });
    if (claim.tpl === 'sunhigh') { const a = cityById(claim.city), b = cityById(claim.city2); return Promise.resolve({ now: Date.now(), a: { lat: a.lat, lon: a.lon }, b: { lat: b.lat, lon: b.lon } }); }
    if (claim.tpl === 'clock') {
      try {
        const p = {};
        new Intl.DateTimeFormat('en-GB', { timeZone: cityById(claim.city).tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = Number(x.value); });
        return Promise.resolve({ hour: p.hour, minute: p.minute });
      } catch (e) { return Promise.reject(e); }
    }
    if (claim.tpl === 'aqi') {
      const ca = cityById(claim.city);
      return fetchJson('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + ca.lat + '&longitude=' + ca.lon + '&current=european_aqi&timezone=auto');
    }
    if (claim.tpl === 'warmer') {
      const a = cityById(claim.city), b = cityById(claim.city2);
      return fetchJson('https://api.open-meteo.com/v1/forecast?latitude=' + a.lat + ',' + b.lat + '&longitude=' + a.lon + ',' + b.lon + '&current=temperature_2m&timezone=auto');
    }
    if (claim.tpl === 'daylen') {
      const a = cityById(claim.city), b = cityById(claim.city2);
      return fetchJson('https://api.open-meteo.com/v1/forecast?latitude=' + a.lat + ',' + b.lat + '&longitude=' + a.lon + ',' + b.lon + '&daily=daylight_duration&forecast_days=1&timezone=auto');
    }
    const c = cityById(claim.city);
    let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&timezone=auto';
    if (claim.tpl === 'tomorrow') url += '&daily=temperature_2m_max&past_days=5&forecast_days=2';
    else url += '&current=temperature_2m,is_day,precipitation,wind_speed_10m,wind_direction_10m,pressure_msl,relative_humidity_2m,cloud_cover';
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
  /* Einmalig: alte Tipps nach der neuen Punktetabelle umrechnen (Punkte-Version 2). */
  function rescore(st, raw) {
    if (raw && raw.scoreV >= 2) return;
    st.tips.forEach(function (t) {
      if (t && t.resolved && typeof t.pts === 'number' && typeof t.conf === 'number') t.pts = DP.points(t.tip, t.conf, t.outcome, t.level || 'l');
    });
    Object.keys(st.duels || {}).forEach(function (k) {
      const recs = st.tips.filter(function (t) { return t.duel === k && t.resolved; });
      if (recs.length && typeof st.duels[k].pts === 'number') st.duels[k].pts = recs.reduce(function (a, r) { return a + (r.pts || 0); }, 0);
    });
    st.scoreV = 2;
  }
  function blank() { return { v: 1, skin: 'night', exams: [], examActive: null, examDay: null, duels: {}, duelActive: null, level: 'l', scoreV: 2, lang: null, tips: [], reports: [], lastExport: null, draws: [], current: null }; }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.tips)) { const st = Object.assign(blank(), s); rescore(st, s); return st; }
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
  const ui = { exam: null, duel: null, duelEnd: null, invite: null, daily: null, view: 'home', claim: null, tip: null, conf: null, result: null, error: false, busy: false, msg: '' };

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
    const tipped = S.tips.filter(function (t) { return !t.daily && !t.duel && !t.exam && DP.dayKey(new Date(t.ts)) === k; }).length;
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
      const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, level: (ui.duel || ui.exam) ? 'l' : S.level, daily: ui.daily || undefined, duel: ui.duel ? ui.duel.seed : undefined, exam: ui.exam ? ui.exam.key : undefined, ts: Date.now(), resolved: false };
      finishTip(rec, m);
      S.tips.push(rec); S.current = null; save(S);
      ui.result = rec; ui.view = 'result'; ui.busy = false; render();
    }).catch(function () {
      ui.busy = false; ui.error = true; render();
    });
  }

  function submitLater() {
    const rec = { id: newId(), claim: ui.claim, tip: ui.tip, conf: ui.conf, level: (ui.duel || ui.exam) ? 'l' : S.level, daily: ui.daily || undefined, duel: ui.duel ? ui.duel.seed : undefined, exam: ui.exam ? ui.exam.key : undefined, ts: Date.now(), resolved: false };
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
    if (ui.view === 'duelend' || ui.view === 'examend') return 'wait';
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
  const EXAM_GATES = [4, 6, 8, 10];
  const RANK_AT = [0, 15, 40, 80, 140, 220, 320, 450, 650, 900, 1300, 2000];
  function rankFor(pts) {
    let i = 0, pending = null;
    RANK_AT.forEach(function (v, k) { if (pts >= v) i = k; });
    for (let q = 0; q < EXAM_GATES.length; q++) {
      const g = EXAM_GATES[q];
      if (i >= g && (S.exams || []).indexOf(g) < 0) { i = g - 1; pending = g; break; }
    }
    const next = i < RANK_AT.length - 1 ? RANK_AT[i + 1] : null;
    return { i: i, name: T().ranks[i], next: next, nextName: next === null ? null : T().ranks[i + 1], toNext: next === null || pending ? 0 : next - pts, pending: pending,
      pct: pending || next === null ? 100 : Math.max(0, Math.round((pts - RANK_AT[i]) / (next - RANK_AT[i]) * 100)) };
  }
  function streakDays() {
    const days = {};
    resolvedTips().forEach(function (r) { days[DP.dayKey(new Date(r.ts))] = 1; });
    let k = DP.dayKey();
    if (!days[k]) k = DP.addDays(k, -1);
    let n = 0, joker = true;
    for (;;) {
      if (days[k]) { n++; k = DP.addDays(k, -1); }
      else if (joker && n > 0 && days[DP.addDays(k, -1)]) { joker = false; k = DP.addDays(k, -1); } /* ein freier Tag verzeiht */
      else break;
    }
    return n;
  }
  function comboCount() {
    const rs = resolvedTips().slice().sort(function (a, b) { return a.ts - b.ts; });
    let n = 0;
    for (let i = rs.length - 1; i >= 0 && DP.isHit(rs[i].tip, rs[i].outcome); i--) n++;
    return n;
  }
  function todaySlots() {
    const k = DP.dayKey();
    const todays = S.tips.filter(function (x) { return !x.daily && !x.duel && !x.exam && DP.dayKey(new Date(x.ts)) === k; }).sort(function (a, b) { return a.ts - b.ts; });
    const out = [];
    for (let i = 0; i < DAILY_LIMIT; i++) {
      const x = todays[i];
      out.push(!x ? '' : !x.resolved ? 'open' : DP.isHit(x.tip, x.outcome) ? 'hit' : 'miss');
    }
    return out;
  }
  /* Abzeichen: alles aus den gemessenen Tipps berechnet, nichts extra gespeichert. */
  const BADGE_DEFS = [
    ['first', '🌱', function (c) { return c.n >= 1; }],
    ['hit1', '🎯', function (c) { return c.hits >= 1; }],
    ['combo3', '🔥', function (c) { return c.maxCombo >= 3; }],
    ['combo5', '⚡', function (c) { return c.maxCombo >= 5; }],
    ['combo10', '🚀', function (c) { return c.maxCombo >= 10; }],
    ['bold', '💎', function (c) { return c.bold; }],
    ['ouch', '🤕', function (c) { return c.ouch; }],
    ['honest', '🧭', function (c) { return c.n >= 10 && c.cal !== null && c.cal >= 85; }],
    ['t10', '🔟', function (c) { return c.n >= 10; }],
    ['t50', '🏅', function (c) { return c.n >= 50; }],
    ['t100', '🏆', function (c) { return c.n >= 100; }],
    ['d3', '📅', function (c) { return c.maxDays >= 3; }],
    ['d7', '👑', function (c) { return c.maxDays >= 7; }],
    ['full', '🃏', function (c) { return c.maxPerDay >= DAILY_LIMIT; }],
    ['world', '🌍', function (c) { return c.topics >= 5; }],
    ['exam', '🎓', function (c) { return c.exams >= 1; }],
    ['pass', '🧳', function (c) { return c.stamps >= 8; }],
    ['duel', '⚔️', function (c) { return c.duelsDone >= 1; }]
  ];
  const SKINS = [['night', 0, '#6a5cff'], ['dawn', 2, '#ff7a1a'], ['aurora', 4, '#19e0a0'], ['storm', 6, '#43c7ff'], ['gold', 8, '#ffd24a']];
  function rankIndex() { return rankFor(DP.stats(resolvedTips()).pts).i; }
  function skinOk(id) { const k = SKINS.filter(function (x) { return x[0] === id; })[0]; return !!k && rankIndex() >= k[1]; }
  function activeSkin() { return skinOk(S.skin) ? S.skin : 'night'; }
  function skinRow() {
    const t = T(), ri = rankIndex();
    return '<div class="levels skins" role="group" aria-label="' + esc(t.skin_title) + '"><span>' + esc(t.skin_title) + '</span>' + SKINS.map(function (k) {
      const ok = ri >= k[1];
      return '<button class="chip skin" data-act="skin" data-v="' + k[0] + '" aria-pressed="' + (activeSkin() === k[0]) + '"' + (ok ? '' : ' disabled title="' + esc(fill(t.skin_locked, { r: t.ranks[k[1]] })) + '"') + '>' +
        '<i style="background:' + k[2] + '"></i>' + (ok ? esc(t.skins[k[0]]) : '🔒') + '</button>';
    }).join('') + '</div>';
  }
  function stampSet(list) {
    const got = {};
    list.forEach(function (r) { if (r.resolved && r.claim && r.claim.city && DP.isHit(r.tip, r.outcome)) got[r.claim.city] = 1; });
    return Object.keys(got);
  }
  function passShelf() {
    const t = T(), got = stampSet(S.tips);
    let h = '<details class="dark shelf"' + (got.length ? ' open' : '') + '><summary>' + esc(t.pass_title) + ' <span class="count">' + got.length + ' / ' + CITIES.length + '</span></summary><div class="grid stamps">';
    CITIES.forEach(function (c) {
      const on = got.indexOf(c.id) >= 0;
      h += '<div class="bdg' + (on ? ' on' : '') + '"><span class="e" aria-hidden="true">' + (on ? c.flag : '🔒') + '</span><b>' + esc(c[S.lang]) + '</b></div>';
    });
    return h + '</div><p class="small" style="margin-top:10px">' + esc(t.pass_help) + '</p></details>';
  }
  function badgeCtx(list) {
    const rs = list.filter(function (r) { return r.resolved; }).sort(function (a, b) { return a.ts - b.ts; });
    let combo = 0, maxCombo = 0, bold = false, ouch = false;
    const perDay = {}, topics = {};
    rs.forEach(function (r) {
      const hit = DP.isHit(r.tip, r.outcome);
      combo = hit ? combo + 1 : 0; if (combo > maxCombo) maxCombo = combo;
      if (hit && r.conf === 100 && (r.level || 'l') === 'l') bold = true;
      if (!hit && r.conf >= 90) ouch = true;
      const k = DP.dayKey(new Date(r.ts)); perDay[k] = (perDay[k] || 0) + 1;
      topics[r.claim.tpl] = 1;
    });
    const days = Object.keys(perDay).sort();
    let maxDays = 0, run = 0, prev = null;
    days.forEach(function (d) { run = prev && DP.addDays(prev, 1) === d ? run + 1 : 1; if (run > maxDays) maxDays = run; prev = d; });
    const st = DP.stats(rs);
    return { n: rs.length, hits: st.hits, cal: st.calibration, maxCombo: maxCombo, bold: bold, ouch: ouch, maxDays: maxDays,
      exams: (S.exams || []).length, stamps: stampSet(list).length, duelsDone: Object.keys(S.duels || {}).filter(function (k) { return S.duels[k].done; }).length, maxPerDay: Math.max(0, Math.max.apply(null, days.map(function (d) { return perDay[d]; }).concat([0]))), topics: Object.keys(topics).length };
  }
  function earnedBadges(list) {
    const c = badgeCtx(list);
    return BADGE_DEFS.filter(function (b) { return b[2](c); }).map(function (b) { return b[0]; });
  }
  function badgeShelf() {
    const t = T();
    const have = earnedBadges(S.tips);
    let h = '<details class="dark shelf"' + (have.length ? ' open' : '') + '><summary>' + esc(t.badges_title) + ' <span class="count">' + have.length + ' / ' + BADGE_DEFS.length + '</span></summary><div class="grid">';
    BADGE_DEFS.forEach(function (b) {
      const on = have.indexOf(b[0]) >= 0, txt = t.badges[b[0]];
      h += '<div class="bdg' + (on ? ' on' : '') + '" title="' + esc(txt[1]) + '"><span class="e" aria-hidden="true">' + (on ? b[1] : '🔒') + '</span><b>' + esc(txt[0]) + '</b><small>' + esc(txt[1]) + '</small></div>';
    });
    return h + '</div></details>';
  }
  function newBadges(r) {
    const before = earnedBadges(S.tips.filter(function (x) { return x.id !== r.id; }));
    return earnedBadges(S.tips).filter(function (id) { return before.indexOf(id) < 0; });
  }

  /* Töne: kleine Pieptöne aus dem Browser, abschaltbar. */
  let audio = null;
  function sfx(kind) {
    if (S.mute) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audio = audio || new AC();
      if (audio.state === 'suspended') audio.resume();
      const seq = { hit: [[523, 0], [659, .09], [784, .18]], miss: [[300, 0], [220, .12]], tap: [[440, 0]], up: [[523, 0], [659, .08], [784, .16], [1046, .26]] }[kind] || [];
      seq.forEach(function (n) {
        const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + n[1];
        o.type = kind === 'miss' ? 'sawtooth' : 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + .02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + .22);
        o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + .25);
      });
    } catch (e) { /* kein Ton */ }
  }
  function signed(n) { return n > 0 ? '+' + n : String(n).replace('-', '−'); }

  function langs(withFaq) {
    return '<div class="langs">' +
      (withFaq ? '<button class="chip faq" data-act="faq" aria-label="' + esc(T().faq_title) + '">' + '<span class="f-long">' + esc(T().faq_btn) + '</span><span class="f-short" aria-hidden="true">?</span></button>' : '') +
      '<button class="chip" data-act="lang" data-v="de" aria-pressed="' + (S.lang === 'de') + '">DE</button>' +
      '<button class="chip" data-act="lang" data-v="en" aria-pressed="' + (S.lang === 'en') + '">EN</button>' +
      '<button class="chip" data-act="sound" aria-label="' + esc(S.mute ? T().sound_on : T().sound_off) + '">' + (S.mute ? '🔇' : '🔊') + '</button></div>';
  }
  const THUMB = '<svg class="print-logo" viewBox="-60 -60 120 120" aria-hidden="true" focusable="false"><g transform="rotate(-12)" fill="none" stroke="#fbfbff" stroke-width="6" stroke-linecap="round"><ellipse rx="11" ry="15"/><ellipse rx="21" ry="29" stroke-dasharray="120 14 40 10"/><ellipse rx="31" ry="43" stroke-dasharray="150 12 70 16"/><ellipse rx="41" ry="57" stroke-dasharray="200 14 100 20" opacity=".7"/><circle r="4" fill="#ffd24a" stroke="none"/></g></svg>';
  function header() { return '<header class="top"><div><div class="brand">' + THUMB + '<h1 class="mark">' + esc(T().title) + '</h1></div><p class="tagline">' + esc(T().tagline) + '</p></div>' + langs(true) + '</header>'; }
  function topbar() {
    const n = Math.min(DAILY_LIMIT, todayCount());
    let d = '<div class="dots" role="img" aria-label="' + n + ' / ' + DAILY_LIMIT + '">';
    for (let i = 0; i < DAILY_LIMIT; i++) d += '<i class="' + (i < n ? 'on' : '') + '"></i>';
    return '<header class="top">' + d + '</div>' + langs() + '</header>';
  }

  function rulesSheet() {
    const t = T();
    let h = '<details class="sheet"' + '><summary>' + esc(t.rules_title) + '</summary><ol class="howto">';
    const lv = t.lv[lvl()];
    t.howto.forEach(function (r, i) { h += '<li>' + esc(i === 2 && lv ? lv.how3 : r) + '</li>'; });
    h += '</ol><p class="goal">' + esc(lv ? lv.goal : t.rules_goal) + '</p>';
    h += '<table class="scale"><thead><tr><th>' + esc(t.rules_cols[0]) + '</th><th>' + esc(t.rules_cols[1]) + '</th><th>' + esc(t.rules_cols[2]) + '</th></tr></thead><tbody>';
    (lvl() === 's' ? [50, 75, 100] : [50, 60, 70, 80, 90, 100]).forEach(function (c) {
      const w = lvl() === 's' ? confWord(c) : null;
      const label = w ? w : c + ' %' + (c === 50 ? ' (' + t.conf50 + ')' : c === 100 ? ' (' + t.conf100 + ')' : '');
      h += '<tr><td>' + esc(label) + '</td><td class="hit">' + signed(DP.points(true, c, true, lvl())) + '</td><td class="miss">' + signed(DP.points(true, c, false, lvl())) + '</td></tr>';
    });
    h += '</tbody></table><p class="small">' + esc(t.rules_foot) + '</p><ul class="howto more">' + t.rules_more.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></details>';
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

    const rk = rankFor(st.pts), sk = streakDays();
    h += '<div class="cols"><div class="col col-a">';
    h += '<div class="hero"><b class="hero-n">' + signed(st.pts) + '</b><span class="hero-l">' + esc(t.stat_pts) + '</span>' +
      '<div class="rank"><div class="rank-top"><b>' + esc(rk.name) + '</b>' + (sk ? '<span class="flame">🔥 ' + esc(sk === 1 ? t.streak_1 : fill(t.streak_n, { n: sk })) + '</span>' : '') + '</div>' +
      '<div class="rank-bar" role="img" aria-label="' + esc(rk.name) + '"><i style="width:' + rk.pct + '%"></i></div>' +
      (rk.pending ? '<small>' + esc(fill(t.exam_ready, { r: T().ranks[rk.pending] })) + '</small>' +
        (S.examActive ? '<button class="btn pulse" data-act="exam-start">' + esc(fill(t.exam_cont, { i: examRecs(S.examActive.key).length })) + '</button>'
          : S.examDay === utcKey() ? '<small class="warn">' + esc(t.exam_tomorrow) + '</small>' : '<button class="btn pulse" data-act="exam-start">' + esc(t.exam_start) + '</button>')
        : '<small>' + esc(rk.next === null ? t.top_rank : fill(t.to_next, { n: rk.toNext, r: rk.nextName })) + '</small>') +
      '<p class="lore">' + esc(t.rank_lore[rk.i]) + '</p></div>' +
      '<div class="hero-sub"><span>' + (st.total ? Math.round(st.hitRate * 100) + ' %' : '–') + ' ' + esc(t.stat_hit) + '</span>' +
      '<span>' + esc(t.stat_cal) + ' ' + (st.calibration === null ? '–' : st.calibration + ' %') + '</span></div></div>';
    h += typeCard();
    h += '<div class="levels" role="group" aria-label="' + esc(t.lvl_title) + '"><span>' + esc(t.lvl_title) + '</span>' +
      ['s', 'm', 'l'].map(function (k) { return '<button class="chip" data-act="level" data-v="' + k + '" aria-pressed="' + (lvl() === k) + '">' + esc(t.lvl[k]) + '</button>'; }).join('') + '</div>';
    h += skinRow();
    h += '</div><div class="col col-b">';
    if (left > 0) h += '<button class="btn pulse" data-act="start">' + esc(firstRun() ? t.first_go : t.go) + '</button>';
    const dKey = utcKey(), dDone = dailyTip(dKey);
    h += '<section class="daily"><div><b>' + esc(t.daily_title) + ' #' + dailyNumber(dKey) + '</b><small>' + esc(t.daily_sub) + '</small></div>' +
      (dDone && dDone.resolved ? '<div class="daily-res"><span>' + dailyRow() + '</span><button class="chip" data-act="share-daily">' + esc(t.share) + '</button></div>'
        : dDone ? '<span class="small">…</span>' : '<button class="chip go" data-act="daily">' + esc(t.daily_go) + '</button>') + '</section>';
    h += duelCard();
    h += '<div class="slots" role="img" aria-label="' + esc(fill(t.left, { n: left })) + '">' + todaySlots().map(function (k) { return '<i class="' + k + '"></i>'; }).join('') + '</div>';
    if (left > 0) h += '<p class="hint">' + esc(fill(t.left, { n: left })) + '</p>';
    else h += '<p class="small" style="margin:14px 0 0;text-align:center">' + esc(t.goDone) + '</p>';

    if (!S.tips.length) h += '<section class="story"><h2>' + esc(t.story_title) + '</h2><p>' + esc(t.story) + '</p></section>';
    h += rulesSheet();
    h += badgeShelf();
    h += passShelf();

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
    h += '</div></div>';
    return h;
  }

  function viewFaq() {
    const t = T();
    let h = '<header class="top"><button class="chip" data-act="faq-close">← ' + esc(t.faq_back) + '</button>' + langs() + '</header>';
    h += '<main class="stage faq"><h2 class="faq-h">' + esc(t.faq_title) + '</h2>';
    t.faq.forEach(function (x) { h += '<details class="sheet dark"><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; });
    return h + '</main>';
  }

  function viewTip() {
    const t = T();
    return topbar() + '<main class="stage"><div class="deck"><div class="swipe" id="swipe">' +
      '<div class="tint yes"></div><div class="tint no"></div>' +
      '<span class="stamp yes">' + esc(t.yes) + '!</span><span class="stamp no">' + esc(t.no) + '!</span>' +
      '<p class="claim-big" lang="' + S.lang + '">' + esc(claimText(ui.claim, S.lang)) + '</p>' + (ui.practice ? '<span class="finger" aria-hidden="true">👆</span>' : '') + '</div></div>' +
      (ui.practice ? '<p class="hint practice">' + esc(t.pr_swipe) + '</p>' : '<p class="hint">' + esc(t.swipe_hint) + '</p>') +
      '<div class="thumbs">' +
      '<button class="thumb" data-act="tip" data-v="0"><span class="emoji" aria-hidden="true">👎</span>' + esc(t.no) + '</button>' +
      '<button class="thumb" data-act="tip" data-v="1"><span class="emoji" aria-hidden="true">👍</span>' + esc(t.yes) + '</button></div>' +
      '<button class="linkbtn" data-act="home">' + esc(ui.practice ? t.home : t.cancel) + '</button></main>';
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
      '<p class="small' + (ui.practice ? ' practice' : '') + '" style="margin-top:10px">' + esc(ui.practice ? t.pr_conf : (t.lv[lvl()] ? t.lv[lvl()].hint : t.conf_hint)) + '</p>' +
      '<div class="spacer"></div>';
    if (ui.busy) h += '<p class="hint" style="margin-top:12px">' + esc(t.measuring) + '</p>';
    if (ui.error) h += '<div class="notice" style="margin-top:12px">' + esc(t.err) + '</div><button class="btn" data-act="retry">' + esc(t.retry) + '</button>';
    else h += '<button class="btn" data-act="measure"' + (ui.busy ? ' disabled' : '') + '>' + esc(t.measure) + '</button>';
    if (!ui.busy && ui.backFor !== ui.claim) h += '<button class="btn ghost" data-act="back">← ' + esc(t.back) + '</button>';
    h += '<button class="linkbtn" data-act="home">' + esc(ui.practice ? t.home : t.cancel) + '</button></main>';
    return h;
  }

  /* ---------- Duell: gleiche fünf Behauptungen per Link, Ergebnis des Freundes steckt im Link (nach dem #, geht nie an einen Server) ---------- */
  function duelClaims(seed) { return claimsFromSeed('duell:' + seed, 5); }
  function duelRecs(seed) { return S.tips.filter(function (t) { return t.duel === seed; }).sort(function (a, b) { return a.ts - b.ts; }); }
  function duelToday() { return Object.keys(S.duels || {}).some(function (k) { return S.duels[k].day === utcKey(); }); }
  function rowEmoji(row) { return row.split('').map(function (c) { return c === 'h' ? '🟩' : '🟥'; }).join(''); }
  function readInvite() {
    const m = /[#&]d=([a-z0-9]{4,12})(?:&o=([hm]{5}))?(?:&p=(-?\d{1,4}))?/i.exec(location.hash || '');
    ui.invite = m ? { seed: m[1].toLowerCase(), row: m[2] || null, pts: m[3] === undefined ? null : Number(m[3]) } : null;
  }
  function startDuelClaim() {
    const a = S.duelActive;
    if (!a) return;
    const i = duelRecs(a.seed).length;
    if (i >= 5) { finishDuel(a.seed); return; }
    ui.duel = { seed: a.seed, i: i }; ui.daily = null; ui.claim = duelClaims(a.seed)[i];
    ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip'; render();
  }
  function finishDuel(seed) {
    const recs = duelRecs(seed);
    const d = S.duels[seed] || (S.duels[seed] = { day: utcKey() });
    d.row = recs.map(function (r) { return DP.isHit(r.tip, r.outcome) ? 'h' : 'm'; }).join('');
    d.pts = recs.reduce(function (a, r) { return a + (r.pts || 0); }, 0);
    d.done = true;
    S.duelActive = null; save(S);
    ui.duel = null; ui.duelEnd = seed; ui.view = 'duelend'; render();
  }
  function duelLink(seed) {
    const d = S.duels[seed];
    return location.origin + location.pathname + '#d=' + seed + '&o=' + d.row + '&p=' + d.pts;
  }
  function shareDuel(seed) {
    const t = T(), d = S.duels[seed];
    if (!d || !d.done) return;
    const text = fill(t.duel_share_text, { row: rowEmoji(d.row), p: signed(d.pts) }) + '\n' + duelLink(seed);
    if (navigator.share) { navigator.share({ text: text }).catch(function () { /* abgebrochen */ }); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { say(t.share_copied); });
  }
  function viewDuelEnd() {
    const t = T(), seed = ui.duelEnd, d = S.duels[seed];
    let verdict = '';
    if (d.opp) verdict = d.pts > d.opp.pts ? t.duel_win : d.pts < d.opp.pts ? t.duel_lose : t.duel_draw;
    let h = topbar() + '<main class="stage"><p class="small-claim">' + esc(t.duel_title) + '</p>' +
      '<p class="big-word" style="font-size:clamp(3rem,15vw,5rem)">' + esc(verdict || t.duel_you) + '</p>' +
      '<div class="vs"><div><small>' + esc(t.duel_you) + '</small><b>' + rowEmoji(d.row) + '</b><span>' + signed(d.pts) + '</span></div>' +
      (d.opp ? '<div><small>' + esc(t.duel_them) + '</small><b>' + rowEmoji(d.opp.row) + '</b><span>' + signed(d.opp.pts) + '</span></div>' : '') + '</div>';
    if (!d.opp) h += '<p class="said">' + esc(t.duel_waiting) + '</p>';
    h += '<div class="spacer"></div><button class="btn" data-act="share-duel">' + esc(t.share) + '</button>' +
      '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></main>';
    return h;
  }

  /* ---------- Aufstiegsprüfung: ab Daumen-Kenner schalten Ränge erst nach drei schweren Behauptungen frei ---------- */
  function examClaims(key) { return claimsFromSeed('pruefung:' + key, 3); }
  function examRecs(key) { return S.tips.filter(function (t) { return t.exam === key; }).sort(function (a, b) { return a.ts - b.ts; }); }
  function startExamClaim() {
    const a = S.examActive;
    if (!a) return;
    const i = examRecs(a.key).length;
    if (i >= 3) { finishExam(); return; }
    ui.exam = { key: a.key, i: i }; ui.daily = null; ui.duel = null; ui.claim = examClaims(a.key)[i];
    ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip'; render();
  }
  function finishExam() {
    const a = S.examActive;
    const hits = examRecs(a.key).filter(function (r) { return DP.isHit(r.tip, r.outcome); }).length;
    const passed = hits >= 2;
    if (passed && (S.exams || []).indexOf(a.g) < 0) S.exams = (S.exams || []).concat(a.g);
    S.examResult = { g: a.g, passed: passed, hits: hits, row: examRecs(a.key).map(function (r) { return DP.isHit(r.tip, r.outcome) ? 'h' : 'm'; }).join('') };
    S.examActive = null; save(S);
    ui.exam = null; ui.view = 'examend'; render();
  }
  function viewExamEnd() {
    const t = T(), r = S.examResult;
    let h = topbar() + '<main class="stage"><p class="small-claim">' + esc(t.exam_title) + '</p>' +
      '<p class="big-word" style="font-size:clamp(3rem,15vw,5rem)">' + esc(r.passed ? t.exam_pass : t.exam_fail) + '</p>' +
      '<div class="vs"><div><small>' + r.hits + ' / 3</small><b>' + rowEmoji(r.row) + '</b></div></div>' +
      '<p class="said">' + esc(r.passed ? fill(t.exam_newrank, { r: t.ranks[r.g] }) + '. ' + t.rank_lore[r.g] : t.exam_again) + '</p>' +
      '<div class="spacer"></div><button class="btn" data-act="home">' + esc(t.home) + '</button></main>';
    return h;
  }

  function duelCard() {
    const t = T();
    let inner, a = S.duelActive;
    const last = Object.keys(S.duels || {}).filter(function (k) { return S.duels[k].done && S.duels[k].day === utcKey(); })[0];
    if (a) inner = '<div><b>⚔️ ' + esc(t.duel_title) + '</b><small>' + esc(t.duel_sub) + '</small></div><button class="chip go" data-act="duel-continue">' + esc(fill(t.duel_cont, { i: duelRecs(a.seed).length })) + '</button>';
    else if (ui.invite && !(S.duels[ui.invite.seed] && S.duels[ui.invite.seed].done)) {
      inner = '<div><b>⚔️ ' + esc(t.duel_invite) + '</b><small>' + (ui.invite.row ? esc(fill(t.duel_friend, { row: rowEmoji(ui.invite.row), p: signed(ui.invite.pts || 0) })) : esc(t.duel_sub)) + '</small></div><button class="chip go" data-act="duel-accept">' + esc(t.duel_accept) + '</button>';
    }
    else if (last) inner = '<div><b>⚔️ ' + esc(t.duel_title) + '</b><small>' + rowEmoji(S.duels[last].row) + ' ' + signed(S.duels[last].pts) + '</small></div><button class="chip" data-act="duel-show" data-v="' + esc(last) + '">' + esc(t.duel_show) + '</button>';
    else inner = '<div><b>⚔️ ' + esc(t.duel_new) + '</b><small>' + esc(t.duel_sub) + '</small></div><button class="chip go" data-act="duel-new">' + esc(t.go) + '</button>';
    return '<section class="daily duel">' + inner + '</section>';
  }
  /* Daumen-Typ: Wie gut passt die Sicherheit zur Trefferquote? Ab 10 gemessenen Tipps. */
  function thumbType() {
    const rs = resolvedTips();
    if (rs.length < 10) return { more: 10 - rs.length };
    const avg = rs.reduce(function (a, r) { return a + r.conf; }, 0) / rs.length / 100;
    const hit = rs.filter(function (r) { return DP.isHit(r.tip, r.outcome); }).length / rs.length;
    const gap = avg - hit;
    const key = avg <= 0.58 ? 'coin' : gap > 0.08 ? 'wolf' : gap < -0.08 ? 'turtle' : avg >= 0.75 ? 'falcon' : 'fox';
    return { key: key, avg: Math.round(avg * 100), hit: Math.round(hit * 100) };
  }
  function typeCard() {
    const t = T(), ty = thumbType();
    if (ty.more) return '<section class="typecard"><b>' + esc(t.type_title) + '</b><small>' + esc(fill(t.type_more, { n: ty.more })) + '</small></section>';
    const d = t.types[ty.key];
    return '<section class="typecard on"><div class="te" aria-hidden="true">' + d[0] + '</div><div><small>' + esc(t.type_title) + '</small><b>' + esc(d[1]) + '</b><p>' + esc(d[2]) + '</p><small>' +
      esc(fill(t.type_stats, { c: ty.avg, h: ty.hit })) + '</small></div><button class="chip" data-act="share-type">' + esc(t.share) + '</button></section>';
  }
  function shareType() {
    const t = T(), ty = thumbType();
    if (ty.more) return;
    const d = t.types[ty.key];
    const text = fill(t.type_share, { e: d[0], n: d[1], d: d[2] }) + '\n' + location.origin + location.pathname;
    if (navigator.share) { navigator.share({ text: text }).catch(function () { /* abgebrochen */ }); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { say(t.share_copied); });
  }
  function dailyRow() {
    let row = '';
    for (let i = 6; i >= 0; i--) {
      const d = dailyTip(utcKey(-i));
      row += !d || !d.resolved ? '⬜' : DP.isHit(d.tip, d.outcome) ? '🟩' : '🟥';
    }
    return row;
  }
  function shareDaily() {
    const t = T(), key = utcKey(), d = dailyTip(key);
    if (!d || !d.resolved) return;
    const text = fill(t.share_head, { n: dailyNumber(key) }) + ' ' + dailyRow() + '\n' + claimText(d.claim, S.lang) + '\n' +
      fill(t.share_pts, { p: signed(d.pts) }) + '\n' + location.origin + location.pathname;
    if (navigator.share) { navigator.share({ text: text }).catch(function () { /* abgebrochen */ }); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { say(t.share_copied); });
  }

  function badges(r, hit) {
    const t = T();
    const out = [];
    const all = resolvedTips();
    const total = all.reduce(function (a, x) { return a + (x.pts || 0); }, 0);
    const before = rankFor(total - (r.pts || 0)), after = rankFor(total);
    newBadges(r).forEach(function (id) {
      const b = BADGE_DEFS.filter(function (x) { return x[0] === id; })[0];
      out.push('<span class="badge up">' + b[1] + ' ' + esc(t.badge_new) + ': ' + esc(t.badges[id][0]) + '</span>');
    });
    if (after.i > before.i) out.push('<span class="badge up">⭐ ' + esc(fill(t.rankup, { r: after.name })) + '</span>');
    const combo = comboCount();
    if (hit && combo >= 2) out.push('<span class="badge">🔥 ' + esc(fill(t.combo_n, { n: combo })) + '</span>');
    const k = DP.dayKey(new Date(r.ts));
    const firstToday = all.filter(function (x) { return DP.dayKey(new Date(x.ts)) === k; }).length === 1;
    const sk = streakDays();
    if (firstToday && sk >= 2) out.push('<span class="badge">🔥 ' + esc(fill(t.streak_n, { n: sk })) + '</span>');
    if (after.i > before.i) out.push('<span class="lore-line">' + esc(t.rank_lore[after.i]) + '</span>');
    return out.length ? '<div class="badges">' + out.join('') + '</div>' : '';
  }

  function reportRow(r) {
    const t = T();
    if ((S.reports || []).some(function (x) { return x.id === r.id; })) return '<p class="report done">' + esc(t.rep_thanks) + '</p>';
    return '<div class="report"><span>' + esc(t.rep_q) + '</span>' +
      ['unclear', 'boring', 'odd'].map(function (k) { return '<button class="chip" data-act="report" data-v="' + k + '">' + esc(t['rep_' + k]) + '</button>'; }).join('') + '</div>';
  }
  function viewResult() {
    const t = T();
    const r = ui.result;
    const hit = DP.isHit(r.tip, r.outcome);
    if (r.practice) {
      return topbar() + '<main class="stage"><p class="small-claim">' + esc(claimText(r.claim, S.lang)) + '</p>' +
        '<p class="big-word">' + esc(hit ? t.hit : t.miss) + '</p>' +
        '<div class="points"><span id="pn" data-v="0">0</span><small>' + esc(t.pr_unit) + '</small></div>' +
        '<p class="said">' + esc(t.pr_done) + '</p><div class="spacer"></div>' +
        '<button class="btn" data-act="start">' + esc(t.pr_next) + '</button>' +
        '<button class="btn ghost" data-act="home">' + esc(t.home) + '</button></main>';
    }
    return topbar() + '<main class="stage">' +
      '<p class="small-claim">' + esc(claimText(r.claim, S.lang)) + '</p>' +
      '<p class="big-word">' + esc(hit ? t.hit : t.miss) + '</p>' +
      '<div class="points"><span id="pn" data-v="' + r.pts + '">' + signed(r.pts) + '</span><small>' + esc(t.pts_unit) + '</small></div>' +
      '<p class="said">' + esc(r.outcome ? t.truth_yes : t.truth_no) + ' ' + esc((r.level === 's' || r.level === 'm') ? fill(t.you_tipped_w, { tip: r.tip ? t.yes : t.no, conf: confWord(r.conf, r.level).toLowerCase() }) : fill(t.you_tipped, { tip: r.tip ? t.yes : t.no, conf: r.conf })) + '</p>' +
      badges(r, hit) +
      '<div class="measure"><b>' + esc(t.measured) + ':</b> ' + esc(measuredText(r.claim, r.shown, S.lang)) +
      '<span class="small"><b>' + esc(t.rule) + ':</b> ' + esc(ruleText(r.claim, S.lang)) + '</span></div>' +
      reportRow(r) +
      '<div class="spacer"></div>' +
      (r.exam ? '<button class="btn" data-act="exam-next">' + esc(examRecs(r.exam).length >= 3 ? t.exam_eval : fill(t.exam_next, { i: examRecs(r.exam).length })) + '</button>' : r.duel ? '<button class="btn" data-act="duel-next">' + esc(duelRecs(r.duel).length >= 5 ? t.duel_eval : fill(t.duel_next, { i: duelRecs(r.duel).length })) + '</button>' : r.daily ? '<button class="btn" data-act="share-daily">' + esc(t.share) + '</button>' : (todayCount() < DAILY_LIMIT ? '<button class="btn" data-act="start">' + esc(t.next) + '</button>' : '')) +
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
    sfx(hit ? 'hit' : 'miss');
    try { const rr = ui.result, tt = resolvedTips().reduce(function (a, x) { return a + (x.pts || 0); }, 0); if (rankFor(tt).i > rankFor(tt - (rr.pts || 0)).i || newBadges(rr).length) setTimeout(function () { sfx('up'); }, 450); } catch (e) { /* egal */ }
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
    const views = { faq: viewFaq, home: viewHome, tip: viewTip, conf: viewConf, result: viewResult, later: viewLater, duelend: viewDuelEnd, examend: viewExamEnd };
    const theme = themeFor();
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-view', ui.view);
    document.body.setAttribute('data-skin', activeSkin());
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_HEX[theme]);
    try { root.innerHTML = views[ui.view](); } catch (err) {
      root.innerHTML = '<main class="stage"><p class="big-word" style="font-size:clamp(2rem,10vw,3.4rem)">Hoppla.</p><p class="said">Hier ist etwas schiefgelaufen. Deine Tipps sind sicher. / Something went wrong. Your tips are safe.</p><button class="btn" data-act="repair">OK</button><p class="small" style="opacity:.6">' + esc(String(err && err.message || err).slice(0, 160)) + '</p></main>';
    }
    const t = T();
    document.getElementById('foot').innerHTML =
      '<div class="links">' + esc(t.made_by) + ' <a href="https://dreierlabs.com/" rel="noopener"><b>Dreier Labs</b></a> · <a href="https://dreierlabs.com/impressum.html" rel="noopener">' + esc(t.imprint) + '</a> · ' +
      '<details><summary>' + esc(t.privacy) + '</summary><p>' + esc(t.privacy_text) + '</p></details></div>' +
      '<p class="credit">' + esc(t.data_credit) + '</p>';
    window.scrollTo(0, 0);
    if (ui.view === 'result') { countUp(); celebrate(DP.isHit(ui.result.tip, ui.result.outcome)); }
  }

  function chooseTip(yes) {
    ui.tip = yes; ui.view = 'conf'; ui.error = false; render(); sfx('tap');
  }

  /* ---------- Sichern und Laden ---------- */
  function exportJson() { return JSON.stringify({ app: 'daumenprobe', v: 1, tips: S.tips, reports: S.reports || [] }); }
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
      const have = {};
      (S.reports || []).forEach(function (x) { have[x.id] = 1; });
      S.reports = (S.reports || []).concat((Array.isArray(inc.reports) ? inc.reports : []).filter(function (x) { return x && x.id && x.k && validClaim(x.claim) && !have[x.id]; }));
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
    else if (act === 'sound') { S.mute = !S.mute; save(S); render(); sfx('tap'); }
    else if (act === 'repair') { S.current = null; S.duelActive = null; S.examActive = null; ui.view = 'home'; ui.claim = null; ui.result = null; ui.busy = false; save(S); render(); }
    else if (act === 'report') {
      const r = ui.result;
      if (r && ui.view === 'result' && ['unclear', 'boring', 'odd'].indexOf(v) >= 0 && !(S.reports || []).some(function (x) { return x.id === r.id; })) {
        S.reports = (S.reports || []).concat([{ id: r.id, k: v, tpl: r.claim.tpl, claim: r.claim, shown: r.shown, text: claimText(r.claim, 'de'), ts: Date.now() }]);
        save(S);
        const box = el.closest('.report');
        if (box) { box.className = 'report done'; box.innerHTML = esc(T().rep_thanks); }
      }
    }
    else if (act === 'skin') { if (skinOk(v)) { S.skin = v; save(S); render(); } }
    else if (act === 'level') { if (STEPS[v]) { S.level = v; save(S); render(); } }
    else if (act === 'home') {
      ui.practice = false;
      if ((ui.view === 'tip' || ui.view === 'conf') && S.current && !ui.busy) {
        if (ui.error && !ui.daily && !ui.duel && !ui.exam && S.draws && S.draws.length) S.draws.pop(); /* Messung ausgefallen: nicht anrechnen */
        S.current = null; save(S);
      }
      ui.daily = null; ui.duel = null; ui.exam = null; ui.duelEnd = null; ui.view = 'home'; ui.error = false; ui.busy = false; ui.msg = ''; render();
    }
    else if (act === 'daily') {
      const key = utcKey();
      if (dailyTip(key)) return;
      ui.daily = key; ui.claim = dailyClaim(key); ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip';
      S.current = { claim: ui.claim, ts: Date.now(), daily: key };
      save(S); render();
    }
    else if (act === 'share-daily') { shareDaily(); }
    else if (act === 'share-type') { shareType(); }
    else if (act === 'share-duel') { shareDuel(ui.duelEnd); }
    else if (act === 'duel-new' || act === 'duel-accept') {
      if (S.duelActive) { startDuelClaim(); return; }
      if (act === 'duel-accept' && !ui.invite) return;
      const seed = act === 'duel-new' ? Math.random().toString(36).slice(2, 8) : ui.invite.seed;
      if (S.duels[seed] && S.duels[seed].done) { ui.duelEnd = seed; ui.view = 'duelend'; render(); return; }
      if (duelToday()) { ui.msg = T().duel_once; render(); return; }
      const opp = act === 'duel-accept' && ui.invite.row && ui.invite.pts !== null ? { row: ui.invite.row, pts: ui.invite.pts } : null;
      S.duels[seed] = { day: utcKey(), opp: opp }; S.duelActive = { seed: seed };
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* egal */ }
      ui.invite = null; save(S); startDuelClaim();
    }
    else if (act === 'duel-continue' || act === 'duel-next') { startDuelClaim(); }
    else if (act === 'exam-start') {
      if (S.examActive) { startExamClaim(); return; }
      const rk = rankFor(DP.stats(resolvedTips()).pts);
      if (!rk.pending || S.examDay === utcKey()) return;
      S.examDay = utcKey(); S.examActive = { key: rk.pending + ':' + utcKey(), g: rk.pending }; save(S); startExamClaim();
    }
    else if (act === 'exam-next') { startExamClaim(); }
    else if (act === 'duel-show') { ui.duelEnd = v; ui.view = 'duelend'; render(); }
    else if (act === 'start') {
      ui.daily = null;
      if (firstRun()) { ui.practice = true; ui.claim = { tpl: 'practice' }; ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip'; render(); return; }
      if (todayCount() >= DAILY_LIMIT) return;
      ui.claim = newClaim(); ui.tip = null; ui.conf = null; ui.error = false; ui.busy = false; ui.view = 'tip';
      S.current = { claim: ui.claim, ts: Date.now() };
      S.draws = (S.draws || []).concat(Date.now());
      save(S); render();
    }
    else if (act === 'tip') { chooseTip(v === '1'); }
    else if (act === 'faq') { if (!ui.busy) { ui.faqFrom = ui.view; ui.view = 'faq'; render(); } }
    else if (act === 'faq-close') { ui.view = ui.faqFrom && ui.faqFrom !== 'faq' ? ui.faqFrom : 'home'; render(); }
    else if (act === 'back') { if (ui.view === 'conf' && !ui.busy && ui.backFor !== ui.claim) { ui.backFor = ui.claim; ui.tip = null; ui.error = false; ui.view = 'tip'; render(); } }
    else if (act === 'measure') {
      if (ui.busy) return;
      const sl = document.getElementById('sl');
      ui.conf = sl ? steps()[Number(sl.value)] : 50;
      if (ui.practice) { ui.practice = false; S.onbDone = true; save(S); ui.result = { practice: true, claim: ui.claim, tip: ui.tip, conf: ui.conf, outcome: true, pts: 0, level: S.level }; ui.view = 'result'; render(); return; }
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
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) { /* egal */ }
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

  readInvite();
  window.addEventListener('hashchange', function () { readInvite(); if (ui.view === 'home') render(); });
  if (S.current && validClaim(S.current.claim) && DP.dayKey(new Date(S.current.ts)) === DP.dayKey()) {
    ui.claim = S.current.claim; ui.view = 'tip'; ui.daily = S.current.daily || null;
  } else if (S.current) { S.current = null; save(S); }

  render();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* ohne Offline-Hülle weiter */ }); });
  }
})();
