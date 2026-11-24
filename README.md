# Daumenprobe

Erst tippen, dann messen. Man bekommt eine Behauptung über die Wirklichkeit, tippt „stimmt" oder „stimmt nicht", sagt, wie sicher man ist, und danach wird live aus offenen Daten gemessen. Punkte gibt es nur als Spielpunkte, nie Geld.

Status: privat in Entwicklung, noch nicht öffentlich. Teil von Dreier Labs.

## Stand

- Eine statische Seite, kein Server, kein Konto, keine Tracker. Spielstand nur im Browser (localStorage). Installierbar als App (PWA, Offline-Hülle).
- Deutsch und Englisch.
- Für die Allgemeinheit gedacht, auch für Kinder: nichts Kritisches (kein Geld, keine Finanzthemen), keine Altersabfrage. Die drei Schwierigkeitsstufen ändern nur Bedienung und Punkte, schalten aber keine Inhalte frei.
- 16 Behauptungstypen, jede Frage wird aus Vorlage, Stadt und Schwelle frisch gebaut (kein fester Katalog):
  - Wetter, Open-Meteo: Temperatur, Tag/Nacht, Regen, Wind, Windrichtung, Luftdruck, Luftfeuchtigkeit, Bewölkung, „wo ist es wärmer" (Stadtvergleich), Tageslänge (Sonnenaufgang bis Sonnenuntergang, Stadtvergleich)
  - Luftqualität, Open-Meteo (EU-Luftindex)
  - Erdbeben, USGS: Anzahl und Stärke der letzten 24 Stunden
  - ISS-Position, wheretheiss.at
  - Mond (lokal berechnet)
  - „morgen wärmer als heute" (wird einen Tag später aufgelöst)
- Abwechslung: Pro Tag kommt jedes Thema erst wieder, wenn alle durch sind, und die Stadt wechselt.
- Tageslimit 10 Behauptungen (Verwerfen und Neuladen zählen mit), danach „Das war's für heute". Kein Push, kein Dauerscrollen.

## Punkte und Stufen

- Punkte nach Brier-Prinzip: Treffer +5 (geraten) bis +10 (ganz sicher), Daneben -5 bis -20. Münzwerfen bringt im Schnitt 0, ehrliches Einschätzen zahlt sich aus.
- Stufen Leicht (Wörter statt Prozent, halbe Punkte, kein Minus), Mittel (Wörter, 75 %, Minus bis -8) und Schwer (Prozent, volle Punkte).
- Zwei Werte: Trefferquote und Kalibrierung („stimmt meine Sicherheit?", ab 5 Tipps).

## Spielgefühl

Ränge (12 Stufen, an vier Stufen mit Aufstiegsprüfung), 18 Abzeichen, Serie mit einem Joker-Tag, Story, Töne und Vibration (abschaltbar), Farbwelten (freigeschaltet über Ränge), Daumen-Typ ab 10 Tipps, Weltreise-Pass (Stempel pro Stadt).

- Tagesfrage: dieselbe Frage für alle auf der Welt (aus dem Datum abgeleitet).
- Duell per Link: 5 gleiche Behauptungen, das Ergebnis steckt im Link nach dem `#` und geht nie an einen Server. Ein Duell pro Tag.
- Aufstiegsprüfung: 3 Behauptungen, mindestens 2 Treffer, ein Versuch pro Tag.
- „Frage melden" (Unklar, Langweilig, Messung komisch) im Ergebnis. Die Meldungen bleiben lokal und stehen in der Sicherungsdatei.

## Sicherung

Sichern und Laden per Datei oder Code. Browser können Daten löschen (Safari nach etwa 7 Tagen ohne Besuch). Die Sicherung enthält Tipps und Meldungen.

## Design

Dunkles Spielkartenfeeling mit Vollbild-Farbflächen pro Ansicht, Wisch-Karte (rechts = stimmt, links = stimmt nicht, auch per Knopf und Pfeiltasten), Sicherheits-Schieber, Ergebnis in Mint (Treffer) oder Pink (Daneben). Logo: Daumenabdruck aus Wetterkarten-Linien (Isobaren) mit gelbem Punkt. Schrift: Bricolage Grotesque (SIL Open Font License, Datei und Lizenz in `fonts/`). Bewegung nur als Antwort auf Eingaben und mit `prefers-reduced-motion` abschaltbar.

## Dateien

- `index.html`, `style.css`, `fonts/`: Oberfläche und Schrift
- `logic.js`: Punkte, Kalibrierung, Messregeln, Mond, Zusammenführen von Sicherungen (ohne Browser-Abhängigkeit, mit Node testbar)
- `app.js`: Ablauf, Texte (DE/EN), Messung per fetch, Speicher, Ränge, Abzeichen, Duell, Prüfung
- `sw.js`, `manifest.webmanifest`, Symbole: PWA
- Auslieferung: Cloudflare Workers (statische Dateien), automatisch bei Push auf `main`

## Noch offen

- Live-Test der Messungen im echten Browser: Erdbeben, Luftqualität, Luftdruck, Feuchtigkeit, Bewölkung, Windrichtung (die Entwicklungsumgebung erreicht die Schnittstellen nicht, bisher mit nachgestellten Antworten getestet; die Tageslänge ist live bestätigt).
- Weitere Spielformen und Themenpakete (Daten und Lizenzen vorher prüfen).
- Domain und Marke prüfen, Altersgrenze der Datenschutzerklärung klären.

## Prinzipien

Nur Spielpunkte, nie echtes Geld. Nur messbare Behauptungen mit Datenquelle und Messregel vorab. Alles lokal beim Spieler, kein Konto, keine Tracker. Nichts Kritisches, weil auch Kinder mitspielen können.
