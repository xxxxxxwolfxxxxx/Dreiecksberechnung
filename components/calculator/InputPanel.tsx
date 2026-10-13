'use client'
import { useState } from 'react'
import type { InputDefinition, Shape } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  values: Partial<Record<string, number>>
  onChange: (key: string, value: number | undefined) => void
  unit: string
}

/** Akzeptiert Komma und Punkt als Dezimaltrenner. Leer/ungültig → undefined. */
function parseZahl(s: string): number | undefined {
  if (s.trim() === '') return undefined
  const n = parseFloat(s.replace(',', '.'))
  return isNaN(n) ? undefined : n
}

const anzeige = (v: number | undefined) => (v === undefined ? '' : String(v).replace('.', ','))

/** Beim Dreieck nach Seiten / Winkel / Höhen gruppieren, sonst eine flache Liste. */
function gruppen(shape: Shape) {
  if (shape.id !== 'dreieck') return [{ titel: '', hinweis: '', inputs: shape.inputs }]
  const winkel = shape.inputs.filter(i => i.unit === 'angle')
  const hoehen = shape.inputs.filter(i => i.key.startsWith('h_'))
  const seiten = shape.inputs.filter(i => !winkel.includes(i) && !hoehen.includes(i))
  return [
    { titel: 'Seiten', hinweis: 'mindestens eine Seite', inputs: seiten },
    { titel: 'Winkel', hinweis: 'optional', inputs: winkel },
    { titel: 'Höhen', hinweis: 'optional · zusammen mit ihrer Seite', inputs: hoehen },
  ].filter(g => g.inputs.length > 0)
}

export function InputPanel({ shape, values, onChange, unit }: Props) {
  // Rohtext je Feld, damit "3," oder "-" beim Tippen stehen bleiben.
  const [raw, setRaw] = useState<Record<string, string>>({})

  const textFuer = (key: string) => {
    const r = raw[key]
    const v = values[key]
    // Rohtext nur zeigen, solange er zum Wert passt (sonst wurde extern gesetzt, z. B. URL/Reset).
    return r !== undefined && parseZahl(r) === v ? r : anzeige(v)
  }

  const feld = (input: InputDefinition) => {
    const val = values[input.key]
    const isNegative = val !== undefined && val < 0
    const hasValue = val !== undefined && !isNegative
    const displayUnit = input.unit === 'angle' ? '\u00B0' : input.unit === 'area' ? unit + '\u00B2' : input.unit === 'volume' ? unit + '\u00B3' : unit
    return (
      <div key={input.key} className="flex flex-col gap-1">
        <label htmlFor={input.key} className="pl-0.5 text-[12.5px] text-ink-2">
          {input.label}
        </label>
        <div className={`relative flex h-12 items-center rounded-xl border-[1.5px] transition-colors ${
          isNegative
            ? 'border-[#efb4b4] bg-[#fdf2f2]'
            : hasValue
              ? 'border-[#9fd8b8] bg-[#f0faf4] focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100'
              : 'border-line bg-field focus-within:border-brand-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100'
        }`}>
          <input
            id={input.key}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={textFuer(input.key)}
            onChange={(e) => {
              const s = e.target.value.replace(/[^0-9,.\-]/g, '')
              setRaw(prev => ({ ...prev, [input.key]: s }))
              onChange(input.key, parseZahl(s))
            }}
            className="h-full w-full bg-transparent pl-3.5 pr-10 font-mono text-[17px] font-medium text-ink placeholder:text-[#b7bdc7] focus:outline-none"
          />
          <span className="pointer-events-none absolute right-3 font-mono text-[13px] text-[#8a919c]">
            {displayUnit}
          </span>
        </div>
        {isNegative && (
          <span className="pl-0.5 text-[11.5px] text-[#c23434]">Muss positiv sein</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {gruppen(shape).map((g, i) => (
        <div key={g.titel || i} className="flex flex-col gap-2">
          {g.titel && (
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold">{g.titel}</span>
              <span className="text-[12.5px] text-ink-3">{g.hinweis}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {g.inputs.map(feld)}
          </div>
        </div>
      ))}
    </div>
  )
}
