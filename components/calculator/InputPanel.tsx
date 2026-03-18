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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {shape.inputs.map((input) => {
        const val = values[input.key]
        const isNegative = val !== undefined && val < 0
        const hasValue = val !== undefined && !isNegative
        const displayUnit = input.unit === 'angle' ? '\u00B0' : input.unit === 'area' ? unit + '\u00B2' : unit
        return (
          <div key={input.key} className="flex flex-col gap-1">
            <label
              htmlFor={input.key}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {input.label}
            </label>
            <div className={`relative rounded-xl border-2 transition-all ${
              isNegative
                ? 'border-red-400 bg-red-50'
                : hasValue
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white'
            }`}>
              <input
                id={input.key}
                type="number"
                step="any"
                value={val ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseFloat(e.target.value)
                  onChange(input.key, v)
                }}
                className="w-full bg-transparent px-3 py-2.5 pr-10 text-sm font-medium focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                {displayUnit}
              </span>
            </div>
            {isNegative && (
              <span className="text-xs text-red-500">Muss positiv sein</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
