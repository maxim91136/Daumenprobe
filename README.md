# Daumenprobe

Erst tippen, dann messen. Man bekommt eine Behauptung über die Wirklichkeit, tippt „stimmt" oder „stimmt nicht", gibt die Sicherheit in Prozent an, und danach wird live aus offenen Daten gemessen. Punkte gibt es nur als Spielpunkte, nie Geld.

Der Name ist vorläufig (Arbeitstitel „Project 7").

## Stand (erste Version)

- Eine statische Seite, kein Server, kein Konto. Spielstand nur im Browser (localStorage).
- Deutsch und Englisch.
- Sechs Behauptungstypen aus offenen Daten: Temperatur, Tag/Nacht, Regen, Wind (Open-Meteo), ISS-Position (wheretheiss.at) und „morgen wärmer als heute" (wird einen Tag später aufgelöst).
- Punkte: Treffer +5 (geraten) bis +10 (ganz sicher), Daneben -5 (geraten) bis -20 (ganz sicher). Münzwerfen bringt im Schnitt 0; wer ehrlich einschätzt, steht auf Dauer am besten da.
- Zwei Werte: Trefferquote und Kalibrierung („stimmt meine Sicherheit?", ab 5 Tipps).
- Tageslimit 5 Behauptungen (Verwerfen und Neuladen zählen mit, eine gezogene Behauptung bleibt nach dem Neuladen dieselbe), danach „Das war's für heute". Kein Push, kein Dauerscrollen.
- Sichern und Laden per Datei oder Code (Browser können Daten löschen, Safari nach etwa 7 Tagen ohne Besuch).

## Dateien

- `index.html`, `style.css`: Oberfläche
- `logic.js`: Punkte, Kalibrierung, Messregeln, Zusammenführen von Sicherungen (ohne Browser-Abhängigkeit, mit Node testbar)
- `app.js`: Ablauf, Texte (DE/EN), Messung per fetch, Speicher

## Noch nicht gebaut

- Gruppen mit Einladungscode und Spitznamen (braucht einen kleinen Server, z. B. Cloudflare Worker mit KV).
- Weitere Themenpakete: Bahn-Pünktlichkeit, Preise, Fußball (nur als Prognosetest). Daten und Lizenzen vorher prüfen.
- Live-Test der Messungen im echten Browser (die Entwicklungsumgebung erreicht die Schnittstellen nicht; getestet wurde mit nachgestellten Antworten).
- Name, Domain und Marke.

## Prinzipien

Nur Spielpunkte, nie echtes Geld. Nur messbare Behauptungen mit Datenquelle und Messregel vorab. Kein Konto, keine Tracker.
