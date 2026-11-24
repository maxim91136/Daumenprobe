# Daumenprobe

Erst tippen, dann messen. Man bekommt eine Behauptung über die Wirklichkeit, tippt „stimmt" oder „stimmt nicht", sagt, wie sicher man ist, und danach wird live aus offenen Daten gemessen. Punkte gibt es nur als Spielpunkte, nie Geld.

Status: privat in Entwicklung, noch nicht öffentlich. Teil von Dreier Labs.

## Stand

- Eine statische Seite, kein Server, kein Konto, keine Tracker. Spielstand nur im Browser (localStorage). Installierbar als App (PWA, Offline-Hülle).
- Deutsch und Englisch.
- Für die Allgemeinheit gedacht, auch für Kinder: nichts Kritisches (kein Geld, keine Finanzthemen), keine Altersabfrage. Die drei Schwierigkeitsstufen ändern nur Bedienung und Punkte, schalten aber keine Inhalte frei.
- 26 Behauptungstypen in 8 Kategorien (Wetter und Luft, Erde, Weltraum, Himmel, Zeit, Wissen, Geschichte, Sport), 20 Städte, jede Frage wird aus Vorlage, Stadt und Schwelle frisch gebaut (kein fester Katalog):
  - Wetter, Open-Meteo: Temperatur, Tag/Nacht, Regen, Wind, Windrichtung, Luftdruck, Luftfeuchtigkeit, Bewölkung, „wo ist es wärmer" (Stadtvergleich), Tageslänge (Sonnenaufgang bis Sonnenuntergang, Stadtvergleich)
  - Luftqualität, Open-Meteo (EU-Luftindex)
  - Erdbeben, USGS: Anzahl und Stärke der letzten 24 Stunden
  - Polarlicht-Index (Kp), NOAA SWPC: liest das alte und das neue JSON-Format, neues Format noch nicht live bestätigt
  - Wikipedia-Vergleich, Wikimedia Pageviews: „Welcher Artikel wurde vorgestern öfter aufgerufen?“ Feste, kinderfreundliche Titelliste (deutsche Wikipedia, nur menschliche Aufrufe), Tag = vorgestern nach UTC. Gegen eine nachgestellte Antwort getestet, die echte Schnittstelle ist noch nicht live bestätigt, die Titel sind nicht gegen die Wikipedia geprüft.
  - Geschichte und Sport laufen über denselben Wikipedia-Aufrufe-Vergleich mit eigenen, kinderfreundlichen Titellisten (keine Kriege, keine Personen der jüngeren Gewaltgeschichte). Sport nutzt keine Ergebnisse oder Lizenzdaten, nur Aufrufzahlen von Sportarten, Turnieren und Vereinen.
  - ISS im Sonnenlicht und ISS östlich von Greenwich (wheretheiss.at), Sonnenwind-Geschwindigkeit (NOAA SWPC, 5-Minuten-Werte), Wikipedia-Sprachvergleich „welche Sprache hat mehr Artikel“ (Statistik der jeweiligen Wikipedia, CORS über origin=*). Alle vier gegen nachgestellte Antworten getestet, nicht live bestätigt.
  - ISS-Position, wheretheiss.at
  - Mond (lokal berechnet)
  - „morgen wärmer als heute" (wird einen Tag später aufgelöst)
- Abwechslung: Erst wechselt die Kategorie (Wetter, Luft, Erde, Weltraum, Himmel, Zeit), dann das Thema; die Stadt wechselt auch. Himmel und Zeit werden lokal berechnet (Sonnenhöhe, Ortszeit), ohne Schnittstelle.
- Verklickt: Einmal pro Frage kann man vor dem Messen zurück und neu antworten.
- Tageslimit 10 Behauptungen (Verwerfen und Neuladen zählen mit), danach „Das war's für heute". Kein Push, kein Dauerscrollen.

## Punkte und Stufen

- Punkte pro Stufe der Sicherheit (Schwer, volle Punkte):

  | Sicherheit | 50 | 60 | 70 | 80 | 90 | 100 |
  |---|---|---|---|---|---|---|
  | Treffer | +5 | +6 | +7 | +8 | +9 | +10 |
  | Daneben | -5 | -6 | -8 | -11 | -17 | -30 |

  Treffer wachsen gleichmäßig, die Strafe wächst von Stufe zu Stufe schneller (logarithmische Regel, bei 100 % gedeckelt). Wer seine Sicherheit ehrlich einschätzt, steht auf Dauer am besten da: bei jeder wahren Trefferquote lohnt sich die dazu passende Stufe. Zwischenwerte (75 %) werden gerade verbunden. Alte Tipps wurden einmalig auf diese Tabelle umgerechnet (Punkte-Version 2).
- Stufen: Leicht (Wörter, halbe Punkte, kein Minus), Mittel (Wörter, Treffer drei Viertel, Daneben sechs Zehntel; ehrliches Melden lohnt sich auch hier) und Schwer (Prozent, volle Punkte).
- Regelwerk im Spiel („So geht's“): Frage, Tipp, Sicherheit, Messung, einmal pro Frage zurück vor dem Messen, Punktetabelle, zehn Behauptungen pro Tag, Verwerfen zählt als Versuch, Messregel vorab, Tagesfrage/Duell/Prüfung zählen nicht zu den zehn, nur Spielpunkte.
- Zwei Werte: Trefferquote und Kalibrierung („stimmt meine Sicherheit?", ab 5 Tipps).

## Spielgefühl

Ränge (12 Stufen, an vier Stufen mit Aufstiegsprüfung), 20 Abzeichen (u. a. „Besser eingeschätzt“ und „Wieder da“ fürs Aufholen), Serie mit einem Joker-Tag, Story, Töne und Vibration (abschaltbar), Farbwelten (freigeschaltet über Ränge), Daumen-Typ ab 10 Tipps, Weltreise-Pass (Stempel pro Stadt, 20 Städte, Abzeichen ab 12).

- Tagesfrage: dieselbe Frage für alle auf der Welt (aus dem Datum abgeleitet).
- Duell per Link: 5 gleiche Behauptungen, das Ergebnis steckt im Link nach dem `#` und geht nie an einen Server. Ein Duell pro Tag.
- Aufstiegsprüfung: 3 Behauptungen, mindestens 2 Treffer, ein Versuch pro Tag.
- Wochenanzeige: unter den Chips stehen die Punkte dieser Woche (Montag bis Sonntag) und der Vorwoche, nur lokal, ohne Einfluss auf den Rang. Prüfungen zählen nicht mit.
- „Frage melden" (Unklar, Langweilig, Messung komisch) im Ergebnis. Die Meldung bleibt lokal und steht in der Sicherungsdatei; danach gibt es den Knopf „Per Mail an mich schicken" (mailto an die Adresse aus dem Impressum, nichts geht automatisch raus).

## Hilfe

FAQ-Knopf („?“ auf dem Handy, „FAQ“ auf dem Desktop) oben rechts auf der Startseite mit 12 häufigen Fragen (Deutsch und Englisch).

## Sicherung

Sichern und Laden per Datei oder Code. Browser können Daten löschen (Safari nach etwa 7 Tagen ohne Besuch). Die Sicherung enthält Tipps und Meldungen.

## Design

Auf dem Desktop breites Layout (Startseite in zwei Spalten, Spielansichten zentriert), auf dem Handy eine Spalte. Dunkles Spielkartenfeeling mit Vollbild-Farbflächen pro Ansicht, Wisch-Karte (rechts = stimmt, links = stimmt nicht, auch per Knopf und Pfeiltasten), Sicherheits-Schieber, Ergebnis in Mint (Treffer) oder Pink (Daneben). Logo: Daumenabdruck aus Wetterkarten-Linien (Isobaren) mit gelbem Punkt. Schrift: Bricolage Grotesque (SIL Open Font License, Datei und Lizenz in `fonts/`). Bewegung nur als Antwort auf Eingaben und mit `prefers-reduced-motion` abschaltbar.

## Dateien

- `index.html`, `style.css`, `fonts/`: Oberfläche und Schrift
- `logic.js`: Punkte, Kalibrierung, Messregeln, Mond, Zusammenführen von Sicherungen (ohne Browser-Abhängigkeit, mit Node testbar)
- `app.js`: Ablauf, Texte (DE/EN), Messung per fetch, Speicher, Ränge, Abzeichen, Duell, Prüfung
- `sw.js`, `manifest.webmanifest`, Symbole: PWA
- Auslieferung: Cloudflare Workers (statische Dateien), automatisch bei Push auf `main`; Adresse: https://daumenprobe.com (auch www), die alte workers.dev-Adresse läuft vorerst parallel

## Noch offen

- Live-Test der Messungen im echten Browser: Erdbeben, Luftqualität, Luftdruck, Feuchtigkeit, Bewölkung, Windrichtung (die Entwicklungsumgebung erreicht die Schnittstellen nicht, bisher mit nachgestellten Antworten getestet; die Tageslänge ist live bestätigt).
- Weitere Spielformen und Themenpakete (Daten und Lizenzen vorher prüfen).
- Marke: bewusst später, bisher Hobby. Altersgrenze: keine nötig (kein Konto, keine Einwilligung).

## Prinzipien

Nur Spielpunkte, nie echtes Geld. Nur messbare Behauptungen mit Datenquelle und Messregel vorab. Alles lokal beim Spieler, kein Konto, keine Tracker. Nichts Kritisches, weil auch Kinder mitspielen können.


## Schwierigkeit „Schwer“
Grenzen liegen nahe am Üblichen (Monatsmittel der Stadt für Temperatur, typische Werte für Wind, Luft, Erdbeben, Druck). Wer das Klima kennt, hat einen Vorteil; volle Punkte. Leicht und Mittel behalten die groben Grenzen. Die Monatsmittel sind gerundete Näherungswerte (siehe NORMS in app.js).
