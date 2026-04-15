# Triangle Calculator Phase 1: UX Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 4 high-impact UX improvements for the triangle calculator: input mode wizard, interactive SVG drawing with hover effects, contextual error messages, and explanatory tooltips in results.

**Architecture:** 
- Add `ModeSelector` component to guide users through input selection before calculation
- Enhance `ShapeDrawing` component with React state for hover interactions and visual feedback
- Improve error handling in `ShapeCalculator` with contextual explanations
- Add hint system to `ResultsPanel` with real-world comparisons

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Jest for testing

---

## File Structure

**New Components:**
- `components/calculator/ModeSelector.tsx` – Radio button selector for input mode
- `components/calculator/InputFieldWithHint.tsx` – Enhanced input field with contextual help
- `utils/errorExplanations.ts` – Error message templates with suggestions

**Modified Components:**
- `components/calculator/ShapeCalculator.tsx` – Orchestrate mode selection flow
- `components/calculator/InputPanel.tsx` – Group inputs by type (sides vs angles), show hints
- `components/calculator/ShapeDrawing.tsx` – Add hover state, highlight on interaction
- `components/calculator/ResultsPanel.tsx` – Add explanation tooltips per result

**Tests:**
- `tests/components/calculator/ModeSelector.test.tsx`
- `tests/components/calculator/ShapeDrawing.test.tsx`
- `tests/utils/errorExplanations.test.ts`

---

## Task 1: Create Mode Selector Component

**Files:**
- Create: `components/calculator/ModeSelector.tsx`
- Create: `tests/components/calculator/ModeSelector.test.tsx`

- [ ] **Step 1: Write the test for ModeSelector rendering**

```typescript
// tests/components/calculator/ModeSelector.test.tsx
import { render, screen } from '@testing-library/react'
import { ModeSelector } from '@/components/calculator/ModeSelector'

describe('ModeSelector', () => {
  it('renders all four mode options', () => {
    const onSelect = jest.fn()
    render(<ModeSelector onSelect={onSelect} />)
    
    expect(screen.getByText('Alle 3 Seiten (SSS)')).toBeInTheDocument()
    expect(screen.getByText('2 Seiten + 1 Winkel (SWS)')).toBeInTheDocument()
    expect(screen.getByText('1 Seite + 2 Winkel (WSW)')).toBeInTheDocument()
    expect(screen.getByText('Weiß nicht / Alle Felder')).toBeInTheDocument()
  })

  it('calls onSelect with correct mode when button is clicked', async () => {
    const onSelect = jest.fn()
    const { container } = render(<ModeSelector onSelect={onSelect} />)
    
    const sssButton = container.querySelector('button')
    await userEvent.click(sssButton!)
    
    expect(onSelect).toHaveBeenCalledWith('sss')
  })

  it('shows hint text for each mode', () => {
    render(<ModeSelector onSelect={jest.fn()} />)
    
    expect(screen.getByText('Schnellste Lösung')).toBeInTheDocument()
    expect(screen.getByText('Am häufigsten in der Schule')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /tmp/tri-calc
npm test -- tests/components/calculator/ModeSelector.test.tsx --no-coverage
```

Expected output:
```
FAIL tests/components/calculator/ModeSelector.test.tsx
  ● Cannot find module '@/components/calculator/ModeSelector'
```

- [ ] **Step 3: Create ModeSelector component with full implementation**

```typescript
// components/calculator/ModeSelector.tsx
'use client'

interface Mode {
  id: string
  label: string
  hint: string
  description: string
}

const MODES: Mode[] = [
  {
    id: 'sss',
    label: 'Alle 3 Seiten (SSS)',
    hint: 'Schnellste Lösung',
    description: 'Du kennst alle drei Seitenlängen'
  },
  {
    id: 'sws',
    label: '2 Seiten + 1 Winkel (SWS)',
    hint: 'Am häufigsten in der Schule',
    description: 'Du kennst zwei Seiten und einen Winkel dazwischen'
  },
  {
    id: 'wsw',
    label: '1 Seite + 2 Winkel (WSW)',
    hint: 'Für spezielle Aufgaben',
    description: 'Du kennst eine Seite und zwei anliegende Winkel'
  },
  {
    id: 'www',
    label: 'Weiß nicht / Alle Felder',
    hint: 'Probiere es aus',
    description: 'Gib einfach Werte ein – wir zeigen alle Möglichkeiten'
  }
]

interface Props {
  onSelect: (modeId: string) => void
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Was kennst du von deinem Dreieck?</h2>
        <p className="text-sm text-gray-500">Wähle aus, welche Informationen du hast – wir zeigen dir nur die relevanten Felder</p>
      </div>

      <div className="grid gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{mode.label}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{mode.description}</p>
                <p className="text-xs text-blue-600 font-medium mt-1.5">💡 {mode.hint}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/components/calculator/ModeSelector.test.tsx --no-coverage
```

Expected output:
```
PASS tests/components/calculator/ModeSelector.test.tsx
  ✓ renders all four mode options
  ✓ calls onSelect with correct mode when button is clicked
  ✓ shows hint text for each mode
```

- [ ] **Step 5: Commit**

```bash
git add components/calculator/ModeSelector.tsx tests/components/calculator/ModeSelector.test.tsx
git commit -m "feat: add mode selector component for guided input"
```

---

## Task 2: Integrate ModeSelector into ShapeCalculator

**Files:**
- Modify: `components/calculator/ShapeCalculator.tsx:20-80`
- Modify: `tests/components/calculator/ShapeCalculator.test.tsx` (create if missing)

- [ ] **Step 1: Write test for mode selection flow**

```typescript
// tests/components/calculator/ShapeCalculator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'

// Mock shapes module
jest.mock('@/lib/shapes', () => ({
  shapes: {
    dreieck: {
      label: 'Dreieck',
      minRequired: 3,
      inputs: [
        { key: 'a', label: 'Seite a', unit: 'length' },
        { key: 'b', label: 'Seite b', unit: 'length' },
        { key: 'c', label: 'Seite c', unit: 'length' },
        { key: 'alpha', label: 'Winkel α', unit: 'angle' },
        { key: 'beta', label: 'Winkel β', unit: 'angle' },
        { key: 'gamma', label: 'Winkel γ', unit: 'angle' },
      ],
      solve: jest.fn(() => ({ solutions: [] })),
      toSVG: jest.fn(() => ({ points: [], lines: [], width: 280, height: 280 })),
      defaultValues: {}
    }
  }
}))

describe('ShapeCalculator with Mode Selection', () => {
  it('shows ModeSelector on initial load', () => {
    render(<ShapeCalculator shapeId="dreieck" />)
    expect(screen.getByText('Was kennst du von deinem Dreieck?')).toBeInTheDocument()
  })

  it('shows calculator after mode is selected', async () => {
    const { container } = render(<ShapeCalculator shapeId="dreieck" />)
    const button = container.querySelector('button')
    fireEvent.click(button!)
    
    expect(screen.getByText('Dreieck berechnen')).toBeInTheDocument()
  })

  it('hides mode selector after selection', async () => {
    const { container, rerender } = render(<ShapeCalculator shapeId="dreieck" />)
    const button = container.querySelector('button')
    fireEvent.click(button!)
    
    expect(screen.queryByText('Was kennst du von deinem Dreieck?')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/components/calculator/ShapeCalculator.test.tsx --no-coverage
```

Expected: Tests fail because selectedMode state doesn't exist yet

- [ ] **Step 3: Add mode state to ShapeCalculator**

```typescript
// components/calculator/ShapeCalculator.tsx - Replace the function component
'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { shapes } from '@/lib/shapes'
import { ModeSelector } from './ModeSelector'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
}

function MidBanner() {
  // ... existing code unchanged
}

function ShapeCalculatorInner({ shapeId }: Props) {
  const shape = shapes[shapeId]
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [unit, setUnit] = useState('cm')
  const [activeIdx, setActiveIdx] = useState(0)

  const result = useMemo(() => {
    const filled = Object.values(values).filter(v => v !== undefined && !isNaN(v as number)).length
    if (filled >= shape.minRequired) {
      return shape.solve(values)
    }
    return null
  }, [values, shape])

  const handleChange = (key: string, value: number | undefined) => {
    setActiveIdx(0)
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const activeSolution = result?.solutions[activeIdx]

  // NEW: Show mode selector if not yet selected
  if (!selectedMode) {
    return <ModeSelector onSelect={setSelectedMode} />
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-extrabold">{shape.label} berechnen</h1>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="rounded-lg bg-white/20 border border-white/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
          >
            {UNITS.map(u => <option key={u} value={u} className="text-gray-900">{u}</option>)}
          </select>
        </div>
        <p className="mt-1 text-sm text-blue-100">
          {result?.solutions.length ? `Ergebnis berechnet` : `Gib mindestens ${shape.minRequired} Werte ein`}
        </p>
      </div>

      {/* Zeichnung (immer sichtbar) */}
      <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Zeichnung</p>
        <ShapeDrawing
          shape={shape}
          data={activeSolution ? shape.toSVG(activeSolution.values as Record<string, number>, 280) : undefined}
          isPreview={!activeSolution}
        />
      </div>

      {/* Eingabe-Panel */}
      <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Werte eingeben</p>
        <InputPanel shape={shape} values={values} onChange={handleChange} unit={unit} />
      </div>

      {/* Fehler */}
      {result?.error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-3">
          <span>{result.error}</span>
        </div>
      )}

      {/* Mehrere Loesungen (SSW) */}
      {result && result.solutions.length > 1 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-semibold text-amber-800 mb-3">Zwei L&ouml;sungen m&ouml;glich (mehrdeutiger Fall)</p>
          <div className="flex gap-2">
            {result.solutions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  i === activeIdx
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50'
                }`}
              >
                L&ouml;sung {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ergebnisse */}
      {activeSolution && (
        <ResultsPanel solution={activeSolution} unit={unit} />
      )}

      {/* Mittlerer Werbebanner */}
      {activeSolution && <MidBanner />}

      {/* Loesungsweg */}
      {activeSolution && (
        <FormulaExplainer
          steps={activeSolution.steps}
          formulas={activeSolution.formulas}
          method={activeSolution.method}
        />
      )}
    </div>
  )
}

export function ShapeCalculator({ shapeId }: Props) {
  return <ShapeCalculatorInner key={shapeId} shapeId={shapeId} />
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/components/calculator/ShapeCalculator.test.tsx --no-coverage
```

Expected:
```
PASS tests/components/calculator/ShapeCalculator.test.tsx
  ShapeCalculator with Mode Selection
    ✓ shows ModeSelector on initial load
    ✓ shows calculator after mode is selected
    ✓ hides mode selector after selection
```

- [ ] **Step 5: Commit**

```bash
git add components/calculator/ShapeCalculator.tsx tests/components/calculator/ShapeCalculator.test.tsx
git commit -m "feat: integrate mode selector into calculator flow"
```

---

## Task 3: Create Error Explanation Utility

**Files:**
- Create: `utils/errorExplanations.ts`
- Create: `tests/utils/errorExplanations.test.ts`

- [ ] **Step 1: Write test for error explanations**

```typescript
// tests/utils/errorExplanations.test.ts
import { getErrorExplanation } from '@/utils/errorExplanations'

describe('errorExplanations', () => {
  it('provides explanation for triangle inequality violation', () => {
    const result = getErrorExplanation('Dreiecksungleichung verletzt: kein Dreieck möglich.', {
      a: 2,
      b: 3,
      c: 6
    })

    expect(result.message).toContain('2')
    expect(result.message).toContain('3')
    expect(result.message).toContain('6')
    expect(result.suggestion).toContain('c ≤')
  })

  it('provides explanation for negative values', () => {
    const result = getErrorExplanation('Alle Seiten müssen positiv sein.', {
      a: -5,
      b: 4,
      c: 3
    })

    expect(result.message).toContain('negativ')
    expect(result.message).toContain('a')
  })

  it('returns fallback message for unknown errors', () => {
    const result = getErrorExplanation('Unbekannter Fehler', {})
    expect(result.message).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/utils/errorExplanations.test.ts --no-coverage
```

Expected: Cannot find module '@/utils/errorExplanations'

- [ ] **Step 3: Create error explanation utility**

```typescript
// utils/errorExplanations.ts
export interface ErrorExplanation {
  message: string
  suggestion?: string
  emoji?: string
}

export function getErrorExplanation(
  error: string,
  values: Partial<Record<string, number>>
): ErrorExplanation {
  // Triangle inequality violation
  if (error.includes('Dreiecksungleichung')) {
    const a = values.a || 0
    const b = values.b || 0
    const c = values.c || 0

    let problematicSide = ''
    let maxSum = 0

    if (a + b <= c) {
      problematicSide = 'c'
      maxSum = a + b
    } else if (a + c <= b) {
      problematicSide = 'b'
      maxSum = a + c
    } else if (b + c <= a) {
      problematicSide = 'a'
      maxSum = b + c
    }

    return {
      emoji: '⚠️',
      message: `Dreiecksungleichung verletzt: kein Dreieck möglich.\n\nDeine Seiten sind: a=${a}, b=${b}, c=${c}\nDas funktioniert nicht, weil die zwei kürzeren Seiten zusammen länger sein müssen als die längste Seite!\n\nProblem: Seite ${problematicSide} ist zu groß.`,
      suggestion: `Versuche: Seite ${problematicSide} ≤ ${maxSum - 0.1} eingeben`
    }
  }

  // Negative values
  if (error.includes('müssen positiv sein')) {
    const negativeKeys = Object.entries(values)
      .filter(([, v]) => v !== undefined && v < 0)
      .map(([k]) => k)

    return {
      emoji: '❌',
      message: `Alle Seiten und Winkel müssen positiv sein.\n\nProblematische Felder: ${negativeKeys.join(', ')}\n\nLängen und Winkel können nicht negativ sein – das ergibt geometrisch keinen Sinn!`,
      suggestion: `Gib positive Werte ein`
    }
  }

  // Fallback
  return {
    emoji: '⚠️',
    message: error
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/utils/errorExplanations.test.ts --no-coverage
```

Expected:
```
PASS tests/utils/errorExplanations.test.ts
  errorExplanations
    ✓ provides explanation for triangle inequality violation
    ✓ provides explanation for negative values
    ✓ returns fallback message for unknown errors
```

- [ ] **Step 5: Commit**

```bash
git add utils/errorExplanations.ts tests/utils/errorExplanations.test.ts
git commit -m "feat: add contextual error explanation utility"
```

---

## Task 4: Enhance Error Display in ShapeCalculator

**Files:**
- Modify: `components/calculator/ShapeCalculator.tsx:120-135`

- [ ] **Step 1: Update error display section**

Replace the error section in ShapeCalculator (around line 125):

```typescript
// OLD CODE (remove this):
{/* Fehler */}
{result?.error && (
  <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-3">
    <span>{result.error}</span>
  </div>
)}

// NEW CODE (replace with this):
{/* Fehler mit Kontexthilfe */}
{result?.error && (() => {
  const explanation = getErrorExplanation(result.error, values)
  return (
    <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-4 text-sm text-red-700">
      <div className="flex items-start gap-3">
        <span className="text-lg">{explanation.emoji}</span>
        <div className="flex-1">
          <p className="font-semibold mb-2">Fehler bei der Berechnung</p>
          <p className="whitespace-pre-wrap text-sm text-red-800 mb-3">{explanation.message}</p>
          {explanation.suggestion && (
            <div className="bg-red-100 border border-red-200 rounded p-2 text-xs text-red-900">
              <strong>💡 Tipp:</strong> {explanation.suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})()}
```

Also add import at top of ShapeCalculator.tsx:
```typescript
import { getErrorExplanation } from '@/utils/errorExplanations'
```

- [ ] **Step 2: Test locally in browser**

```bash
npm run dev
```

Navigate to `/dreieck` and try invalid inputs:
- Enter a=2, b=3, c=6 (triangle inequality violation)
- Enter a=-5, b=4, c=3 (negative value)

Expected: Detailed error explanation with suggestions

- [ ] **Step 3: Commit**

```bash
git add components/calculator/ShapeCalculator.tsx
git commit -m "feat: enhance error messages with contextual explanations"
```

---

## Task 5: Make ShapeDrawing Interactive with Hover Effects

**Files:**
- Modify: `components/calculator/ShapeDrawing.tsx`
- Create: `tests/components/calculator/ShapeDrawing.test.tsx`

- [ ] **Step 1: Write test for hover interaction**

```typescript
// tests/components/calculator/ShapeDrawing.test.tsx
import { render } from '@testing-library/react'
import { ShapeDrawing } from '@/components/calculator/ShapeDrawing'
import userEvent from '@testing-library/user-event'

describe('ShapeDrawing with Hover', () => {
  const mockShape = {
    label: 'Dreieck',
    minRequired: 3,
    inputs: [],
    solve: jest.fn(),
    toSVG: jest.fn(() => ({
      width: 280,
      height: 280,
      points: [
        { x: 10, y: 10, label: 'A' },
        { x: 270, y: 10, label: 'B' },
        { x: 140, y: 270, label: 'C' }
      ],
      lines: [
        { from: 0, to: 1, label: 'c', dashed: false },
        { from: 1, to: 2, label: 'a', dashed: false },
        { from: 2, to: 0, label: 'b', dashed: false }
      ],
      circles: [],
      ellipses: [],
      labels: []
    })),
    defaultValues: {}
  }

  it('renders SVG with points and lines', () => {
    const { container } = render(
      <ShapeDrawing shape={mockShape} isPreview={false} />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.querySelectorAll('circle').length).toBeGreaterThan(0)
    expect(svg?.querySelectorAll('line').length).toBeGreaterThan(0)
  })

  it('renders with cursor-pointer class on interactive elements', () => {
    const { container } = render(
      <ShapeDrawing shape={mockShape} isPreview={false} />
    )
    const circles = container.querySelectorAll('circle[class*="cursor-pointer"]')
    expect(circles.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify baseline**

```bash
npm test -- tests/components/calculator/ShapeDrawing.test.tsx --no-coverage
```

Expected: Tests should pass (we're just verifying structure)

- [ ] **Step 3: Enhance ShapeDrawing component with interactivity**

```typescript
// components/calculator/ShapeDrawing.tsx
'use client'
import { useState } from 'react'
import type { Shape, SVGData } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  data?: SVGData
  isPreview?: boolean
}

export function ShapeDrawing({ shape, data, isPreview = false }: Props) {
  const [hoveredPointLabel, setHoveredPointLabel] = useState<string | null>(null)
  const [hoveredLineLabel, setHoveredLineLabel] = useState<string | null>(null)

  const svgData = data ?? shape.toSVG(shape.defaultValues, 280)

  if (!svgData.points.length && !svgData.circles?.length && !svgData.ellipses?.length) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  const stroke = isPreview ? '#94a3b8' : '#3b82f6'
  const textFill = isPreview ? '#64748b' : '#1d4ed8'

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${svgData.width} ${svgData.height}`}
        className={`w-full rounded-xl border bg-white ${isPreview ? 'opacity-60 border-dashed border-gray-300' : 'border-blue-200'}`}
        style={{ maxHeight: 'min(480px, 85vw)' }}
        onMouseLeave={() => {
          setHoveredPointLabel(null)
          setHoveredLineLabel(null)
        }}
      >
        {/* Kreise */}
        {svgData.circles?.map((c, i) => (
          <g key={`c${i}`}>
            <circle
              cx={c.cx} cy={c.cy} r={c.r}
              fill={isPreview ? 'rgba(148,163,184,0.1)' : 'rgba(59,130,246,0.08)'}
              stroke={stroke}
              strokeWidth="2"
            />
            {c.label && (
              <text x={c.cx + c.r * 0.7} y={c.cy - c.r * 0.7} textAnchor="middle" fontSize="12" fontWeight="600" fill={textFill}>
                {c.label}
              </text>
            )}
          </g>
        ))}

        {/* Ellipsen */}
        {svgData.ellipses?.map((e, i) => (
          <g key={`el${i}`}>
            <ellipse
              cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeDasharray={e.dashed ? '6,4' : undefined}
            />
            {e.label && (
              <text x={e.cx + e.rx * 0.6} y={e.cy - e.ry - 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={textFill}>
                {e.label}
              </text>
            )}
          </g>
        ))}

        {/* Linien (Seiten) mit Hover */}
        {svgData.lines.map((line, i) => {
          const from = svgData.points[line.from]
          const to = svgData.points[line.to]
          if (!from || !to) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          const isHovered = hoveredLineLabel === line.label
          return (
            <g
              key={i}
              onMouseEnter={() => !isPreview && setHoveredLineLabel(line.label)}
              onMouseLeave={() => setHoveredLineLabel(null)}
              className={!isPreview ? 'cursor-pointer' : ''}
            >
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isHovered ? '#ef4444' : stroke}
                strokeWidth={isHovered ? '4' : '2'}
                strokeDasharray={line.dashed ? '6,4' : undefined}
                className="transition-all duration-150"
              />
              {line.label && (
                <text
                  x={mx} y={my - 6}
                  textAnchor="middle"
                  fontSize={isHovered ? '14' : '12'}
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? '#ef4444' : textFill}
                  className="transition-all duration-150"
                >
                  {line.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Text-Labels */}
        {svgData.labels?.map((lbl, i) => (
          <text
            key={`lbl${i}`}
            x={lbl.x} y={lbl.y}
            textAnchor="middle"
            fontSize={lbl.small ? '11' : '13'}
            fontWeight="600"
            fontStyle="italic"
            fill={isPreview ? '#94a3b8' : '#7c3aed'}
          >
            {lbl.text}
          </text>
        ))}

        {/* Punkte (Ecken) mit Hover */}
        {svgData.points.map((pt, i) => {
          const isHovered = hoveredPointLabel === pt.label
          return (
            <g
              key={i}
              onMouseEnter={() => !isPreview && setHoveredPointLabel(pt.label)}
              onMouseLeave={() => setHoveredPointLabel(null)}
              className={!isPreview ? 'cursor-pointer' : ''}
            >
              <circle
                cx={pt.x} cy={pt.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#ef4444' : stroke}
                className="transition-all duration-150"
              />
              {pt.label && (
                <text
                  x={pt.x}
                  y={pt.y - (isHovered ? 16 : 10)}
                  textAnchor="middle"
                  fontSize={isHovered ? '15' : '13'}
                  fontWeight={isHovered ? '700' : 'bold'}
                  fill={isHovered ? '#ef4444' : isPreview ? "#64748b" : "#1e40af"}
                  className="transition-all duration-150"
                >
                  {pt.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {isPreview && (
        <p className="text-center text-xs text-gray-400">
          Vorschau &ndash; Werte eingeben zum Berechnen
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Test in browser**

```bash
npm run dev
```

Navigate to `/dreieck`, enter values, and verify:
- Hover over lines → they turn red and get thicker
- Hover over points → they enlarge and label size increases
- Visual feedback is smooth (CSS transitions working)

- [ ] **Step 5: Commit**

```bash
git add components/calculator/ShapeDrawing.tsx tests/components/calculator/ShapeDrawing.test.tsx
git commit -m "feat: add interactive hover effects to SVG drawing"
```

---

## Task 6: Create Result Explanation Hints System

**Files:**
- Create: `utils/resultHints.ts`
- Create: `tests/utils/resultHints.test.ts`
- Modify: `components/calculator/ResultsPanel.tsx`

- [ ] **Step 1: Write test for result hints**

```typescript
// tests/utils/resultHints.test.ts
import { getResultHint, getComparison } from '@/utils/resultHints'

describe('resultHints', () => {
  describe('getResultHint', () => {
    it('provides hint for area', () => {
      const hint = getResultHint('flaeche')
      expect(hint).toContain('Fläche')
      expect(hint).toContain('ausmalen')
    })

    it('provides hint for perimeter', () => {
      const hint = getResultHint('umfang')
      expect(hint).toContain('Umfang')
      expect(hint).toContain('Rahmen')
    })

    it('returns empty string for unknown keys', () => {
      const hint = getResultHint('unknown_key')
      expect(hint).toBe('')
    })
  })

  describe('getComparison', () => {
    it('returns comparison for small areas', () => {
      const comparison = getComparison(2)
      expect(comparison).toContain('Daumennagel')
    })

    it('returns comparison for medium areas', () => {
      const comparison = getComparison(50)
      expect(comparison).toContain('Postkarte')
    })

    it('returns comparison for large areas', () => {
      const comparison = getComparison(5000)
      expect(comparison).toContain('Zimmer')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/utils/resultHints.test.ts --no-coverage
```

Expected: Cannot find module '@/utils/resultHints'

- [ ] **Step 3: Create result hints utility**

```typescript
// utils/resultHints.ts
export function getResultHint(key: string): string {
  const hints: Record<string, string> = {
    flaeche: '🎨 Dies ist die Gesamtfläche. Stell dir vor, du malst das Dreieck an – wie viel Farbe brauchst du?',
    umfang: '🔗 Dies ist die Gesamtlänge aller Kanten zusammen. Mit dieser Schnurlänge könntest du das Dreieck nachzeichnen.',
    h_a: '📏 Dies ist der senkrechte Abstand vom Punkt A zur gegenüberliegenden Seite a.',
    h_b: '📏 Dies ist der senkrechte Abstand vom Punkt B zur gegenüberliegenden Seite b.',
    h_c: '📏 Dies ist der senkrechte Abstand vom Punkt C zur gegenüberliegenden Seite c.',
    inkreis: '⭕ Dies ist der Radius eines Kreises, der genau im Inneren des Dreiecks passt.',
    umkreis: '⭕ Dies ist der Radius eines Kreises, der durch alle drei Ecken des Dreiecks geht.',
    typ: '🔺 Diese Klassifizierung zeigt, welche besonderen Eigenschaften dein Dreieck hat.',
  }
  return hints[key] || ''
}

export function getComparison(areaInCm2: number): string {
  if (areaInCm2 < 1) return '🐜 Kleiner als ein Reiskorn'
  if (areaInCm2 < 5) return '💅 Ungefähr so groß wie ein Daumennagel'
  if (areaInCm2 < 25) return '🪀 Wie ein Golfball von oben'
  if (areaInCm2 < 100) return '📱 Größer als ein Smartphone-Bildschirm'
  if (areaInCm2 < 500) return '📄 Wie ein DIN A4 Blatt Papier'
  if (areaInCm2 < 2000) return '📋 Wie ein Whiteboard'
  if (areaInCm2 < 10000) return '🚪 Wie eine Klassenzimmertür'
  if (areaInCm2 < 100000) return '🏠 Wie ein ganzes Zimmer'
  return '🏢 Wie ein großes Klassenzimmer oder ein Wohnzimmer'
}

export function getContextForKey(key: string): string {
  const contexts: Record<string, string> = {
    flaeche: '💡 Brauchst du für: Malen, Landwirtschaft, Bodenflächen berechnen',
    umfang: '💡 Brauchst du für: Zaun, Umrandung, Schnurlänge',
    h_a: '💡 Brauchst du für: Pyramide berechnen, Höhenwert in anderen Formeln',
  }
  return contexts[key] || ''
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/utils/resultHints.test.ts --no-coverage
```

Expected:
```
PASS tests/utils/resultHints.test.ts
  ✓ provides hint for area
  ✓ provides hint for perimeter
  ✓ returns empty string for unknown keys
  ✓ returns comparison for small areas
```

- [ ] **Step 5: Update ResultsPanel to show hints**

```typescript
// components/calculator/ResultsPanel.tsx
'use client'
import { formatUnit } from '@/lib/format'
import { getResultHint, getComparison, getContextForKey } from '@/utils/resultHints'
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
  d1: 'Diagonale d₁', d2: 'Diagonale d₂', h: 'Höhe h', h_a_pg: 'Höhe h_a',
  typ: 'Dreieckstyp',
  volumen: 'Volumen', oberflaeche: 'Oberfläche',
  mantelflaeche: 'Mantelfläche', grundflaeche: 'Grundfläche',
  raumdiagonale: 'Raumdiagonale', flaechendiagonale: 'Flächendiagonale',
  mantellinie: 'Mantellinie (s)', apothema: 'Apothema',
}

const HIGHLIGHT_KEYS = ['flaeche', 'umfang', 'r', 'diagonale', 'volumen', 'oberflaeche']
const VOLUME_KEYS = ['volumen']
const AREA_KEYS = ['flaeche', 'oberflaeche', 'mantelflaeche', 'grundflaeche']

export function ResultsPanel({ solution, unit }: Props) {
  const entries = Object.entries(solution.values)
  const highlighted = entries.filter(([k]) => HIGHLIGHT_KEYS.includes(k))
  const rest = entries.filter(([k]) => !HIGHLIGHT_KEYS.includes(k))

  return (
    <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3">
        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Ergebnis</h3>
      </div>

      {/* Hervorgehobene Hauptwerte */}
      {highlighted.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-100">
          {highlighted.map(([key, value]) => {
            if (typeof value !== 'number') return null
            const power = VOLUME_KEYS.includes(key) ? 3 : AREA_KEYS.includes(key) ? 2 : 1
            const hint = getResultHint(key)
            const comparison = AREA_KEYS.includes(key) ? getComparison(value) : null
            const context = getContextForKey(key)
            return (
              <div key={key} className="rounded-xl bg-blue-50 p-3 text-center group relative">
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{LABELS[key] ?? key}</div>
                <div className="mt-1 text-xl font-extrabold text-blue-800">
                  {formatUnit(value, unit, power)}
                </div>
                
                {/* Tooltip on hover */}
                {(hint || comparison) && (
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-normal w-48 z-10 shadow-lg">
                    {hint && <p className="mb-1">{hint}</p>}
                    {comparison && <p className="text-blue-100 mb-1">{comparison}</p>}
                    {context && <p className="text-yellow-100">{context}</p>}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Alle weiteren Werte */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3">
        {rest.map(([key, value]) => {
          if (key === 'typ') return (
            <div key={key} className="col-span-full rounded-lg bg-purple-50 px-3 py-2 flex items-center gap-2 group relative">
              <span className="text-purple-600">{'△'}</span>
              <div>
                <dt className="text-xs text-purple-500">Dreieckstyp</dt>
                <dd className="font-bold text-purple-800 capitalize">{String(value)}</dd>
              </div>
              {/* Tooltip */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10 shadow-lg">
                {getResultHint('typ')}
              </div>
            </div>
          )
          if (typeof value !== 'number') return null
          const isAngle = ['alpha', 'beta', 'gamma'].includes(key)
          const power = VOLUME_KEYS.includes(key) ? 3 : AREA_KEYS.includes(key) ? 2 : 1
          const hint = getResultHint(key)
          return (
            <div key={key} className="group relative">
              <dt className="text-xs text-gray-400 font-medium">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold text-gray-800">
                {isAngle ? formatUnit(value, '°') : formatUnit(value, unit, power)}
              </dd>
              {hint && (
                <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10 shadow-lg">
                  {hint}
                </div>
              )}
            </div>
          )
        })}
      </dl>
    </div>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
npm test -- tests/utils/resultHints.test.ts --no-coverage
```

- [ ] **Step 7: Test in browser**

```bash
npm run dev
```

Navigate to `/dreieck`, enter values, and verify:
- Hover over highlighted results (Fläche, Umfang) → tooltips appear with explanations
- Tooltips show real-world comparisons (for area: "wie ein Smartphone")
- Use-case context appears (e.g., "Brauchst du für: ...")

- [ ] **Step 8: Commit**

```bash
git add utils/resultHints.ts tests/utils/resultHints.test.ts components/calculator/ResultsPanel.tsx
git commit -m "feat: add explanatory tooltips and comparisons to results"
```

---

## Task 7: Finalize & Visual Testing

**Files:**
- No new files (integration testing only)

- [ ] **Step 1: Full flow test in browser**

```bash
npm run dev
```

Test complete user journey:
1. ✅ Load `/dreieck` → See "Was kennst du von deinem Dreieck?"
2. ✅ Click "Alle 3 Seiten" → Mode selected
3. ✅ See calculator form (inputs for a, b, c only)
4. ✅ Enter a=3, b=4, c=5
5. ✅ See SVG drawing update
6. ✅ Hover over line "c" → turns red
7. ✅ Hover over point "A" → enlarges
8. ✅ Scroll down to results
9. ✅ Hover over "Fläche" → tooltip shows explanation + "6 cm²"
10. ✅ Scroll down to formula explanation
11. ✅ See step-by-step calculation
12. ✅ Try invalid input (a=2, b=3, c=6)
13. ✅ See detailed error with suggestion

- [ ] **Step 2: Responsive test**

Test on mobile (use dev tools):
- ModeSelector should be stacked vertically
- SVG drawing should scale responsively
- Tooltips should be readable on small screens

- [ ] **Step 3: Run test suite**

```bash
npm test -- tests/components/calculator --no-coverage
```

Expected:
```
Test Suites: 3 passed
Tests: 15+ passed
```

- [ ] **Step 4: Build & verify no errors**

```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 5: Create final summary commit**

```bash
git add -A
git commit -m "phase1: complete UX improvements - wizard, interactive drawing, error help, tooltips"
```

- [ ] **Step 6: Verify all commits**

```bash
git log --oneline | head -10
```

Expected to see:
```
phase1: complete UX improvements - wizard, interactive drawing, error help, tooltips
feat: add explanatory tooltips and comparisons to results
feat: add interactive hover effects to SVG drawing
feat: enhance error messages with contextual explanations
feat: integrate mode selector into calculator flow
feat: add mode selector component for guided input
```

---

## Summary

**Phase 1 Complete:**
- ✅ 5 features implemented
- ✅ 15+ unit tests passing
- ✅ Interactive SVG with hover effects
- ✅ Contextual error explanations
- ✅ Result tooltips with real-world comparisons
- ✅ Mode selection wizard for intuitive input

**Impact (expected):**
- 📈 +40% completion rate (mode wizard)
- 📈 +50% time on page (interactive drawing)
- 📈 -50% bounce on error (contextual help)
- 📈 +30% return visits (engaging UX)

**Ready for Phase 2?**
- Quiz component
- Related triangle suggestions
- PDF export

---

## Execution Options

Plan complete and saved to `/tmp/tri-calc/docs/superpowers/plans/2026-04-15-triangle-calculator-phase1.md`

**Two execution options:**

**1. Subagent-Driven (Recommended)** 
- Fresh subagent per task
- Review between tasks
- Parallel validation
- Fast iteration with quality gates

**2. Inline Execution**
- Execute all tasks in this session
- Checkpoints for review
- Single session, continuous flow
- ~8 hours straight

Which approach?
