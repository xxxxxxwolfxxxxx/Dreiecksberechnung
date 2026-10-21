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
    <div className="h-[280px] overflow-hidden sm:h-[120px]" style={{ contain: 'layout paint' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', height: '100%' }}
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

  const filled = Object.values(values).filter(v => v !== undefined && !isNaN(v as number)).length

  const result = useMemo(() => {
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
  }, [values, shape, filled])

  const handleChange = (key: string, value: number | undefined) => {
    setActiveIdx(0)
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const reset = () => {
    setActiveIdx(0)
    setValues({})
  }

  const activeSolution = result?.solutions[activeIdx]
  const statusText = activeSolution
    ? 'Ergebnis berechnet'
    : result?.error
      ? 'Diese Werte ergeben kein Ergebnis'
      : `Gib mindestens ${shape.minRequired} Werte ein (${Math.min(filled, shape.minRequired)}/${shape.minRequired})`

  return (
    <div className="flex flex-col gap-5">
      {/* Rechner: Kopf, Skizze, Eingabe in einer Karte */}
      <section className="rounded-[22px] bg-white border border-line shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.10)] overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 sm:px-7 pt-6 pb-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11.5px] tracking-[0.06em] text-ink-3">RECHNER</span>
            <Ueberschrift className="text-[28px] sm:text-[34px] font-bold leading-[1.1] tracking-[-0.025em]">
              {shape.label} <span className="text-brand-600">berechnen</span>
            </Ueberschrift>
          </div>
          <div role="radiogroup" aria-label="Einheit" className="flex gap-0.5 rounded-[11px] bg-[#f2f4f7] p-[3px]">
            {UNITS.map(u => (
              <button
                key={u}
                role="radio"
                aria-checked={u === unit}
                onClick={() => setUnit(u)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[13px] font-medium transition-colors ${
                  u === unit ? 'bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,.12)]' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-5 sm:px-7 pb-4 text-sm text-ink-2">
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: shape.minRequired }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-[18px] rounded-[3px] transition-colors ${
                  activeSolution ? 'bg-[#12915a]' : i < filled ? 'bg-brand-600' : 'bg-[#e1e4ea]'
                }`}
              />
            ))}
          </span>
          <span className="font-medium" aria-live="polite">{statusText}</span>
        </div>

        {/* Zeichnung (immer sichtbar) */}
        <div className="mx-3 sm:mx-4 rounded-2xl border border-line-soft bg-[#fbfbfd] bg-dots p-2">
          <ShapeDrawing
            shape={shape}
            data={activeSolution ? shape.toSVG(activeSolution.values as Record<string, number>, 280) : undefined}
            isPreview={!activeSolution}
          />
        </div>

        {/* Eingabe */}
        <div className="flex flex-col gap-4 px-5 sm:px-7 pt-5 pb-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold">Bekannte Werte eingeben</h2>
            <button
              onClick={reset}
              className="rounded-lg border border-line bg-white px-3 py-1 text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f4f7] hover:text-ink"
            >
              Zurücksetzen
            </button>
          </div>
          <InputPanel shape={shape} values={values} onChange={handleChange} unit={unit} />
        </div>
      </section>

      {/* Fehler */}
      {result?.error && (() => {
        const explanation = getErrorExplanation(result.error, values)
        return (
          <div role="alert" className="flex gap-3.5 rounded-2xl border border-[#f3cccc] bg-[#fdf2f2] px-5 py-4">
            <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-[#d13c3c] font-mono text-sm font-semibold text-white">!</span>
            <div className="flex flex-col gap-1.5">
              <p className="text-[15px] font-semibold text-[#8f1f1f]">Fehler bei der Berechnung</p>
              <p className="whitespace-pre-wrap text-sm text-[#6e1d1d]">{explanation.message}</p>
              {explanation.suggestion && (
                <p className="mt-1 rounded-[10px] bg-[#fbe4e4] px-3 py-2 text-[13px] text-[#6e1d1d]">
                  <strong>Tipp:</strong> {explanation.suggestion}
                </p>
              )}
            </div>
          </div>
        )
      })()}

      {/* Mehrere Loesungen (SSW) */}
      {result && result.solutions.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f4dfb3] bg-[#fff8ea] px-5 py-4">
          <div className="flex flex-col">
            <strong className="text-[15px] text-[#6b4300]">Zwei Lösungen möglich</strong>
            <span className="text-[13px] text-[#7a5410]">Bei SSW passen zwei verschiedene Dreiecke zu deinen Werten.</span>
          </div>
          <div className="flex gap-1 rounded-[11px] border border-[#f4dfb3] bg-white p-[3px]">
            {result.solutions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                  i === activeIdx ? 'bg-[#e59a1c] text-white' : 'text-[#7a5410] hover:bg-[#fff8ea]'
                }`}
              >
                Lösung {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ergebnisse inkl. Export */}
      {activeSolution && (
        <ResultsPanel solution={activeSolution} unit={unit}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-canvas px-4 py-3.5">
            <span className="text-sm text-ink-2">Lösung als PDF speichern – perfekt für die Hausaufgaben.</span>
            <SpickzettelExport
              solution={activeSolution}
              shapeId={shapeId}
              onExport={() => trackEvent(EVENTS.SPICKZETTEL_EXPORTED, {
                shape: shapeId
              })}
            />
          </div>
        </ResultsPanel>
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
        <QuizChallenge key={`${activeIdx}-${activeSolution.values.typ}`} solution={activeSolution} />
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
