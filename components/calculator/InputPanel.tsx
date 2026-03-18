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
        const displayUnit = input.unit === 'angle' ? '°' : unit
        return (
          <div key={input.key} className="flex flex-col gap-1">
            <label
              htmlFor={input.key}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {input.label}
            </label>
            <div className="relative">
              <input
                id={input.key}
                type="number"
                step="any"
                value={val ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseFloat(e.target.value)
                  onChange(input.key, v)
                }}
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm
                  focus:outline-none focus:ring-2
                  ${isNegative
                    ? 'border-red-400 focus:ring-red-300'
                    : val !== undefined
                      ? 'border-green-400 focus:ring-green-300'
                      : 'border-gray-300 focus:ring-blue-300'
                  }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {displayUnit}
              </span>
            </div>
            {isNegative && (
              <span className="text-xs text-red-500">Wert muss positiv sein</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
