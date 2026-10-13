import type { ReactNode } from 'react'
import { formatUnit } from '@/lib/format'
import type { Solution } from '@/lib/shapes/types'
import { getResultHint, getComparison, getContextForKey } from '@/utils/resultHints'

interface Props {
  solution: Solution
  unit: string
  /** Optionaler Fußbereich, z. B. der Spickzettel-Export */
  children?: ReactNode
}

const LABELS: Record<string, string> = {
  a: 'Seite a', b: 'Seite b', c: 'Seite c',
  alpha: 'Winkel α', beta: 'Winkel β', gamma: 'Winkel γ',
  flaeche: 'Fläche', umfang: 'Umfang',
  h_a: 'Höhe hₐ', h_b: 'Höhe h_b', h_c: 'Höhe h_c',
  inkreis: 'Inkreisradius', umkreis: 'Umkreisradius',
  r: 'Radius', d: 'Durchmesser',
  diagonale: 'Diagonale', mittellinie: 'Mittellinie',
  d1: 'Diagonale d₁', d2: 'Diagonale d₂', h: 'Höhe h', h_a_pg: 'Höhe h_a',
  typ: 'Dreieckstyp',
  volumen: 'Volumen', oberflaeche: 'Oberfläche',
  mantelflaeche: 'Mantelfläche', grundflaeche: 'Grundfläche',
  raumdiagonale: 'Raumdiagonale', flaechendiagonale: 'Flächendiagonale',
  mantellinie: 'Mantellinie (s)', apothema: 'Apothema',
}

const HIGHLIGHT_KEYS = ['flaeche', 'umfang', 'r', 'diagonale', 'volumen', 'oberflaeche']
const VOLUME_KEYS = ['volumen']
const AREA_KEYS = ['flaeche', 'oberflaeche', 'mantelflaeche', 'grundflaeche']
const ANGLE_KEYS = ['alpha', 'beta', 'gamma']

/** Beim Dreieck werden die übrigen Werte in Zeilen gruppiert. */
const GRUPPEN: Array<{ titel: string; keys: string[] }> = [
  { titel: 'Seiten', keys: ['a', 'b', 'c'] },
  { titel: 'Winkel', keys: ANGLE_KEYS },
  { titel: 'Höhen', keys: ['h_a', 'h_b', 'h_c'] },
  { titel: 'Kreise', keys: ['inkreis', 'umkreis'] },
]

function Tooltip({ lines, align = 'left' }: { lines: string[]; align?: 'left' | 'right' }) {
  if (!lines.length) return null
  return (
    <div className={`pointer-events-none absolute bottom-full z-20 mb-2 hidden w-60 flex-col gap-1.5 rounded-[10px] bg-ink px-3 py-2.5 text-[12.5px] leading-normal text-white group-hover:flex ${align === 'right' ? 'right-0' : 'left-0'}`}>
      {lines.map((l, i) => <p key={i}>{l}</p>)}
    </div>
  )
}

export function ResultsPanel({ solution, unit, children }: Props) {
  const entries = Object.entries(solution.values)
  const highlighted = entries.filter(([k]) => HIGHLIGHT_KEYS.includes(k))
  const rest = entries.filter(([k]) => !HIGHLIGHT_KEYS.includes(k) && k !== 'typ')
  const typ = solution.values.typ

  const fmt = (key: string, value: number) => {
    if (ANGLE_KEYS.includes(key)) return formatUnit(value, '°')
    const power = VOLUME_KEYS.includes(key) ? 3 : AREA_KEYS.includes(key) ? 2 : 1
    return formatUnit(value, unit, power)
  }
  const hinweise = (key: string, value?: number) =>
    [getResultHint(key), AREA_KEYS.includes(key) && value !== undefined ? getComparison(value) : '', getContextForKey(key)].filter(Boolean) as string[]

  // Gruppiert, wenn alle Keys bekannt sind (Dreieck) – sonst flaches Raster.
  const bekannt = GRUPPEN.flatMap(g => g.keys)
  const gruppiert = rest.every(([k]) => bekannt.includes(k))
  const zeilen = gruppiert
    ? GRUPPEN.map(g => ({ titel: g.titel, items: rest.filter(([k]) => g.keys.includes(k)) })).filter(z => z.items.length)
    : [{ titel: '', items: rest }]

  return (
    <section className="flex flex-col gap-5 rounded-[22px] border border-line bg-white px-5 sm:px-7 py-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h3 className="text-xl font-bold tracking-tight">Ergebnis</h3>
        {typeof typ === 'string' && (
          <div className="group relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f3efff] py-1 pl-1.5 pr-3 text-sm font-semibold capitalize text-[#4d2fb0]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6a4ee0] font-mono text-[11px] text-white">△</span>
              {typ}
            </span>
            <Tooltip lines={hinweise('typ')} align="right" />
          </div>
        )}
      </div>

      {highlighted.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {highlighted.map(([key, value]) => {
            if (typeof value !== 'number') return null
            return (
              <div key={key} className="group relative flex cursor-help flex-col gap-0.5 rounded-2xl border border-brand-200 bg-brand-50 px-4.5 py-4">
                <span className="text-[13px] font-medium text-[#3a4fa8]">{LABELS[key] ?? key}</span>
                <span className="font-mono text-[28px] font-semibold tracking-[-0.02em] text-brand-700">{fmt(key, value)}</span>
                <Tooltip lines={hinweise(key, value)} />
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-col">
        {zeilen.map(z => (
          <div key={z.titel || 'alle'} className={`grid gap-3 border-t border-line-soft py-3 ${z.titel ? 'sm:grid-cols-[90px_minmax(0,1fr)]' : ''}`}>
            {z.titel && <span className="pt-0.5 text-[13px] font-semibold text-ink-3">{z.titel}</span>}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
              {z.items.map(([key, value]) => {
                if (typeof value !== 'number') return null
                return (
                  <div key={key} className="group relative flex flex-col">
                    <dt className="text-[12.5px] text-ink-3">{LABELS[key] ?? key}</dt>
                    <dd className="font-mono text-base font-medium text-ink">{fmt(key, value)}</dd>
                    <Tooltip lines={hinweise(key)} />
                  </div>
                )
              })}
            </dl>
          </div>
        ))}
      </div>

      {children}
    </section>
  )
}
