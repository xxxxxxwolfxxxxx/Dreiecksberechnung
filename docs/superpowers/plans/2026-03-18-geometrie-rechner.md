# Geometrie-Rechner Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Werbefinanzierte Next.js 15 Geometrie-Rechner-Website für den deutschen Markt mit 6 Formen, vollständigen Constraint-Solvern, SVG-Visualisierung und DSGVO-konformer AdSense-Integration via Google Funding Choices.

**Architecture:** App Router mit je einer Server-Component-Route pro Form für SEO. `ShapeCalculator` ist eine Client-Component, die eine form-spezifische Shape-Definition aus `lib/shapes/` konsumiert und alle UI-Teile orchestriert. Neue Formen brauchen nur eine neue `lib/shapes/[form].ts`-Datei + `app/[form]/page.tsx`.

**Tech Stack:** Next.js 15, Tailwind CSS, TypeScript (strict), Jest + React Testing Library, Google AdSense + Google Funding Choices (IAB TCF 2.2), Vercel

**Spec:** `docs/superpowers/specs/2026-03-18-geometrie-rechner-design.md`

---

## Dateistruktur

```
app/
  layout.tsx                ← Root-Layout: Navigation, Funding-Choices-Script
  page.tsx                  ← redirect → /dreieck
  sitemap.ts                ← automatische sitemap.xml
  robots.ts                 ← robots.txt
  dreieck/page.tsx          ← SEO-Metadaten + <ShapeCalculator shape="dreieck" />
  kreis/page.tsx
  rechteck/page.tsx
  trapez/page.tsx
  parallelogramm/page.tsx
  raute/page.tsx
  impressum/page.tsx        ← statische Seite
  datenschutz/page.tsx      ← statische Seite

components/
  Navigation.tsx            ← Form-Tabs, usePathname
  AdSlot.tsx                ← AdSense-Einheit, lazy via IntersectionObserver
  calculator/
    ShapeCalculator.tsx     ← Client-Component, orchestriert alles
    InputPanel.tsx          ← Felder aus shape.inputs
    ShapeDrawing.tsx        ← SVG-Rendering aus shape.toSVG()
    ResultsPanel.tsx        ← Ergebnisse formatiert (de-DE)
    FormulaExplainer.tsx    ← aufklappbare Formel-Box

lib/
  shapes/
    types.ts                ← alle Interfaces
    index.ts                ← Shape-Registry (Record<string, Shape>)
    dreieck.ts              ← Solver + SVG + Input-Defs
    kreis.ts
    rechteck.ts
    trapez.ts
    parallelogramm.ts
    raute.ts
  format.ts                 ← Intl.NumberFormat de-DE Hilfsfunktionen

tests/
  lib/shapes/dreieck.test.ts
  lib/shapes/kreis.test.ts
  lib/shapes/rechteck.test.ts
  lib/shapes/trapez.test.ts
  lib/shapes/parallelogramm.test.ts
  lib/shapes/raute.test.ts
  components/InputPanel.test.tsx
  components/ResultsPanel.test.tsx
```

---

## Task 1: Projekt-Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `jest.config.ts`, `jest.setup.ts`
- Create: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Next.js-Projekt initialisieren**

```bash
# Im geklonten Repo-Verzeichnis:
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

- [ ] **Step 2: Jest + React Testing Library installieren**

```bash
npm install --save-dev \
  jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom \
  @types/jest
```

- [ ] **Step 3: `jest.config.ts` erstellen**

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

- [ ] **Step 4: `jest.setup.ts` erstellen**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: `package.json` test-Script prüfen/ergänzen**

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

- [ ] **Step 6: Test-Run sicherstellen**

```bash
npm test -- --passWithNoTests
```
Expected: PASS (keine Tests vorhanden, aber Setup funktioniert)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: next.js 15 project setup with jest"
```

---

## Task 2: Core Types

**Files:**
- Create: `lib/shapes/types.ts`
- Create: `lib/format.ts`

- [ ] **Step 1: Failing-Test für `formatNumber`**

```ts
// tests/lib/format.test.ts
import { formatNumber, formatUnit } from '@/lib/format'

test('formatNumber formatiert mit deutschem Komma', () => {
  expect(formatNumber(3.14159)).toBe('3,1416')
})
test('formatNumber ganze Zahlen ohne Dezimalstellen', () => {
  expect(formatNumber(5)).toBe('5')
})
test('formatUnit hängt Einheit an', () => {
  expect(formatUnit(12.5, 'cm')).toBe('12,5 cm')
})
test('formatUnit für Fläche', () => {
  expect(formatUnit(12.5, 'cm', 2)).toBe('12,5 cm²')
})
```

- [ ] **Step 2: Test laufen lassen — muss FAIL**

```bash
npm test -- tests/lib/format.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/format'`

- [ ] **Step 3: `lib/format.ts` implementieren**

```ts
// lib/format.ts
const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 })

export function formatNumber(value: number): string {
  return fmt.format(value)
}

export function formatUnit(value: number, unit: string, power = 1): string {
  const superscript = power === 2 ? '²' : power === 3 ? '³' : ''
  return `${formatNumber(value)} ${unit}${superscript}`
}
```

- [ ] **Step 4: `lib/shapes/types.ts` erstellen**

```ts
// lib/shapes/types.ts
export interface InputDefinition {
  key: string           // z.B. 'a', 'alpha', 'flaeche'
  label: string         // z.B. 'Seite a', 'Winkel α'
  unit: 'length' | 'angle' | 'area' | 'none'
  optional?: boolean
}

export interface Solution {
  values: Record<string, number>
  method: string        // z.B. 'Kosinussatz (SSS)'
  formulas: string[]    // Klartext-Beschreibung der verwendeten Formeln
}

export interface SolveResult {
  solutions: Solution[]
  error?: string
}

export interface SVGData {
  points: Array<{ x: number; y: number; label: string }>
  lines: Array<{ from: number; to: number; label?: string }>
  width: number
  height: number
}

export interface Shape {
  id: string
  label: string
  inputs: InputDefinition[]
  minRequired: number
  solve(known: Partial<Record<string, number>>): SolveResult
  toSVG(values: Record<string, number>, size: number): SVGData
}
```

- [ ] **Step 5: Tests laufen lassen — müssen PASS**

```bash
npm test -- tests/lib/format.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/shapes/types.ts lib/format.ts tests/lib/format.test.ts
git commit -m "feat: core types and number formatting (de-DE)"
```

---

## Task 3: Dreieck-Solver

**Files:**
- Create: `lib/shapes/dreieck.ts`
- Create: `tests/lib/shapes/dreieck.test.ts`

- [ ] **Step 1: Failing-Tests für alle Berechnungsfälle**

```ts
// tests/lib/shapes/dreieck.test.ts
import { dreieck } from '@/lib/shapes/dreieck'

const deg = (d: number) => (d * Math.PI) / 180
const rad = (r: number) => (r * 180) / Math.PI

describe('Dreieck Solver', () => {
  // SSS
  test('SSS: 3-4-5 Dreieck gibt korrekten Winkel', () => {
    const r = dreieck.solve({ a: 3, b: 4, c: 5 })
    expect(r.solutions).toHaveLength(1)
    expect(r.solutions[0].values.gamma).toBeCloseTo(90, 1)
    expect(r.solutions[0].method).toContain('SSS')
  })

  // SWS
  test('SWS: 2 Seiten + eingeschlossener Winkel', () => {
    const r = dreieck.solve({ a: 3, b: 4, gamma: 90 })
    expect(r.solutions[0].values.c).toBeCloseTo(5, 2)
  })

  // WSW
  test('WSW: 2 Winkel + Seite', () => {
    const r = dreieck.solve({ alpha: 60, beta: 60, c: 5 })
    expect(r.solutions[0].values.gamma).toBeCloseTo(60, 1)
    expect(r.solutions[0].values.a).toBeCloseTo(5, 2)
  })

  // WWS
  test('WWS: 2 Winkel + nicht-eingeschlossene Seite', () => {
    const r = dreieck.solve({ alpha: 30, beta: 60, a: 3 })
    expect(r.solutions[0].values.c).toBeCloseTo(6, 1)
  })

  // SSW — 1 Lösung
  test('SSW: eindeutige Lösung', () => {
    const r = dreieck.solve({ a: 5, b: 7, alpha: 30 })
    expect(r.solutions.length).toBeGreaterThanOrEqual(1)
  })

  // SSW — 2 Lösungen
  test('SSW: zwei Lösungen (ambiguous case)', () => {
    const r = dreieck.solve({ a: 5, b: 8, alpha: 30 })
    expect(r.solutions).toHaveLength(2)
  })

  // SSW — 0 Lösungen
  test('SSW: kein Dreieck möglich', () => {
    const r = dreieck.solve({ a: 1, b: 10, alpha: 60 })
    expect(r.error).toBeTruthy()
    expect(r.solutions).toHaveLength(0)
  })

  // Dreiecksungleichung
  test('Ungültige Seiten liefern Fehler', () => {
    const r = dreieck.solve({ a: 1, b: 2, c: 10 })
    expect(r.error).toBeTruthy()
  })

  // Fläche
  test('Lösung enthält Fläche und Umfang', () => {
    const r = dreieck.solve({ a: 3, b: 4, c: 5 })
    expect(r.solutions[0].values.flaeche).toBeCloseTo(6, 2)
    expect(r.solutions[0].values.umfang).toBeCloseTo(12, 2)
  })

  // Alle Ausgabewerte vorhanden
  test('Vollständige Ausgabe: Höhen, Radien, Typ', () => {
    const v = dreieck.solve({ a: 3, b: 4, c: 5 }).solutions[0].values
    expect(v.h_a).toBeDefined()
    expect(v.h_b).toBeDefined()
    expect(v.h_c).toBeDefined()
    expect(v.inkreis).toBeDefined()
    expect(v.umkreis).toBeDefined()
    expect(v.typ).toBeDefined()
  })
})
```

- [ ] **Step 2: Test laufen lassen — muss FAIL**

```bash
npm test -- tests/lib/shapes/dreieck.test.ts
```
Expected: FAIL — Module nicht gefunden

- [ ] **Step 3: Dreieck-Solver implementieren**

```ts
// lib/shapes/dreieck.ts
import type { Shape, SolveResult, Solution, SVGData } from './types'

const toRad = (d: number) => (d * Math.PI) / 180
const toDeg = (r: number) => (r * 180) / Math.PI

function buildSolution(a: number, b: number, c: number, method: string, formulas: string[]): Solution {
  const alpha = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)))
  const beta  = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)))
  const gamma = 180 - alpha - beta
  const flaeche = 0.5 * a * b * Math.sin(toRad(gamma))
  const umfang = a + b + c
  const h_a = (2 * flaeche) / a
  const h_b = (2 * flaeche) / b
  const h_c = (2 * flaeche) / c
  const s = umfang / 2
  const inkreis = flaeche / s
  const umkreis = (a * b * c) / (4 * flaeche)

  let typ = 'allgemein'
  if (Math.abs(a - b) < 0.0001 && Math.abs(b - c) < 0.0001) typ = 'gleichseitig'
  else if (Math.abs(a - b) < 0.0001 || Math.abs(b - c) < 0.0001 || Math.abs(a - c) < 0.0001) typ = 'gleichschenklig'
  else if (Math.abs(alpha - 90) < 0.01 || Math.abs(beta - 90) < 0.01 || Math.abs(gamma - 90) < 0.01) typ = 'rechtwinklig'

  return {
    values: { a, b, c, alpha, beta, gamma, flaeche, umfang, h_a, h_b, h_c, inkreis, umkreis, typ: typ as unknown as number },
    method,
    formulas,
  }
}

export const dreieck: Shape = {
  id: 'dreieck',
  label: 'Dreieck',
  minRequired: 3,
  inputs: [
    { key: 'a', label: 'Seite a', unit: 'length' },
    { key: 'b', label: 'Seite b', unit: 'length' },
    { key: 'c', label: 'Seite c', unit: 'length' },
    { key: 'alpha', label: 'Winkel α', unit: 'angle' },
    { key: 'beta',  label: 'Winkel β', unit: 'angle' },
    { key: 'gamma', label: 'Winkel γ', unit: 'angle' },
  ],

  solve(k) {
    const { a, b, c, alpha, beta, gamma } = k as Record<string, number>

    // Validierung
    if (a !== undefined && a <= 0) return { solutions: [], error: 'Seite a muss positiv sein' }
    if (b !== undefined && b <= 0) return { solutions: [], error: 'Seite b muss positiv sein' }
    if (c !== undefined && c <= 0) return { solutions: [], error: 'Seite c muss positiv sein' }
    if (alpha !== undefined && (alpha <= 0 || alpha >= 180)) return { solutions: [], error: 'Winkel α muss zwischen 0° und 180° liegen' }
    if (beta  !== undefined && (beta  <= 0 || beta  >= 180)) return { solutions: [], error: 'Winkel β muss zwischen 0° und 180° liegen' }
    if (gamma !== undefined && (gamma <= 0 || gamma >= 180)) return { solutions: [], error: 'Winkel γ muss zwischen 0° und 180° liegen' }

    const defined = [a, b, c, alpha, beta, gamma].filter(v => v !== undefined).length
    if (defined < 3) return { solutions: [], error: 'Bitte mindestens 3 Werte eingeben' }

    // SSS
    if (a !== undefined && b !== undefined && c !== undefined) {
      if (a + b <= c || a + c <= b || b + c <= a)
        return { solutions: [], error: 'Dreiecksungleichung verletzt: Diese Seiten bilden kein Dreieck' }
      return { solutions: [buildSolution(a, b, c, 'Kosinussatz (SSS)', ['c² = a² + b² − 2ab·cos(γ)'])] }
    }

    // SWS
    if (a !== undefined && b !== undefined && gamma !== undefined) {
      const cVal = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRad(gamma)))
      return { solutions: [buildSolution(a, b, cVal, 'Kosinussatz (SWS)', ['c² = a² + b² − 2ab·cos(γ)'])] }
    }
    if (a !== undefined && c !== undefined && beta !== undefined) {
      const bVal = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(toRad(beta)))
      return { solutions: [buildSolution(a, bVal, c, 'Kosinussatz (SWS)', ['b² = a² + c² − 2ac·cos(β)'])] }
    }
    if (b !== undefined && c !== undefined && alpha !== undefined) {
      const aVal = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(toRad(alpha)))
      return { solutions: [buildSolution(aVal, b, c, 'Kosinussatz (SWS)', ['a² = b² + c² − 2bc·cos(α)'])] }
    }

    // WWS / WSW (2 Winkel + 1 Seite)
    if (alpha !== undefined && beta !== undefined && a !== undefined) {
      const g = 180 - alpha - beta
      if (g <= 0) return { solutions: [], error: 'Winkelsumme überschreitet 180°' }
      const bVal = (a * Math.sin(toRad(beta))) / Math.sin(toRad(alpha))
      const cVal = (a * Math.sin(toRad(g)))   / Math.sin(toRad(alpha))
      return { solutions: [buildSolution(a, bVal, cVal, 'Sinussatz (WWS)', ['a/sin(α) = b/sin(β) = c/sin(γ)'])] }
    }
    if (alpha !== undefined && beta !== undefined && b !== undefined) {
      const g = 180 - alpha - beta
      if (g <= 0) return { solutions: [], error: 'Winkelsumme überschreitet 180°' }
      const aVal = (b * Math.sin(toRad(alpha))) / Math.sin(toRad(beta))
      const cVal = (b * Math.sin(toRad(g)))    / Math.sin(toRad(beta))
      return { solutions: [buildSolution(aVal, b, cVal, 'Sinussatz (WWS)', ['a/sin(α) = b/sin(β) = c/sin(γ)'])] }
    }
    if (alpha !== undefined && beta !== undefined && c !== undefined) {
      const g = 180 - alpha - beta
      if (g <= 0) return { solutions: [], error: 'Winkelsumme überschreitet 180°' }
      const aVal = (c * Math.sin(toRad(alpha))) / Math.sin(toRad(g))
      const bVal = (c * Math.sin(toRad(beta)))  / Math.sin(toRad(g))
      return { solutions: [buildSolution(aVal, bVal, c, 'Sinussatz (WSW)', ['a/sin(α) = b/sin(β) = c/sin(γ)'])] }
    }
    if (alpha !== undefined && gamma !== undefined && a !== undefined) {
      const b2 = 180 - alpha - gamma
      if (b2 <= 0) return { solutions: [], error: 'Winkelsumme überschreitet 180°' }
      const bVal = (a * Math.sin(toRad(b2)))    / Math.sin(toRad(alpha))
      const cVal = (a * Math.sin(toRad(gamma))) / Math.sin(toRad(alpha))
      return { solutions: [buildSolution(a, bVal, cVal, 'Sinussatz (WWS)', ['a/sin(α) = b/sin(β) = c/sin(γ)'])] }
    }
    if (beta !== undefined && gamma !== undefined && b !== undefined) {
      const a2 = 180 - beta - gamma
      if (a2 <= 0) return { solutions: [], error: 'Winkelsumme überschreitet 180°' }
      const aVal = (b * Math.sin(toRad(a2)))   / Math.sin(toRad(beta))
      const cVal = (b * Math.sin(toRad(gamma)))/ Math.sin(toRad(beta))
      return { solutions: [buildSolution(aVal, b, cVal, 'Sinussatz (WWS)', ['a/sin(α) = b/sin(β) = c/sin(γ)'])] }
    }

    // SSW — ambiguous case (a, b, alpha)
    if (a !== undefined && b !== undefined && alpha !== undefined) {
      const sinBeta = (b * Math.sin(toRad(alpha))) / a
      if (sinBeta > 1) return { solutions: [], error: 'Kein Dreieck möglich mit diesen Werten' }
      const beta1 = toDeg(Math.asin(sinBeta))
      const solutions: Solution[] = []
      for (const bDeg of [beta1, 180 - beta1]) {
        const gDeg = 180 - alpha - bDeg
        if (gDeg <= 0) continue
        const cVal = (a * Math.sin(toRad(gDeg))) / Math.sin(toRad(alpha))
        solutions.push(buildSolution(a, b, cVal, 'Sinussatz (SSW)', ['Mehrdeutiger Fall: sin(β) = b·sin(α)/a']))
      }
      if (solutions.length === 0) return { solutions: [], error: 'Kein Dreieck möglich mit diesen Werten' }
      return { solutions }
    }

    return { solutions: [], error: 'Kombination nicht erkannt. Bitte andere Werte eingeben.' }
  },

  toSVG(values, size) {
    const { a, b, c } = values
    if (!a || !b || !c) return { points: [], lines: [], width: size, height: size }
    const scale = (size * 0.8) / Math.max(a, b, c)
    const A = { x: 0, y: 0 }
    const B = { x: a * scale, y: 0 }
    const cosC = (a * a + b * b - c * c) / (2 * a * b)
    const C = { x: b * cosC * scale, y: -b * Math.sqrt(1 - cosC * cosC) * scale }
    const minX = Math.min(A.x, B.x, C.x)
    const minY = Math.min(A.y, B.y, C.y)
    const offsetX = (size - (Math.max(A.x, B.x, C.x) - minX) * scale) / 2 - minX
    const offsetY = (size - (Math.max(A.y, B.y, C.y) - minY) * scale) / 2 - minY
    const pts = [
      { x: A.x + offsetX, y: -A.y + offsetY + size * 0.1, label: 'A' },
      { x: B.x + offsetX, y: -B.y + offsetY + size * 0.1, label: 'B' },
      { x: C.x + offsetX, y: -C.y + offsetY + size * 0.1, label: 'C' },
    ]
    return {
      points: pts,
      lines: [
        { from: 0, to: 1, label: `a = ${values.a}` },
        { from: 1, to: 2, label: `b = ${values.b}` },
        { from: 2, to: 0, label: `c = ${values.c}` },
      ],
      width: size,
      height: size,
    }
  },
}
```

- [ ] **Step 4: Tests laufen lassen — müssen PASS**

```bash
npm test -- tests/lib/shapes/dreieck.test.ts
```
Expected: alle Tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/shapes/types.ts lib/shapes/dreieck.ts tests/lib/shapes/dreieck.test.ts
git commit -m "feat: dreieck constraint-solver with all cases incl. SSW ambiguous"
```

---

## Task 4: Shape-Registry + restliche Solver

**Files:**
- Create: `lib/shapes/kreis.ts`, `lib/shapes/rechteck.ts`, `lib/shapes/trapez.ts`, `lib/shapes/parallelogramm.ts`, `lib/shapes/raute.ts`
- Create: `lib/shapes/index.ts`
- Create: `tests/lib/shapes/kreis.test.ts` etc.

- [ ] **Step 1: Failing-Tests für alle Formen**

```ts
// tests/lib/shapes/kreis.test.ts
import { kreis } from '@/lib/shapes/kreis'
test('Kreis: Radius → Fläche', () => {
  const r = kreis.solve({ r: 5 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(78.54, 1)
  expect(r.solutions[0].values.umfang).toBeCloseTo(31.42, 1)
})
test('Kreis: Fläche → Radius', () => {
  const r = kreis.solve({ flaeche: 78.54 })
  expect(r.solutions[0].values.r).toBeCloseTo(5, 1)
})
test('Kreis: Umfang → Radius', () => {
  const r = kreis.solve({ umfang: 31.416 })
  expect(r.solutions[0].values.r).toBeCloseTo(5, 1)
})

// tests/lib/shapes/rechteck.test.ts
import { rechteck } from '@/lib/shapes/rechteck'
test('Rechteck: a + b', () => {
  const r = rechteck.solve({ a: 4, b: 3 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(12)
  expect(r.solutions[0].values.diagonale).toBeCloseTo(5, 1)
})
test('Rechteck: Fläche + a → b', () => {
  const r = rechteck.solve({ flaeche: 12, a: 4 })
  expect(r.solutions[0].values.b).toBeCloseTo(3)
})

// tests/lib/shapes/trapez.test.ts
import { trapez } from '@/lib/shapes/trapez'
test('Trapez: a, c, h → Fläche', () => {
  const r = trapez.solve({ a: 6, c: 4, h: 3 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(15)
})

// tests/lib/shapes/parallelogramm.test.ts
import { parallelogramm } from '@/lib/shapes/parallelogramm'
test('Parallelogramm: a, b, alpha → Fläche', () => {
  const r = parallelogramm.solve({ a: 5, b: 4, alpha: 90 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(20)
})

// tests/lib/shapes/raute.test.ts
import { raute } from '@/lib/shapes/raute'
test('Raute: a, alpha → Fläche', () => {
  const r = raute.solve({ a: 5, alpha: 90 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(25)
})
```

- [ ] **Step 2: Tests laufen — müssen FAIL**

```bash
npm test -- tests/lib/shapes/
```

- [ ] **Step 3: Kreis-Solver implementieren**

```ts
// lib/shapes/kreis.ts
import type { Shape, SolveResult, SVGData } from './types'

export const kreis: Shape = {
  id: 'kreis', label: 'Kreis', minRequired: 1,
  inputs: [
    { key: 'r',      label: 'Radius r',      unit: 'length' },
    { key: 'd',      label: 'Durchmesser d', unit: 'length' },
    { key: 'umfang', label: 'Umfang U',      unit: 'length' },
    { key: 'flaeche',label: 'Fläche A',      unit: 'area'   },
  ],
  solve(k) {
    let r: number | undefined
    if (k.r)       r = k.r
    else if (k.d)  r = k.d / 2
    else if (k.umfang)  r = k.umfang / (2 * Math.PI)
    else if (k.flaeche) r = Math.sqrt(k.flaeche / Math.PI)
    if (!r || r <= 0) return { solutions: [], error: 'Bitte einen Wert eingeben' }
    return { solutions: [{
      values: { r, d: 2*r, umfang: 2*Math.PI*r, flaeche: Math.PI*r*r },
      method: 'Kreisformeln',
      formulas: ['U = 2πr', 'A = πr²'],
    }] }
  },
  toSVG(values, size) {
    const cx = size / 2, cy = size / 2
    const r = (size * 0.4)
    return {
      points: [{ x: cx + r, y: cy, label: 'r' }],
      lines: [{ from: 0, to: 0, label: `r = ${values.r}` }],
      width: size, height: size,
    }
  },
}
```

- [ ] **Step 4: Rechteck, Trapez, Parallelogramm, Raute implementieren**

```ts
// lib/shapes/rechteck.ts
import type { Shape, SVGData } from './types'
export const rechteck: Shape = {
  id: 'rechteck', label: 'Rechteck', minRequired: 2,
  inputs: [
    { key: 'a', label: 'Seite a', unit: 'length' },
    { key: 'b', label: 'Seite b', unit: 'length' },
    { key: 'diagonale', label: 'Diagonale d', unit: 'length', optional: true },
    { key: 'flaeche',   label: 'Fläche A',    unit: 'area',   optional: true },
    { key: 'umfang',    label: 'Umfang U',    unit: 'length', optional: true },
  ],
  solve(k) {
    let a = k.a, b = k.b
    if (!a && !b) return { solutions: [], error: 'Mindestens eine Seite eingeben' }
    if (!a && k.flaeche && b) a = k.flaeche / b
    if (!b && k.flaeche && a) b = k.flaeche / a
    if (!a && k.diagonale && b) a = Math.sqrt(k.diagonale ** 2 - b ** 2)
    if (!b && k.diagonale && a) b = Math.sqrt(k.diagonale ** 2 - a ** 2)
    if (!a && k.umfang && b) a = k.umfang / 2 - b
    if (!b && k.umfang && a) b = k.umfang / 2 - a
    if (!a || !b) return { solutions: [], error: 'Nicht genug Werte für eindeutige Lösung' }
    const d = Math.sqrt(a * a + b * b)
    return { solutions: [{
      values: { a, b, flaeche: a * b, umfang: 2 * (a + b), diagonale: d },
      method: 'Rechteck-Formeln',
      formulas: ['A = a · b', 'U = 2(a + b)', 'd = √(a² + b²)'],
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.7) / Math.max(v.a, v.b)
    const w = v.a * scale, h = v.b * scale
    const ox = (size - w) / 2, oy = (size - h) / 2
    return {
      points: [
        { x: ox,   y: oy,   label: '' },
        { x: ox+w, y: oy,   label: '' },
        { x: ox+w, y: oy+h, label: '' },
        { x: ox,   y: oy+h, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2, label: `b = ${v.b}` },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}

// lib/shapes/trapez.ts
import type { Shape, SVGData } from './types'
export const trapez: Shape = {
  id: 'trapez', label: 'Trapez', minRequired: 3,
  inputs: [
    { key: 'a', label: 'Grundseite a', unit: 'length' },
    { key: 'c', label: 'Seite c (parallel)', unit: 'length' },
    { key: 'h', label: 'Höhe h', unit: 'length' },
    { key: 'b', label: 'Schenkel b', unit: 'length', optional: true },
    { key: 'd', label: 'Schenkel d', unit: 'length', optional: true },
    { key: 'flaeche', label: 'Fläche A', unit: 'area', optional: true },
  ],
  solve(k) {
    const { a, c, h, b, d, flaeche } = k as Record<string, number>
    let hVal = h
    if (!hVal && flaeche && a && c) hVal = (2 * flaeche) / (a + c)
    if (!a || !c || !hVal) return { solutions: [], error: 'Grundseiten a, c und Höhe h angeben' }
    const A = ((a + c) / 2) * hVal
    const m = (a + c) / 2
    const bVal = b || Math.sqrt(hVal ** 2 + ((a - c) / 2) ** 2)
    const U = a + c + bVal + (d || bVal)
    return { solutions: [{
      values: { a, c, h: hVal, flaeche: A, umfang: U, mittellinie: m },
      method: 'Trapez-Formel',
      formulas: ['A = (a + c) / 2 · h', 'M = (a + c) / 2'],
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.7) / v.a
    const ax = v.a * scale, cx = v.c * scale
    const h = Math.min(v.h * scale, size * 0.5)
    const ox = (size - ax) / 2, oy = size * 0.75
    const offset = (ax - cx) / 2
    return {
      points: [
        { x: ox, y: oy, label: '' },
        { x: ox + ax, y: oy, label: '' },
        { x: ox + offset + cx, y: oy - h, label: '' },
        { x: ox + offset, y: oy - h, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2 },
        { from: 2, to: 3, label: `c = ${v.c}` },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}

// lib/shapes/parallelogramm.ts
import type { Shape, SVGData } from './types'
const toRad = (d: number) => (d * Math.PI) / 180
export const parallelogramm: Shape = {
  id: 'parallelogramm', label: 'Parallelogramm', minRequired: 3,
  inputs: [
    { key: 'a',     label: 'Seite a',  unit: 'length' },
    { key: 'b',     label: 'Seite b',  unit: 'length' },
    { key: 'alpha', label: 'Winkel α', unit: 'angle' },
    { key: 'h_a',   label: 'Höhe h_a', unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, b, alpha, h_a } = k as Record<string, number>
    let aVal = a, alphaVal = alpha, h = h_a
    if (!h && aVal && alphaVal) h = aVal * Math.sin(toRad(alphaVal))
    if (!aVal || !b) return { solutions: [], error: 'Seiten a und b eingeben' }
    if (!alphaVal && !h) return { solutions: [], error: 'Winkel α oder Höhe h_a eingeben' }
    if (!alphaVal) alphaVal = Math.asin(h / aVal) * 180 / Math.PI
    if (!h) h = aVal * Math.sin(toRad(alphaVal))
    const flaeche = aVal * b * Math.sin(toRad(alphaVal))
    const d1 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(alphaVal)))
    const d2 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(180-alphaVal)))
    return { solutions: [{
      values: { a: aVal, b, alpha: alphaVal, beta: 180 - alphaVal, h_a: h, flaeche, umfang: 2*(aVal+b), d1, d2 },
      method: 'Parallelogramm-Formeln',
      formulas: ['A = a · h = a · b · sin(α)', 'U = 2(a + b)'],
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.6) / v.a
    const a = v.a * scale, b = v.b * scale
    const angle = toRad(v.alpha || 70)
    const dx = b * Math.cos(angle), dy = b * Math.sin(angle)
    const ox = size * 0.15, oy = size * 0.75
    return {
      points: [
        { x: ox, y: oy, label: '' },
        { x: ox + a, y: oy, label: '' },
        { x: ox + a + dx, y: oy - dy, label: '' },
        { x: ox + dx, y: oy - dy, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2, label: `b = ${v.b}` },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}

// lib/shapes/raute.ts
import type { Shape, SVGData } from './types'
const toRad2 = (d: number) => (d * Math.PI) / 180
export const raute: Shape = {
  id: 'raute', label: 'Raute', minRequired: 2,
  inputs: [
    { key: 'a',     label: 'Seite a',     unit: 'length' },
    { key: 'alpha', label: 'Winkel α',    unit: 'angle', optional: true },
    { key: 'd1',    label: 'Diagonale d1',unit: 'length', optional: true },
    { key: 'd2',    label: 'Diagonale d2',unit: 'length', optional: true },
    { key: 'h',     label: 'Höhe h',      unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, alpha, d1, d2, h } = k as Record<string, number>
    if (d1 && d2) {
      const aVal = Math.sqrt((d1/2)**2 + (d2/2)**2)
      const alphaVal = 2 * Math.asin(d2 / (2 * aVal)) * 180 / Math.PI
      return { solutions: [{
        values: { a: aVal, alpha: alphaVal, d1, d2, flaeche: d1*d2/2, umfang: 4*aVal, h: d2*d1/(2*aVal) },
        method: 'Raute (Diagonalen)',
        formulas: ['A = d1 · d2 / 2'],
      }] }
    }
    if (!a) return { solutions: [], error: 'Seite a eingeben' }
    let alphaVal = alpha
    if (!alphaVal && h) alphaVal = Math.asin(h / a) * 180 / Math.PI
    if (!alphaVal) return { solutions: [], error: 'Winkel α oder Höhe h eingeben' }
    const hVal = a * Math.sin(toRad2(alphaVal))
    const d1Val = 2 * a * Math.sin(toRad2(alphaVal / 2))
    const d2Val = 2 * a * Math.cos(toRad2(alphaVal / 2))
    return { solutions: [{
      values: { a, alpha: alphaVal, beta: 180 - alphaVal, h: hVal, d1: d1Val, d2: d2Val, flaeche: a * hVal, umfang: 4 * a },
      method: 'Raute (Seite + Winkel)',
      formulas: ['A = a · h = a² · sin(α)', 'U = 4a'],
    }] }
  },
  toSVG(v, size) {
    const cx = size / 2, cy = size / 2
    const d1 = ((v.d1 || v.a * 1.2)) * size * 0.35 / v.a
    const d2 = ((v.d2 || v.a)) * size * 0.35 / v.a
    return {
      points: [
        { x: cx, y: cy - d2, label: '' },
        { x: cx + d1, y: cy, label: '' },
        { x: cx, y: cy + d2, label: '' },
        { x: cx - d1, y: cy, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}
```

- [ ] **Step 5: Shape-Registry erstellen**

```ts
// lib/shapes/index.ts
import { dreieck } from './dreieck'
import { kreis } from './kreis'
import { rechteck } from './rechteck'
import { trapez } from './trapez'
import { parallelogramm } from './parallelogramm'
import { raute } from './raute'
import type { Shape } from './types'

export const shapes: Record<string, Shape> = {
  dreieck,
  kreis,
  rechteck,
  trapez,
  parallelogramm,
  raute,
}

export const shapeList = Object.values(shapes)
```

- [ ] **Step 6: Alle Tests laufen — müssen PASS**

```bash
npm test -- tests/lib/shapes/
```
Expected: alle PASS

- [ ] **Step 7: Commit**

```bash
git add lib/shapes/ tests/lib/shapes/
git commit -m "feat: all shape solvers (kreis, rechteck, trapez, parallelogramm, raute)"
```

---

## Task 5: UI-Komponenten

**Files:**
- Create: `components/calculator/InputPanel.tsx`
- Create: `components/calculator/ShapeDrawing.tsx`
- Create: `components/calculator/ResultsPanel.tsx`
- Create: `components/calculator/FormulaExplainer.tsx`
- Create: `components/calculator/ShapeCalculator.tsx`
- Create: `tests/components/InputPanel.test.tsx`
- Create: `tests/components/ResultsPanel.test.tsx`

- [ ] **Step 1: Failing-Tests für InputPanel**

```tsx
// tests/components/InputPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { InputPanel } from '@/components/calculator/InputPanel'
import { dreieck } from '@/lib/shapes/dreieck'

test('rendert alle Input-Felder der Form', () => {
  render(<InputPanel shape={dreieck} values={{}} onChange={() => {}} unit="cm" />)
  expect(screen.getByLabelText(/Seite a/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Seite b/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Winkel α/i)).toBeInTheDocument()
})

test('ruft onChange mit korrektem Key auf', () => {
  const onChange = jest.fn()
  render(<InputPanel shape={dreieck} values={{}} onChange={onChange} unit="cm" />)
  fireEvent.change(screen.getByLabelText(/Seite a/i), { target: { value: '3' } })
  expect(onChange).toHaveBeenCalledWith('a', 3)
})

test('zeigt Fehler bei negativem Wert', () => {
  render(<InputPanel shape={dreieck} values={{ a: -1 }} onChange={() => {}} unit="cm" />)
  expect(screen.getByText(/positiv/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Tests laufen — müssen FAIL**

```bash
npm test -- tests/components/InputPanel.test.tsx
```

- [ ] **Step 3: InputPanel implementieren**

```tsx
// components/calculator/InputPanel.tsx
'use client'
import type { Shape } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  values: Partial<Record<string, number>>
  onChange: (key: string, value: number | undefined) => void
  unit: string
}

export function InputPanel({ shape, values, onChange, unit }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {shape.inputs.map((input) => {
        const val = values[input.key]
        const isNegative = val !== undefined && val < 0
        const displayUnit = input.unit === 'angle' ? '°' : unit
        return (
          <div key={input.key} className="flex flex-col gap-1">
            <label
              htmlFor={input.key}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {input.label}
            </label>
            <div className="relative">
              <input
                id={input.key}
                type="number"
                step="any"
                value={val ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseFloat(e.target.value)
                  onChange(input.key, v)
                }}
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm
                  focus:outline-none focus:ring-2
                  ${isNegative
                    ? 'border-red-400 focus:ring-red-300'
                    : val !== undefined
                      ? 'border-green-400 focus:ring-green-300'
                      : 'border-gray-300 focus:ring-blue-300'
                  }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {displayUnit}
              </span>
            </div>
            {isNegative && (
              <span className="text-xs text-red-500">Wert muss positiv sein</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: ResultsPanel implementieren**

```tsx
// components/calculator/ResultsPanel.tsx
import { formatUnit } from '@/lib/format'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
  unit: string
}

const LABELS: Record<string, string> = {
  a: 'Seite a', b: 'Seite b', c: 'Seite c',
  alpha: 'Winkel α', beta: 'Winkel β', gamma: 'Winkel γ',
  flaeche: 'Fläche', umfang: 'Umfang',
  h_a: 'Höhe h_a', h_b: 'Höhe h_b', h_c: 'Höhe h_c',
  inkreis: 'Inkreisradius', umkreis: 'Umkreisradius',
  r: 'Radius', d: 'Durchmesser',
  diagonale: 'Diagonale', mittellinie: 'Mittellinie',
  d1: 'Diagonale d₁', d2: 'Diagonale d₂', h: 'Höhe h',
  typ: 'Dreieckstyp',
}

export function ResultsPanel({ solution, unit }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Methode: {solution.method}
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {Object.entries(solution.values).map(([key, value]) => {
          if (key === 'typ') return (
            <div key={key} className="col-span-full">
              <dt className="text-xs text-gray-500">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold capitalize">{String(value)}</dd>
            </div>
          )
          if (typeof value !== 'number') return null
          const isAngle = ['alpha','beta','gamma'].includes(key)
          const isArea = key === 'flaeche'
          return (
            <div key={key}>
              <dt className="text-xs text-gray-500 dark:text-gray-400">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold">
                {isAngle ? `${formatUnit(value, '°')}` : formatUnit(value, unit, isArea ? 2 : 1)}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
```

- [ ] **Step 5: ShapeDrawing implementieren**

```tsx
// components/calculator/ShapeDrawing.tsx
import type { SVGData } from '@/lib/shapes/types'

interface Props {
  data: SVGData
  size?: number
}

export function ShapeDrawing({ data, size = 280 }: Props) {
  if (!data.points.length) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-900"
      style={{ maxHeight: '320px' }}
    >
      {data.lines.map((line, i) => {
        const from = data.points[line.from]
        const to   = data.points[line.to]
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        return (
          <g key={i}>
            <line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#3b82f6" strokeWidth="2"
            />
            {line.label && (
              <text x={mx} y={my - 6} textAnchor="middle" fontSize="11" fill="#6b7280">
                {line.label}
              </text>
            )}
          </g>
        )
      })}
      {data.points.map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" />
          {pt.label && (
            <text x={pt.x} y={pt.y - 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">
              {pt.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
```

- [ ] **Step 6: FormulaExplainer implementieren**

```tsx
// components/calculator/FormulaExplainer.tsx
'use client'
import { useState } from 'react'

interface Props {
  formulas: string[]
  method: string
}

export function FormulaExplainer({ formulas, method }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
      >
        <span>Verwendete Formeln: {method}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
          <ul className="space-y-1">
            {formulas.map((f, i) => (
              <li key={i} className="rounded bg-gray-50 px-3 py-2 font-mono text-sm dark:bg-gray-800">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: ShapeCalculator (Hauptkomponente) implementieren**

```tsx
// components/calculator/ShapeCalculator.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { shapes } from '@/lib/shapes'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'
import type { SolveResult } from '@/lib/shapes/types'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
}

export function ShapeCalculator({ shapeId }: Props) {
  const shape = shapes[shapeId]
  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [unit, setUnit] = useState('cm')
  const [result, setResult] = useState<SolveResult | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    setValues({})
    setResult(null)
    setActiveIdx(0)
  }, [shapeId])

  useEffect(() => {
    const filled = Object.values(values).filter(v => v !== undefined && !isNaN(v)).length
    if (filled >= shape.minRequired) {
      setResult(shape.solve(values))
      setActiveIdx(0)
    } else {
      setResult(null)
    }
  }, [values, shape])

  const handleChange = (key: string, value: number | undefined) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const activeSolution = result?.solutions[activeIdx]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{shape.label} berechnen</h1>
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          {UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>

      <InputPanel shape={shape} values={values} onChange={handleChange} unit={unit} />

      {result?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20">
          {result.error}
        </div>
      )}

      {result && result.solutions.length > 1 && (
        <div className="flex gap-2">
          {result.solutions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                i === activeIdx ? 'bg-blue-600 text-white' : 'border border-gray-300'
              }`}
            >
              Lösung {i + 1}
            </button>
          ))}
        </div>
      )}

      {activeSolution && (
        <ShapeDrawing data={shape.toSVG(activeSolution.values, 280)} />
      )}

      {activeSolution && (
        <ResultsPanel solution={activeSolution} unit={unit} />
      )}

      {activeSolution && (
        <FormulaExplainer formulas={activeSolution.formulas} method={activeSolution.method} />
      )}
    </div>
  )
}
```

- [ ] **Step 8: Alle Tests laufen**

```bash
npm test
```
Expected: alle PASS

- [ ] **Step 9: Commit**

```bash
git add components/ tests/components/
git commit -m "feat: calculator UI components (InputPanel, ShapeDrawing, ResultsPanel, FormulaExplainer, ShapeCalculator)"
```

---

## Task 6: Navigation + Root-Layout

**Files:**
- Create: `components/Navigation.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Navigation implementieren**

```tsx
// components/Navigation.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { shapeList } from '@/lib/shapes'

export function Navigation() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        <span className="mr-3 font-bold text-blue-600 whitespace-nowrap">Geo-Rechner</span>
        {shapeList.map((shape) => (
          <Link
            key={shape.id}
            href={`/${shape.id}`}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
              ${pathname === `/${shape.id}`
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
          >
            {shape.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: AdSlot implementieren**

```tsx
// components/AdSlot.tsx
'use client'
import { useEffect, useRef } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
  minHeight?: number
}

export function AdSlot({ slot, format = 'auto', className = '', minHeight = 90 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded.current) {
        loaded.current = true
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {}
        observer.disconnect()
      }
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
```

- [ ] **Step 3: Root-Layout aktualisieren**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Navigation } from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s | Geometrie-Rechner', default: 'Geometrie-Rechner' },
  description: 'Geometrische Formen online berechnen – Dreieck, Kreis, Rechteck und mehr.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Google Funding Choices (IAB TCF 2.2 CMP) — vor AdSense laden */}
        <Script
          src={`https://fundingchoicesmessages.google.com/i/${process.env.NEXT_PUBLIC_FUNDING_CHOICES_ID}?ers=1`}
          strategy="beforeInteractive"
        />
        <Script id="fc-init" strategy="beforeInteractive">{`
          (function() {
            function signalGooglefcPresent() {
              if (!window.frames['googlefcPresent']) {
                if (document.body) {
                  const iframe = document.createElement('iframe');
                  iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                  iframe.style.display = 'none';
                  iframe.name = 'googlefcPresent';
                  document.body.appendChild(iframe);
                } else {
                  setTimeout(signalGooglefcPresent, 0);
                }
              }
            }
            signalGooglefcPresent();
          })();
        `}</Script>
        {/* AdSense */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-700">
          <a href="/impressum" className="hover:underline mr-4">Impressum</a>
          <a href="/datenschutz" className="hover:underline">Datenschutz</a>
        </footer>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: `.env.local` anlegen**

```bash
# .env.local (nicht in git!)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXX
NEXT_PUBLIC_FUNDING_CHOICES_ID=XXXXXXXXXXXX
```

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Dev-Server starten und Navigation prüfen**

```bash
npm run dev
```
Öffne http://localhost:3000 — Navigation sollte sichtbar sein, Redirect auf /dreieck funktionieren.

- [ ] **Step 6: Commit**

```bash
git add components/Navigation.tsx components/AdSlot.tsx app/layout.tsx .gitignore
git commit -m "feat: navigation, AdSlot, root layout with Google Funding Choices + AdSense"
```

---

## Task 7: Shape-Seiten mit SEO

**Files:**
- Create: `app/page.tsx`, `app/dreieck/page.tsx`, `app/kreis/page.tsx`, `app/rechteck/page.tsx`, `app/trapez/page.tsx`, `app/parallelogramm/page.tsx`, `app/raute/page.tsx`

- [ ] **Step 1: Redirect-Root und alle Shape-Pages anlegen**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation'
export default function Home() { redirect('/dreieck') }
```

```tsx
// app/dreieck/page.tsx
import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { shapeList } from '@/lib/shapes'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dreieck berechnen – Fläche, Umfang, Winkel online',
  description: 'Dreieck online berechnen: Fläche, Umfang, alle Winkel, Höhen und Radien. Alle Formeln erklärt. Kostenlos und ohne Anmeldung.',
}

export default function DreieckPage() {
  return (
    <>
      <AdSlot slot="XXXXXXXXXX" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="dreieck" />
      <AdSlot slot="XXXXXXXXXX" format="rectangle" className="my-6" minHeight={250} />
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Weitere Formen berechnen</h2>
        <div className="flex flex-wrap gap-2">
          {shapeList.filter(s => s.id !== 'dreieck').map(s => (
            <Link key={s.id} href={`/${s.id}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Gleiche Struktur für alle 5 weiteren Formen anlegen**

Erstelle `app/kreis/page.tsx`, `app/rechteck/page.tsx`, `app/trapez/page.tsx`, `app/parallelogramm/page.tsx`, `app/raute/page.tsx` nach demselben Muster — nur `shapeId`, `title` und `description` anpassen:

| Route | shapeId | Title |
|-------|---------|-------|
| /kreis | kreis | Kreis berechnen – Radius, Fläche, Umfang online |
| /rechteck | rechteck | Rechteck berechnen – Fläche, Umfang, Diagonale |
| /trapez | trapez | Trapez berechnen – Fläche, Umfang, Höhe |
| /parallelogramm | parallelogramm | Parallelogramm berechnen – Fläche, Umfang, Winkel |
| /raute | raute | Raute berechnen – Fläche, Diagonalen, Winkel |

- [ ] **Step 3: sitemap.ts + robots.ts**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://DEINE-DOMAIN.de'
  const shapes = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
  return shapes.map(s => ({
    url: `${base}/${s}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: s === 'dreieck' ? 1 : 0.8,
  }))
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://DEINE-DOMAIN.de/sitemap.xml',
  }
}
```

- [ ] **Step 4: Im Dev-Server alle Routen prüfen**

```bash
# Öffne nacheinander:
http://localhost:3000/dreieck
http://localhost:3000/kreis
http://localhost:3000/rechteck
http://localhost:3000/trapez
http://localhost:3000/parallelogramm
http://localhost:3000/raute
```
Jede Seite muss laden und den korrekten Rechner zeigen.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: all shape pages with SEO metadata, sitemap, robots"
```

---

## Task 8: Pflichtseiten (Impressum, Datenschutz)

**Files:**
- Create: `app/impressum/page.tsx`
- Create: `app/datenschutz/page.tsx`

- [ ] **Step 1: Impressum-Seite anlegen**

```tsx
// app/impressum/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Impressum' }

export default function Impressum() {
  return (
    <article className="prose dark:prose-invert max-w-2xl">
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      {/* Platzhalter — Wolf muss seine echten Daten eintragen */}
      <p><strong>Name:</strong> [Vor- und Nachname]</p>
      <p><strong>Anschrift:</strong> [Straße, PLZ Ort]</p>
      <p><strong>E-Mail:</strong> [E-Mail-Adresse]</p>
      <h2>Haftungsausschluss</h2>
      <p>Die Berechnungen auf dieser Website dienen nur zur Orientierung. Für die Richtigkeit der Ergebnisse wird keine Gewähr übernommen.</p>
    </article>
  )
}
```

- [ ] **Step 2: Datenschutz-Seite anlegen**

```tsx
// app/datenschutz/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Datenschutzerklärung' }

export default function Datenschutz() {
  return (
    <article className="prose dark:prose-invert max-w-2xl">
      <h1>Datenschutzerklärung</h1>
      <h2>1. Verantwortlicher</h2>
      <p>[Name und Adresse — wie im Impressum]</p>
      <h2>2. Werbung & Consent</h2>
      <p>Diese Website nutzt Google AdSense zur Schaltung von Werbeanzeigen. Die Einwilligungsverwaltung erfolgt über Google Funding Choices gemäß IAB TCF 2.2. Ohne Einwilligung werden ausschließlich nicht-personalisierte Anzeigen ausgespielt.</p>
      <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Datenschutzrichtlinie</a></p>
      <h2>3. Hosting</h2>
      <p>Diese Website wird auf Vercel gehostet. Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Vercel Privacy Policy</a></p>
      <h2>4. Keine weiteren Datenerhebungen</h2>
      <p>Es werden keine Nutzerkonten angelegt. Es werden keine persönlichen Daten außer den durch AdSense und Vercel technisch bedingten Daten verarbeitet.</p>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/impressum app/datenschutz
git commit -m "feat: impressum and datenschutz pages (DSGVO Pflicht)"
```

---

## Task 9: Abschluss & Deployment-Vorbereitung

- [ ] **Step 1: Vollständiger Test-Run**

```bash
npm test
```
Expected: alle Tests PASS, keine Fehler

- [ ] **Step 2: Build prüfen**

```bash
npm run build
```
Expected: erfolgreich ohne Fehler oder Warnings

- [ ] **Step 3: Lint**

```bash
npm run lint
```
Alle Warnings beheben.

- [ ] **Step 4: `.env.local` befüllen**

Im `.env.local` die echten Werte eintragen:
- `NEXT_PUBLIC_ADSENSE_ID`: Google AdSense Publisher-ID (aus AdSense-Dashboard)
- `NEXT_PUBLIC_FUNDING_CHOICES_ID`: Google Funding Choices Property-ID

In `app/sitemap.ts` und `app/robots.ts` die echte Domain eintragen.
Im Impressum und in der Datenschutzerklärung die echten Kontaktdaten eintragen.

- [ ] **Step 5: Vercel verbinden**

```bash
# Vercel CLI installieren (einmalig)
npm install -g vercel

# Projekt verbinden
vercel link

# Env-Variablen in Vercel setzen
vercel env add NEXT_PUBLIC_ADSENSE_ID
vercel env add NEXT_PUBLIC_FUNDING_CHOICES_ID
```

- [ ] **Step 6: Finaler Commit + Push**

```bash
git add -A
git commit -m "feat: geometrie-rechner v1 complete"
git push
```

- [ ] **Step 7: Deployment**

Vercel deployt automatisch nach jedem Push auf `main`. URL nach dem ersten Deployment in AdSense und Funding Choices als Property eintragen.
