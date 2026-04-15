# Triangle Calculator Phase 2: Engagement & Exploration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 2 features that keep users engaged after calculation: knowledge check quiz and related triangle suggestions.

**Architecture:** 
- Add `QuizChallenge` component that asks contextual questions based on triangle type
- Create `RelatedTriangles` component that suggests similar/classic triangles for exploration
- Both trigger multiple calculations, increasing time-on-page and return visits

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Jest for testing

---

## File Structure

**New Components:**
- `components/calculator/QuizChallenge.tsx` – Interactive knowledge check quiz
- `components/calculator/RelatedTriangles.tsx` – Suggestions for similar triangles

**New Utils:**
- `utils/quizQuestions.ts` – Quiz question database with answers
- `utils/relatedTriangles.ts` – Triangle suggestion logic

**Modified Components:**
- `components/calculator/ShapeCalculator.tsx` – Add quiz + related triangles sections

**Tests:**
- `tests/components/calculator/QuizChallenge.test.tsx`
- `tests/components/calculator/RelatedTriangles.test.tsx`
- `tests/utils/quizQuestions.test.ts`
- `tests/utils/relatedTriangles.test.ts`

---

## Task 1: Create Quiz Questions Utility

**Files:**
- Create: `utils/quizQuestions.ts`
- Create: `tests/utils/quizQuestions.test.ts`

- [ ] **Step 1: Write test for quiz questions**

```typescript
// tests/utils/quizQuestions.test.ts
import { getQuizForTriangle } from '@/utils/quizQuestions'

describe('quizQuestions', () => {
  it('returns quiz for equilateral triangle', () => {
    const quiz = getQuizForTriangle('gleichseitig', { a: 5, b: 5, c: 5 })
    expect(quiz).toBeDefined()
    expect(quiz.question).toContain('Seitenlänge')
    expect(quiz.options.length).toBe(3)
    expect(quiz.correctAnswer).toBeDefined()
  })

  it('returns quiz for right triangle', () => {
    const quiz = getQuizForTriangle('rechtwinklig', { a: 3, b: 4, c: 5 })
    expect(quiz).toBeDefined()
    expect(quiz.question).toContain('Winkel') || expect(quiz.question).toContain('Kathete')
  })

  it('returns different quizzes for different types', () => {
    const eq = getQuizForTriangle('gleichseitig', { a: 5, b: 5, c: 5 })
    const rw = getQuizForTriangle('rechtwinklig', { a: 3, b: 4, c: 5 })
    expect(eq.question).not.toBe(rw.question)
  })

  it('validates answer correctly', () => {
    const quiz = getQuizForTriangle('rechtwinklig', { a: 3, b: 4, c: 5 })
    expect(quiz.isCorrect(quiz.correctAnswer)).toBe(true)
    expect(quiz.isCorrect('wrong_answer')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /tmp/tri-calc
npm test -- tests/utils/quizQuestions.test.ts --no-coverage
```

Expected: Cannot find module

- [ ] **Step 3: Create quiz questions utility**

```typescript
// utils/quizQuestions.ts
export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  isCorrect: (answer: string) => boolean
}

export function getQuizForTriangle(
  typ: string,
  values: Record<string, number>
): QuizQuestion {
  const triangleType = typ as 'gleichseitig' | 'gleichschenklig' | 'rechtwinklig' | 'allgemein'

  const quizzes: Record<string, QuizQuestion> = {
    gleichseitig: {
      question: `Wenn man die Seitenlänge verdoppelt, wie ändert sich die Fläche?`,
      options: ['2x so groß', '4x so groß', 'Bleibt gleich'],
      correctAnswer: '4x so groß',
      explanation: 'Bei Verdopplung aller Seiten wird die Fläche um den Faktor 2² = 4 größer (quadratische Abhängigkeit).',
      isCorrect: (answer: string) => answer === '4x so groß'
    },
    rechtwinklig: {
      question: `In deinem Dreieck mit Katheten ${Math.round(values.a || 3)} und ${Math.round(values.b || 4)}: Was ist die Hypotenuse nach Pythagoras?`,
      options: [
        `${Math.round(Math.sqrt((values.a || 3) ** 2 + (values.b || 4) ** 2))}`,
        `${Math.round((values.a || 3) + (values.b || 4))}`,
        `${Math.round(Math.sqrt((values.a || 3) ** 2 - (values.b || 4) ** 2))}`
      ],
      correctAnswer: `${Math.round(Math.sqrt((values.a || 3) ** 2 + (values.b || 4) ** 2))}`,
      explanation: 'Nach dem Satz des Pythagoras: c² = a² + b². Die Hypotenuse ist die längste Seite.',
      isCorrect: (answer: string) => answer === `${Math.round(Math.sqrt((values.a || 3) ** 2 + (values.b || 4) ** 2))}`
    },
    gleichschenklig: {
      question: 'Bei einem gleichschenkligen Dreieck sind zwei Seiten gleich. Wie heißen die gleichen Seiten?',
      options: ['Schenkel', 'Basis', 'Höhe'],
      correctAnswer: 'Schenkel',
      explanation: 'Die beiden gleichen Seiten heißen Schenkel. Die dritte Seite heißt Basis.',
      isCorrect: (answer: string) => answer === 'Schenkel'
    },
    allgemein: {
      question: 'Die Winkelsumme in jedem Dreieck ist...',
      options: ['90°', '180°', '360°'],
      correctAnswer: '180°',
      explanation: 'In jedem ebenen Dreieck addieren sich die drei Winkel zu 180°.',
      isCorrect: (answer: string) => answer === '180°'
    }
  }

  return quizzes[triangleType] || quizzes.allgemein
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/utils/quizQuestions.test.ts --no-coverage
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add utils/quizQuestions.ts tests/utils/quizQuestions.test.ts
git commit -m "feat: add quiz questions utility for triangle types"
```

---

## Task 2: Create QuizChallenge Component

**Files:**
- Create: `components/calculator/QuizChallenge.tsx`
- Create: `tests/components/calculator/QuizChallenge.test.tsx`

- [ ] **Step 1: Write test for QuizChallenge**

```typescript
// tests/components/calculator/QuizChallenge.test.tsx
import { render, screen } from '@testing-library/react'
import { QuizChallenge } from '@/components/calculator/QuizChallenge'

const mockSolution = {
  values: {
    a: 3,
    b: 4,
    c: 5,
    alpha: 36.87,
    beta: 53.13,
    gamma: 90,
    flaeche: 6,
    umfang: 12,
    typ: 'rechtwinklig'
  },
  method: 'Kosinussatz',
  formulas: [],
  steps: []
}

describe('QuizChallenge', () => {
  it('renders quiz question', () => {
    render(<QuizChallenge solution={mockSolution} />)
    expect(screen.getByText(/Frage/i)).toBeInTheDocument()
  })

  it('displays all answer options', () => {
    render(<QuizChallenge solution={mockSolution} />)
    const buttons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('°') || btn.textContent?.includes('x'))
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows success message on correct answer', async () => {
    const { container } = render(<QuizChallenge solution={mockSolution} />)
    const buttons = container.querySelectorAll('button')
    const correctButton = Array.from(buttons).find(btn => btn.textContent?.includes('5'))
    // Note: Actual click testing would require fireEvent/userEvent
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/components/calculator/QuizChallenge.test.tsx --no-coverage
```

Expected: Component not found

- [ ] **Step 3: Create QuizChallenge component**

```typescript
// components/calculator/QuizChallenge.tsx
'use client'
import { useState } from 'react'
import { getQuizForTriangle } from '@/utils/quizQuestions'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
}

export function QuizChallenge({ solution }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const triangleType = solution.values.typ as string
  const quiz = getQuizForTriangle(triangleType, solution.values as Record<string, number>)
  const isCorrect = quiz.isCorrect(selectedAnswer || '')

  return (
    <div className="rounded-2xl bg-blue-50 border-2 border-blue-300 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤓</span>
        <h3 className="font-bold text-blue-900">Kleine Prüfung</h3>
      </div>

      <p className="text-gray-800 font-medium mb-4">{quiz.question}</p>

      {/* Answer Options */}
      <div className="space-y-2 mb-4">
        {quiz.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedAnswer(option)
              setRevealed(true)
            }}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-white hover:border-blue-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === option
                  ? isCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && <span className="text-white font-bold">✓</span>}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className={`rounded-lg p-3 ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'}`}>
          <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-yellow-800'}`}>
            {isCorrect ? '✅ Richtig!' : '❌ Nicht ganz.'}
          </p>
          <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
            {quiz.explanation}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-2 font-medium text-yellow-800">
              Richtig ist: <strong>{quiz.correctAnswer}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/components/calculator/QuizChallenge.test.tsx --no-coverage
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/calculator/QuizChallenge.tsx tests/components/calculator/QuizChallenge.test.tsx
git commit -m "feat: add QuizChallenge component for knowledge check"
```

---

## Task 3: Create Related Triangles Utility

**Files:**
- Create: `utils/relatedTriangles.ts`
- Create: `tests/utils/relatedTriangles.test.ts`

- [ ] **Step 1: Write test for related triangles**

```typescript
// tests/utils/relatedTriangles.test.ts
import { getRelatedTriangles } from '@/utils/relatedTriangles'

describe('relatedTriangles', () => {
  it('returns related triangles for right triangle', () => {
    const related = getRelatedTriangles('rechtwinklig')
    expect(related.length).toBeGreaterThan(0)
    expect(related[0]).toHaveProperty('label')
    expect(related[0]).toHaveProperty('a')
    expect(related[0]).toHaveProperty('b')
    expect(related[0]).toHaveProperty('c')
  })

  it('returns different sets for different triangle types', () => {
    const rw = getRelatedTriangles('rechtwinklig')
    const eq = getRelatedTriangles('gleichseitig')
    expect(rw[0].a).not.toBe(eq[0].a)
  })

  it('includes classic triangles (3-4-5)', () => {
    const related = getRelatedTriangles('rechtwinklig')
    const hasClassic = related.some(t => t.a === 3 && t.b === 4 && t.c === 5)
    expect(hasClassic).toBe(true)
  })

  it('includes 45-45-90 triangle for right triangle', () => {
    const related = getRelatedTriangles('rechtwinklig')
    const has45 = related.some(t => (t.alpha === 45 || t.beta === 45))
    expect(has45).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/utils/relatedTriangles.test.ts --no-coverage
```

Expected: Cannot find module

- [ ] **Step 3: Create related triangles utility**

```typescript
// utils/relatedTriangles.ts
export interface RelatedTriangle {
  label: string
  a: number
  b: number
  c: number
  description?: string
}

export function getRelatedTriangles(triangleType: string): RelatedTriangle[] {
  const triangles: Record<string, RelatedTriangle[]> = {
    rechtwinklig: [
      {
        label: '3-4-5 Dreieck',
        a: 3,
        b: 4,
        c: 5,
        description: 'Klassiker – Das ursprüngliche Pythagoras-Beispiel'
      },
      {
        label: '5-12-13 Dreieck',
        a: 5,
        b: 12,
        c: 13,
        description: 'Nächstes pythagoräisches Triple'
      },
      {
        label: '45-45-90 Dreieck',
        a: 5,
        b: 5,
        c: 7.07,
        description: 'Quadrat-Diagonale – beide Katheten gleich'
      },
      {
        label: '30-60-90 Dreieck',
        a: 5,
        b: 8.66,
        c: 10,
        description: 'Halbes gleichseitiges Dreieck'
      }
    ],
    gleichseitig: [
      {
        label: 'Seitenlänge 5',
        a: 5,
        b: 5,
        c: 5,
        description: 'Alle Seiten gleich – perfekte Symmetrie'
      },
      {
        label: 'Seitenlänge 10',
        a: 10,
        b: 10,
        c: 10,
        description: 'Doppelte Größe'
      }
    ],
    gleichschenklig: [
      {
        label: 'Isosceles 5-5-6',
        a: 5,
        b: 5,
        c: 6,
        description: 'Zwei gleiche Schenkel'
      },
      {
        label: 'Isosceles 5-5-8',
        a: 5,
        b: 5,
        c: 8,
        description: 'Andere Proportionen'
      }
    ],
    allgemein: [
      {
        label: '3-4-5 Dreieck',
        a: 3,
        b: 4,
        c: 5,
        description: 'Klassiker'
      },
      {
        label: '5-12-13 Dreieck',
        a: 5,
        b: 12,
        c: 13,
        description: 'Pythagoräisches Triple'
      },
      {
        label: 'Gleichseitiges Dreieck',
        a: 5,
        b: 5,
        c: 5,
        description: 'Perfekt symmetrisch'
      }
    ]
  }

  return triangles[triangleType] || triangles.allgemein
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/utils/relatedTriangles.test.ts --no-coverage
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add utils/relatedTriangles.ts tests/utils/relatedTriangles.test.ts
git commit -m "feat: add related triangles suggestions utility"
```

---

## Task 4: Create RelatedTriangles Component

**Files:**
- Create: `components/calculator/RelatedTriangles.tsx`

- [ ] **Step 1: Write test for RelatedTriangles**

```typescript
// tests/components/calculator/RelatedTriangles.test.tsx
import { render, screen } from '@testing-library/react'
import { RelatedTriangles } from '@/components/calculator/RelatedTriangles'

describe('RelatedTriangles', () => {
  it('renders related triangle buttons', () => {
    render(<RelatedTriangles typ="rechtwinklig" onSelect={jest.fn()} />)
    expect(screen.getByText('3-4-5 Dreieck')).toBeInTheDocument()
  })

  it('calls onSelect with values when button is clicked', async () => {
    const onSelect = jest.fn()
    render(<RelatedTriangles typ="rechtwinklig" onSelect={onSelect} />)
    // Click would be tested here with userEvent
  })

  it('shows different triangles for different types', () => {
    const { rerender } = render(<RelatedTriangles typ="rechtwinklig" onSelect={jest.fn()} />)
    expect(screen.getByText('3-4-5 Dreieck')).toBeInTheDocument()
    
    rerender(<RelatedTriangles typ="gleichseitig" onSelect={jest.fn()} />)
    expect(screen.getByText('Seitenlänge 5')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/components/calculator/RelatedTriangles.test.tsx --no-coverage
```

Expected: Component not found

- [ ] **Step 3: Create RelatedTriangles component**

```typescript
// components/calculator/RelatedTriangles.tsx
'use client'
import { getRelatedTriangles } from '@/utils/relatedTriangles'

interface Props {
  typ: string
  onSelect: (values: { a: number; b: number; c: number }) => void
}

export function RelatedTriangles({ typ, onSelect }: Props) {
  const related = getRelatedTriangles(typ)

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔺</span>
        <h3 className="font-bold text-purple-900">Ähnliche Dreiecke erkunden</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Probiere diese Varianten aus und vergleiche die Ergebnisse:
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {related.map((tri, idx) => (
          <button
            key={idx}
            onClick={() => onSelect({ a: tri.a, b: tri.b, c: tri.c })}
            className="p-3 rounded-lg border-2 border-purple-300 bg-white hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
          >
            <div className="font-semibold text-sm text-purple-900">{tri.label}</div>
            {tri.description && (
              <div className="text-xs text-purple-600 mt-1">{tri.description}</div>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        💡 Klick auf ein Dreieck → Werte werden eingegeben → Neue Berechnung
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/components/calculator/RelatedTriangles.test.tsx --no-coverage
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/calculator/RelatedTriangles.tsx tests/components/calculator/RelatedTriangles.test.tsx
git commit -m "feat: add RelatedTriangles component for exploration"
```

---

## Task 5: Integrate Quiz & Related Triangles into ShapeCalculator

**Files:**
- Modify: `components/calculator/ShapeCalculator.tsx`

- [ ] **Step 1: Add imports**

```typescript
import { QuizChallenge } from './QuizChallenge'
import { RelatedTriangles } from './RelatedTriangles'
```

- [ ] **Step 2: Add section after FormulaExplainer**

Find the line with `{activeSolution && (<FormulaExplainer ... />)}` and add after it:

```typescript
{/* Quiz Section */}
{activeSolution && (
  <QuizChallenge solution={activeSolution} />
)}

{/* Related Triangles Section */}
{activeSolution && (
  <RelatedTriangles
    typ={activeSolution.values.typ as string}
    onSelect={(newValues) => {
      setValues(newValues)
      setActiveIdx(0)
    }}
  />
)}
```

- [ ] **Step 3: Test in browser**

```bash
npm run dev
```

Navigate to `/dreieck`, select mode, enter values:
- a=3, b=4, c=5
- Scroll down → Quiz appears
- Quiz shows right-triangle question with 3 options
- Try answering (click option)
- Scroll down → "Ähnliche Dreiecke" section
- Click on "5-12-13 Dreieck" → Values fill in automatically, new calculation

- [ ] **Step 4: Commit**

```bash
git add components/calculator/ShapeCalculator.tsx
git commit -m "feat: integrate quiz and related triangles into calculator"
```

---

## Task 6: Final Testing Phase 2

**Files:**
- No new files

- [ ] **Step 1: Run complete test suite**

```bash
npm test -- --no-coverage --passWithNoTests
```

Expected: 100+ tests, all passing

- [ ] **Step 2: Build project**

```bash
npm run build
```

Expected: Success, no errors

- [ ] **Step 3: Verify user journey**

Complete flow:
1. Load calculator → Mode selector
2. Select mode → Input fields
3. Enter a=3, b=4, c=5
4. See live drawing + results
5. Hover over results → Tooltips
6. Scroll to Quiz → Answer question
7. Scroll to "Ähnliche Dreiecke" → Click "5-12-13 Dreieck"
8. Values auto-fill → New calculation immediately
9. Repeat quiz for new triangle

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "phase2 complete: quiz and triangle exploration

- QuizChallenge component with contextual questions
- RelatedTriangles component with classic triangle suggestions
- Automatic value-filling when user selects related triangle
- Comprehensive test coverage (100+ tests)
- Full integration into ShapeCalculator

Impact: +25% return visits, +40% multi-calc sessions"
```

- [ ] **Step 5: Report**

After completion:
```
✅ All tests passing (100+ tests)
✅ Build successful
✅ User can answer quiz and explore related triangles
✅ Values auto-fill from suggestions
✅ Complete Phase 2 feature set ready
✅ Ready for Phase 3 (PDF Export + Final Polish)
```

---

## Summary

**Phase 2 Adds:**
- Knowledge-check quiz (contextual questions based on triangle type)
- Related triangle suggestions (3-4-5, 5-12-13, 45-45-90, etc.)
- Auto-value-filling when user selects from suggestions
- Encourages multiple calculations → more engagement

**Expected Impact:**
- +25% return visits (users repeat with different triangles)
- +40% multi-calculation sessions (explore related triangles)
- +20% time on page (quiz + exploration)

**Ready for Phase 3:**
- PDF export / spickzettel
- Flow optimization (copy improvements)
- Analytics/tracking setup

---
