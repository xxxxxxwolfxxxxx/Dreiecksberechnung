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
    <div className="rounded-3xl border border-indigo-100 bg-indigo-50/30 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left font-black text-indigo-900 group"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl group-hover:scale-125 transition-transform">🎓</span>
          So wurde das berechnet: <span className="text-indigo-600 ml-1">{method}</span>
        </span>
        <span className="text-indigo-400 text-xs font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl shadow-sm border border-indigo-50">
          {open ? 'einklappen' : 'ansehen'}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-8 space-y-6">
          {/* Schritt-fuer-Schritt */}
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-indigo-100/50" />
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 relative z-10">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-black flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                  {i + 1}
                </span>
                <div className="flex-1 bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm">
                  {step.split('\n').map((line, j) => (
                    <p key={j} className={`${j === 0 ? 'text-slate-800 font-bold mb-2' : 'font-mono text-sm text-indigo-700 bg-indigo-50/50 rounded-xl px-3 py-2 border border-indigo-100'}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Verwendete Formeln */}
          {formulas.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-5 border border-indigo-100/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verwendete Formeln</p>
              <div className="flex flex-wrap gap-3">
                {formulas.map((f, i) => (
                  <span key={i} className="bg-white border border-indigo-100 rounded-xl px-4 py-2 font-mono text-sm font-bold text-indigo-800 shadow-sm">
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
