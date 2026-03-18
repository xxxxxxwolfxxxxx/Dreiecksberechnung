# Design-Dokument: Geometrie-Rechner

**Datum:** 2026-03-18
**Projekt:** Dreiecksberechnung / Geometrie-Rechner
**GitHub:** xxxxxxwolfxxxxx/Dreiecksberechnung
**Status:** Genehmigt

---

## 1. Ziel & Kontext

Eine werbefinanzierte Geometrie-Rechner-Website für den deutschen Markt, vergleichbar mit dreieck-berechnen.de. Primäre Zielgruppe: Schüler & Studenten (Mathematik), breite Sekundärzielgruppe. Der Rechner startet mit dem Dreieck als Hauptform und ermöglicht die Navigation zu weiteren geometrischen Formen.

---

## 2. Tech-Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Sprache:** TypeScript
- **Deployment:** Vercel
- **Werbung:** Google AdSense
- **Consent:** Google Funding Choices (kostenlos, IAB TCF 2.2 zertifiziert, AdSense-kompatibel)

---

## 3. Routen & SEO

```
/                    → redirect → /dreieck
/dreieck             → Dreiecks-Rechner (Startseite)
/kreis               → Kreis-Rechner
/rechteck            → Rechteck-Rechner
/trapez              → Trapez-Rechner
/parallelogramm      → Parallelogramm-Rechner
/raute               → Rauten-Rechner
/impressum           → Impressum (Pflicht DE)
/datenschutz         → Datenschutzerklärung (Pflicht DE)
```

**SEO pro Seite:**
- Individueller `<title>`: z.B. „Dreieck berechnen – Fläche, Umfang, Winkel online"
- `<meta description>` mit Haupt-Keyword
- Schema.org `MathSolver`-Markup
- Interne Verlinkung: „Weitere Formen"-Abschnitt auf jeder Seite

**Keyword-Ziele (primär):**

| Route | Haupt-Keyword | Monatl. Suchen (DE) |
|-------|---------------|---------------------|
| /dreieck | dreieck berechnen | ~40.000 |
| /kreis | kreis berechnen | ~30.000 |
| /rechteck | rechteck berechnen | ~20.000 |
| /trapez | trapez berechnen | ~10.000 |
| /parallelogramm | parallelogramm berechnen | ~5.000 |
| /raute | raute berechnen | ~5.000 |

**Technisches SEO:**
- `app/sitemap.ts` → automatische sitemap.xml
- `app/robots.ts` → robots.txt
- Core Web Vitals Zielwerte: LCP < 2,5s, CLS < 0,1, INP < 200ms
- AdSense lazy-loaded nach Viewport-Eintritt (verhindert CLS)

---

## 4. UI/UX Layout

**Seitenstruktur (mobile-first, vertikal):**

```
┌─────────────────────────────────┐
│  Logo + Navigation (Form-Tabs)  │
│  Horizontal scrollbar auf Mobile│
├─────────────────────────────────┤
│  [Ad: Leaderboard 728×90]       │
│  lazy-loaded, feste min-height  │
├─────────────────────────────────┤
│  Eingabe-Bereich                │
│  Felder dynamisch je nach Form  │
│  Einheit: [cm ▼]                │
│  Auto-Berechnung beim Tippen    │
│  + [Berechnen]-Button als Fallb.│
├─────────────────────────────────┤
│  SVG-Zeichnung (live, beschr.)  │
│  Feste Viewport-Höhe, skaliert  │
├─────────────────────────────────┤
│  [Ad: Rectangle 300×250]        │
├─────────────────────────────────┤
│  Ergebnisse                     │
│  Fläche / Umfang / alle Werte   │
├─────────────────────────────────┤
│  Formel-Erklärung (aufklappbar) │
├─────────────────────────────────┤
│  Weitere Formen (interne Links) │
├─────────────────────────────────┤
│  [Ad: Banner unten]             │
└─────────────────────────────────┘
[Cookie-Banner sticky bottom — erster Besuch via Google Funding Choices]
```

**UX-Details:**
- Sofortige Berechnung sobald genug Werte eingegeben (auto-solve)
- Eingabefelder: neutral → grün bei gültigem Wert → rot mit Hinweis bei ungültigem
- SVG: feste Container-Größe, Dreieck skaliert auf max. 90% Breite/Höhe, Mindestbeschriftungsgröße 12px
- Formel-Box standardmäßig eingeklappt
- Mehrdeutige Lösungen (SSW) → beide Dreiecke anzeigen mit Auswahl
- Deutsche Zahlenformatierung: Komma als Dezimaltrennzeichen, max. 4 Nachkommastellen, kein wissenschaftliches Format

---

## 5. Werbung & DSGVO-Consent

**Consent-Lösung: Google Funding Choices**
- Kostenlos, IAB TCF 2.2 zertifiziert
- Direkte Integration mit AdSense (kein manuelles TC-String-Handling nötig)
- Einbindung via `<script>` im `<head>` (Next.js Script-Komponente mit `strategy="beforeInteractive"`)
- Google übernimmt die Consent-Signalisierung an AdSense automatisch

**Werbeprinzip:**
- Werbung wird immer angezeigt — Ad-Slots sind immer im DOM mit fester min-height (verhindert CLS)
- **Mit Consent:** personalisierte AdSense-Werbung
- **Ohne Consent:** nicht-personalisierte AdSense-Werbung (NPA-Modus via TCF-Signal)

**Pflichtseiten:**
- `/impressum` — Angaben gemäß § 5 TMG
- `/datenschutz` — DSGVO-konforme Datenschutzerklärung inkl. AdSense/Funding Choices

---

## 6. Komponenten-Architektur

**Server vs. Client Components:**

| Komponente | Typ | Begründung |
|-----------|-----|-----------|
| `app/*/page.tsx` | Server Component | SEO-Metadaten, kein interaktiver State |
| `ShapeCalculator` | Client Component | Eingabe-State, live Berechnung |
| `Navigation` | Client Component | aktive Route (usePathname) |
| `AdSlot` | Client Component | AdSense-Script, Consent-abhängig |
| `CookieBanner` | — | entfällt, Google Funding Choices übernimmt |

**Verzeichnisstruktur:**
```
app/
├── layout.tsx              ← Root: Navigation, AdSense/Funding-Choices-Script
├── sitemap.ts              ← automatische sitemap.xml
├── robots.ts               ← robots.txt
├── page.tsx                ← redirect → /dreieck
├── dreieck/page.tsx
├── kreis/page.tsx
├── rechteck/page.tsx
├── trapez/page.tsx
├── parallelogramm/page.tsx
├── raute/page.tsx
├── impressum/page.tsx
└── datenschutz/page.tsx

components/
├── Navigation.tsx          ← Form-Tabs, usePathname
├── AdSlot.tsx              ← AdSense-Einheit, lazy mit IntersectionObserver
│
└── calculator/
    ├── ShapeCalculator.tsx ← Hauptkomponente (Client)
    ├── InputPanel.tsx      ← Felder aus Shape-Definition
    ├── ShapeDrawing.tsx    ← SVG-Rendering
    ├── ResultsPanel.tsx    ← Formatierte Ergebnisse (DE-Locale)
    └── FormulaExplainer.tsx← Aufklappbare Formel-Box

lib/
└── shapes/
    ├── types.ts            ← Shape, SolveResult, InputDef, ValidationError
    ├── index.ts            ← Shape-Registry
    ├── dreieck.ts
    ├── kreis.ts
    ├── rechteck.ts
    ├── trapez.ts
    ├── parallelogramm.ts
    └── raute.ts
```

---

## 7. Berechnungslogik

**Interface:**
```ts
interface Shape {
  id: string
  label: string
  inputs: InputDefinition[]
  solve(known: Record<string, number>): SolveResult
  toSVG(values: Record<string, number>, size: number): SVGPath
}

interface SolveResult {
  solutions: Solution[]
  error?: string
}

interface Solution {
  values: Record<string, number>  // alle berechneten Werte
  method: string                  // z.B. "Kosinussatz (SSS)"
  formulas: string[]              // Klartext-Formeln
}
```

**Eingabevalidierung (vor solve()):**
- Negative Werte → Fehlermeldung „Wert muss positiv sein"
- Winkel ≥ 180° → „Winkel muss kleiner als 180° sein"
- Winkelsumme > 180° → „Winkelsumme überschreitet 180°"
- Dreiecksungleichung → „Kein Dreieck mit diesen Seiten möglich"
- Validierung in `InputPanel` (live) UND im Solver (als Absicherung)

**Zahlenformat:** Alle Ausgaben mit `Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 })`

---

### 7a. Dreieck — alle Berechnungsfälle

| Kürzel | Gegeben | Methode |
|--------|---------|---------|
| SSS | a, b, c | Kosinussatz |
| SWS | a, γ, b | Kosinussatz |
| WSW | α, c, β | Sinussatz |
| WWS | α, β, a | Sinussatz |
| SSW | a, b, α | Sinussatz ⚠️ 0/1/2 Lösungen |
| Rechtwinklig + Seiten | 90°, a, b | Pythagoras |
| Rechtwinklig + Seite + Winkel | 90°, a, α | Trigonometrie |
| Fläche + Seite + Winkel | A, a, α | Rückrechnung |
| Höhe + Grundseite | h_a, a | A = ½·a·h_a |

Ausgabe je Lösung: a/b/c, α/β/γ, Fläche, Umfang, h_a/h_b/h_c, Inkreisradius, Umkreisradius, Typ (gleichseitig/gleichschenklig/rechtwinklig/allgemein), SVG-Koordinaten

**SSW-Sonderfall:** 0 Lösungen → Fehler; 1 Lösung → normal; 2 Lösungen → beide anzeigen, User wählt

---

### 7b. Kreis

| Gegeben | Berechnet |
|---------|-----------|
| Radius r | Durchmesser, Umfang, Fläche |
| Durchmesser d | Radius, Umfang, Fläche |
| Umfang U | Radius, Durchmesser, Fläche |
| Fläche A | Radius, Durchmesser, Umfang |

---

### 7c. Rechteck

| Gegeben | Berechnet |
|---------|-----------|
| a, b | Fläche, Umfang, Diagonale |
| a, Diagonale | b, Fläche, Umfang |
| Fläche, a | b, Umfang, Diagonale |
| Umfang, a | b, Fläche, Diagonale |

---

### 7d. Trapez

| Gegeben | Berechnet |
|---------|-----------|
| a, c, h | Fläche, Umfang (mit b=d angenommen falls nicht gegeben) |
| a, b, c, d | Fläche (via Heron), Umfang, Höhe |
| a, c, Fläche | Höhe, Umfang |

Ausgabe: Fläche, Umfang, Höhe, Mittellinie m = (a+c)/2

---

### 7e. Parallelogramm

| Gegeben | Berechnet |
|---------|-----------|
| a, b, α | Fläche, Umfang, Höhen h_a/h_b, Diagonalen |
| a, h_a | Fläche, (Umfang nur mit b) |
| a, b, Diagonale d1 | α, Fläche, Umfang |

---

### 7f. Raute

| Gegeben | Berechnet |
|---------|-----------|
| a, α | Fläche, Umfang, Höhe, Diagonalen |
| Diagonalen d1, d2 | a, Fläche, Umfang, Winkel |
| a, h | Fläche, Umfang, Winkel |

---

## 8. Erweiterbarkeit

Neue Form hinzufügen:
1. `lib/shapes/[form].ts` → Solver + Input-Definition + SVG-Funktion implementieren
2. In `lib/shapes/index.ts` registrieren
3. `app/[form]/page.tsx` → SEO-Metadaten + `<ShapeCalculator shape={form} />`
4. In `sitemap.ts` URL ergänzen

Alle generischen Komponenten (`InputPanel`, `ResultsPanel`, `ShapeDrawing`, `FormulaExplainer`) lesen ihre Konfiguration aus der Shape-Definition — kein Core-Code ändern.

---

## 9. Nicht im Scope (v1)

- Mehrsprachigkeit (nur Deutsch)
- Benutzerkonten / gespeicherte Berechnungen
- PDF-Export
- Einbettbares Widget
- 3D-Körper (spätere Erweiterung)
- Allgemeines Viereck (mathematisch zu viele Freiheitsgrade — gestrichen)
