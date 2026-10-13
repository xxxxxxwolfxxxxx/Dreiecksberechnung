'use client'
import { useState } from 'react'

interface Props {
  steps: string[]
  formulas: string[]
  method: string
}

export function FormulaExplainer({ steps, formulas, method }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-white">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 sm:px-7 py-5 text-left"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-lg font-bold tracking-tight text-ink">So wurde das berechnet</span>
          <span className="font-mono text-[13px] text-brand-600">{method}</span>
        </span>
        <span className="flex-shrink-0 rounded-lg border border-line px-3 py-1 text-[13px] font-medium text-ink-2">
          {open ? 'Einklappen' : 'Ansehen'}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-4.5 px-5 sm:px-7 pb-6">
          {/* Schritt-fuer-Schritt */}
          <ol className="flex flex-col gap-3.5">
            {steps.map((step, i) => {
              const [titel, ...zeilen] = step.split('\n')
              return (
                <li key={i} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 font-mono text-[13px] font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
                    <p className="text-[15px] font-semibold text-ink">{titel}</p>
                    {zeilen.length > 0 && (
                      <div className="flex flex-col gap-0.5 overflow-x-auto rounded-[10px] bg-canvas px-3.5 py-2.5">
                        {zeilen.map((line, j) => (
                          <code key={j} className="whitespace-pre font-mono text-[13.5px] text-brand-700">{line}</code>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Verwendete Formeln */}
          {formulas.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-line-soft pt-3.5">
              <p className="text-[13px] font-semibold text-ink-3">Verwendete Formeln</p>
              <div className="flex flex-wrap gap-2">
                {formulas.map((f, i) => (
                  <code key={i} className="rounded-lg border border-line bg-white px-2.5 py-1.5 font-mono text-[13px] font-medium text-ink">
                    {f}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
