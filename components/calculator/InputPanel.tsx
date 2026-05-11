'use client'
import type { Shape } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  values: Partial<Record<string, number>>
  onChange: (key: string, value: number | undefined) => void
  unit: string
}

export function InputPanel({ shape, values, onChange, unit }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {shape.inputs.map((input) => {
        const val = values[input.key]
        const isNegative = val !== undefined && val < 0
        const hasValue = val !== undefined && !isNegative
        const displayUnit = input.unit === 'angle' ? '\u00B0' : input.unit === 'area' ? unit + '\u00B2' : input.unit === 'volume' ? unit + '\u00B3' : unit
        return (
          <div key={input.key} className="flex flex-col gap-2">
            <label
              htmlFor={input.key}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
            >
              {input.label}
            </label>
            <div className={`relative rounded-2xl border-2 transition-all duration-200 ${
              isNegative
                ? 'border-rose-300 bg-rose-50 shadow-inner shadow-rose-100/50'
                : hasValue
                  ? 'border-green-400 bg-green-50 shadow-inner shadow-green-100/50'
                  : 'border-slate-100 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-indigo-100/50 focus-within:-translate-y-0.5'
            }`}>
              <input
                id={input.key}
                type="number"
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={val ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseFloat(e.target.value)
                  onChange(input.key, v)
                }}
                className="w-full bg-transparent px-4 py-4 pr-10 text-base font-black text-slate-800 placeholder-slate-300 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                {displayUnit}
              </span>
            </div>
            {isNegative && (
              <span className="text-[10px] font-bold text-rose-500 ml-1">Muss positiv sein</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
