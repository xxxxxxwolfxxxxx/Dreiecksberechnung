# Dreiecksberechnung

Geometrie- und Navigationsrechner mit nachvollziehbarem Lösungsweg und PDF-Export: Dreieck, Viereck-Formen, Körper sowie nautische Peilverfahren.

**Live:** <https://dreieck-berechnen.de>

## Was drin ist

- **Ebene Figuren:** Dreieck (Seiten, Winkel, Fläche, Umfang), Rechteck, Parallelogramm, Raute, Trapez, Kreis
- **Räumliche Körper:** Quader, Würfel, Zylinder, Kegel, Kugel, Pyramide
- **Nautische Peilverfahren:** Kreuzpeilung und Vier-Strich-Peilung (`lib/navigation/`)
- Lösungsweg zu jedem Ergebnis, Hinweise zu Eingabefehlern, PDF-Export (`jspdf`, `html2canvas`)
- Strukturierte Daten (JSON-LD) und Sitemap für die Suchmaschinen

Die Rechenlogik liegt getrennt von der Oberfläche in `lib/shapes/` und `lib/navigation/`.

## Tech-Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Jest und Testing Library · ESLint · Netlify (Node 20)

## Lokal starten

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Produktions-Build
npm start          # Produktions-Build ausliefern
npm run lint
npm test           # Jest
```

Optional lassen sich Werbe- und Analyse-IDs über Umgebungsvariablen setzen (`NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_FUNDING_CHOICES_ID`). Ohne sie läuft die Anwendung unverändert.

## Tests

Die Tests unter `tests/` decken Rechenlogik (`lib/`), Komponenten, Hilfsfunktionen (u. a. PDF-Erzeugung) und die Sitemap ab.

## Hinweis zu den Formeln

Die Rechner verwenden die üblichen geometrischen Formeln und die Verfahren der terrestrischen Navigation. Für die Schifffahrt ersetzen sie keine amtliche Navigation; Eingaben und Ergebnisse sind selbst zu prüfen.

## Lizenz

Es ist keine Lizenz hinterlegt. Der Quellcode steht zur Ansicht; ohne ausdrückliche Lizenz sind Nutzung und Weitergabe nicht erlaubt.
