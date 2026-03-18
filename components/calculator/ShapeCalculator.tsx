'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { shapes } from '@/lib/shapes'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
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
  const midAdPushed = useRef(false)

  useEffect(() => {
    if (activeSolution && !midAdPushed.current) {
      midAdPushed.current = true
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch {}
    }
  }, [activeSolution])

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">{shape.label} berechnen</h1>
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

      {/* Mittlerer Werbebanner – erscheint nur nach der Berechnung */}
      {activeSolution && (
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
      )}

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
  // key={shapeId} resets all state when the shape changes
  return <ShapeCalculatorInner key={shapeId} shapeId={shapeId} />
}
