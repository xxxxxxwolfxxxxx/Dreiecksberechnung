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
    <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-blue-800"
      >
        <span className="flex items-center gap-2">
          So wurde das berechnet: {method}
        </span>
        <span className="text-blue-500 text-sm">{open ? '\u25B2 einklappen' : '\u25BC aufklappen'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {/* Schritt-fuer-Schritt */}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  {step.split('\n').map((line, j) => (
                    <p key={j} className={`${j === 0 ? 'text-gray-800 font-medium' : 'mt-1 font-mono text-sm text-blue-700 bg-white rounded px-2 py-1'}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Verwendete Formeln */}
          {formulas.length > 0 && (
            <div className="border-t border-blue-200 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Verwendete Formeln</p>
              <div className="flex flex-wrap gap-2">
                {formulas.map((f, i) => (
                  <span key={i} className="bg-white border border-blue-200 rounded-lg px-3 py-1 font-mono text-sm text-blue-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
