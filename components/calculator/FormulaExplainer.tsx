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
