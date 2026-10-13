# Redesign GeoRechner – Übernahme

Die Dateien in diesem Ordner 1:1 an dieselben Pfade im Projekt kopieren (überschreiben).

## Geänderte Dateien
- app/globals.css – Farb-/Schrift-Tokens (Tailwind v4 `@theme`): `brand-*`, `ink*`, `line*`, `canvas`, `field`, `font-mono`
- app/layout.tsx – IBM Plex Sans/Mono statt Inter, neuer Footer, `max-w-3xl`
- app/page.tsx – Themen-Links & Abstände
- components/Navigation.tsx, MoreShapes.tsx, DreieckFaq.tsx, ShapeInfo.tsx (nur Render-Teil)
- components/calculator/ShapeCalculator.tsx – Kopf + Skizze + Eingabe in einer Karte, Einheiten als Segment-Buttons, Fortschrittsanzeige, „Zurücksetzen“, Export im Ergebnis
- components/calculator/InputPanel.tsx – Dezimalkomma, Gruppierung (nur Dreieck)
- components/calculator/ShapeDrawing.tsx, ResultsPanel.tsx (neue optionale `children`-Prop), FormulaExplainer.tsx, QuizChallenge.tsx, RelatedTriangles.tsx, SpickzettelExport.tsx, DeepExplanation.tsx (nur Render-Teil)
- utils/quizQuestions.ts – Pythagoras-Quiz nutzt echte Seiten; Formel-Fehler in Erklärungen behoben

## Unverändert
Rechenlogik (lib/shapes/*), URL-Parameter, Analytics-Events, AdSense, PDF-Generator, Metadaten/Schema.

## Hinweis
ShapeCalculator, ResultsPanel, ShapeInfo usw. werden auch von den anderen Formen genutzt – die neuen Styles gelten daher automatisch für alle Rechnerseiten.
