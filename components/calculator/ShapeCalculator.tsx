'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { shapes } from '@/lib/shapes'
import { werteAusQuery, einheitAusQuery } from '@/lib/rechner-query'
import { getErrorExplanation } from '@/utils/errorExplanations'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'
import { DeepExplanation } from './DeepExplanation'
import { QuizChallenge } from './QuizChallenge'
import { RelatedTriangles } from './RelatedTriangles'
import { SpickzettelExport } from './SpickzettelExport'
import { trackEvent, EVENTS } from '@/utils/analytics'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
  /**
   * Auf den Rechnerseiten ist die Rechner-Ueberschrift die H1 der Seite.
   * Auf den Dreieck-Themenseiten steht darueber schon eine eigene H1 –
   * dort wird auf h2 heruntergestuft, damit es nur eine H1 pro Seite gibt.
   */
  ueberschriftEbene?: 'h1' | 'h2'
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

function ShapeCalculatorInner({ shapeId, ueberschriftEbene = 'h1' }: Props) {
  const shape = shapes[shapeId]
  const Ueberschrift = ueberschriftEbene
  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [unit, setUnit] = useState('cm')
  const [activeIdx, setActiveIdx] = useState(0)

  // Startwerte aus der URL: /dreieck?a=3&b=4&c=5 oder ?q=... (SolveMathAction).
  // Bewusst nach der Hydration statt ueber useSearchParams – letzteres erzwingt
  // eine Suspense-Boundary und wuerde die H1 aus dem statischen HTML nehmen.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const werte = werteAusQuery(shape, params)
    const einheit = einheitAusQuery(params)

    if (Object.keys(werte).length > 0) setValues(werte)
    if (einheit) setUnit(einheit)
  }, [shape])

  const result = useMemo(() => {
    const filled = Object.values(values).filter(v => v !== undefined && !isNaN(v as number)).length
    if (filled >= shape.minRequired) {
      const solved = shape.solve(values)
      // Track successful calculation
      if (solved?.solutions.length && !solved.error) {
        trackEvent(EVENTS.CALCULATION_COMPLETE, {
          triangleType: solved.solutions[0].values.typ as string,
          method: solved.solutions[0].method as string
        })
      }
      // Track calculation errors
      if (solved?.error) {
        trackEvent(EVENTS.CALCULATION_ERROR, {
          error: solved.error as string
        })
      }
      return solved
    }
    return null
  }, [values, shape])

  const handleChange = (key: string, value: number | undefined) => {
    setActiveIdx(0)
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const activeSolution = result?.solutions[activeIdx]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <div className="flex items-center justify-between gap-4">
          <Ueberschrift className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {shape.label} <span className="text-indigo-200">berechnen</span>
          </Ueberschrift>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer"
          >
            {UNITS.map(u => <option key={u} value={u} className="text-slate-900">{u}</option>)}
          </select>
        </div>
        <p className="mt-3 text-sm sm:text-base text-indigo-100 font-medium flex items-center gap-2">
          {result?.solutions.length
            ? <><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Ergebnis berechnet</>
            : <><span className="w-2 h-2 rounded-full bg-indigo-300" /> Gib mindestens {shape.minRequired} Werte ein</>}
        </p>
      </div>

      {/* Zeichnung (immer sichtbar) */}
      <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">Zeichnung</span>
        </div>
        <ShapeDrawing
          shape={shape}
          data={activeSolution ? shape.toSVG(activeSolution.values as Record<string, number>, 280) : undefined}
          isPreview={!activeSolution}
        />
      </div>

      {/* Eingabe-Panel */}
      <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">Werte eingeben</span>
        </div>
        <InputPanel shape={shape} values={values} onChange={handleChange} unit={unit} />
      </div>

      {/* Fehler */}
      {result?.error && (() => {
        const explanation = getErrorExplanation(result.error, values)
        return (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 text-sm font-medium text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg">{explanation.emoji}</span>
              <div className="flex-1">
                <p className="font-black mb-2">Fehler bei der Berechnung</p>
                <p className="whitespace-pre-wrap text-sm text-rose-800 mb-3">{explanation.message}</p>
                {explanation.suggestion && (
                  <div className="bg-rose-100 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
                    <strong>Tipp:</strong> {explanation.suggestion}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Mehrere Loesungen (SSW) */}
      {result && result.solutions.length > 1 && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-white px-2 py-1 rounded border border-amber-100">Auswahl</span>
            <p className="text-sm font-black text-amber-900">Zwei Lösungen möglich</p>
          </div>
          <div className="flex gap-3">
            {result.solutions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`rounded-xl px-6 py-3 text-sm font-black transition-all ${
                  i === activeIdx
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105'
                    : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-100/50'
                }`}
              >
                Lösung {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ergebnisse */}
      {activeSolution && (
        <ResultsPanel solution={activeSolution} unit={unit} />
      )}

      {/* Export Button - für alle Formen */}
      {activeSolution && (
        <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5">
          <p className="text-sm text-gray-600 mb-3">
            💡 Speichere diese Lösung als PDF – perfekt für deine Hausaufgaben!
          </p>
          <SpickzettelExport
            solution={activeSolution}
            shapeId={shapeId}
            onExport={() => trackEvent(EVENTS.SPICKZETTEL_EXPORTED, {
              shape: shapeId
            })}
          />
        </div>
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

      {/* Deep Explanation - nur für Dreieck (bessere SEO) */}
      {activeSolution && shapeId === 'dreieck' && (
        <DeepExplanation solution={activeSolution} shapeId={shapeId} />
      )}

      {/* Quiz Section - nur für Dreieck */}
      {activeSolution && shapeId === 'dreieck' && (
        <QuizChallenge solution={activeSolution} />
      )}

      {/* Related Triangles Section - nur für Dreieck */}
      {activeSolution && shapeId === 'dreieck' && (
        <RelatedTriangles
          typ={activeSolution.values.typ as string}
          onSelect={(newValues) => {
            setValues(newValues)
            setActiveIdx(0)
          }}
        />
      )}
    </div>
  )
}

export function ShapeCalculator({ shapeId, ueberschriftEbene }: Props) {
  return <ShapeCalculatorInner key={shapeId} shapeId={shapeId} ueberschriftEbene={ueberschriftEbene} />
}
