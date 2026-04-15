'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { shapes } from '@/lib/shapes'
import { getErrorExplanation } from '@/utils/errorExplanations'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'
import { ModeSelector } from './ModeSelector'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
}

function MidBanner() {
  const pushed = useRef(false)
  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    // Kurze Verzögerung damit das <ins>-Element im DOM ist
    setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch {}
    }, 50)
  }, [])
  return (
    <div style={{ minHeight: 90 }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8687929894744033"
        data-ad-slot="7625380516"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}

function ShapeCalculatorInner({ shapeId }: Props) {
  const shape = shapes[shapeId]
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

      {/* Mittlerer Werbebanner – erscheint nur nach der Berechnung */}
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
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  // Wenn noch keine Mode ausgewählt ist, zeige ModeSelector
  if (!selectedMode) {
    return <ModeSelector onSelect={setSelectedMode} />
  }

  // Sonst zeige Calculator mit key={shapeId} der state resetzt wenn die Form ändert
  return <ShapeCalculatorInner key={shapeId} shapeId={shapeId} />
}
