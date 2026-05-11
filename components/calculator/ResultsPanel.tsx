import { formatUnit } from '@/lib/format'
import type { Solution } from '@/lib/shapes/types'
import { getResultHint, getComparison, getContextForKey } from '@/utils/resultHints'

interface Props {
  solution: Solution
  unit: string
}

const LABELS: Record<string, string> = {
  a: 'Seite a', b: 'Seite b', c: 'Seite c',
  alpha: 'Winkel α', beta: 'Winkel β', gamma: 'Winkel γ',
  flaeche: 'Fläche', umfang: 'Umfang',
  h_a: 'Höhe h_a', h_b: 'Höhe h_b', h_c: 'Höhe h_c',
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

export function ResultsPanel({ solution, unit }: Props) {
  const entries = Object.entries(solution.values)
  const highlighted = entries.filter(([k]) => HIGHLIGHT_KEYS.includes(k))
  const rest = entries.filter(([k]) => !HIGHLIGHT_KEYS.includes(k))

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
        <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Ergebnis</h3>
      </div>

      {highlighted.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b border-slate-100 bg-slate-50/30">
          {highlighted.map(([key, value]) => {
            if (typeof value !== 'number') return null
            const power = VOLUME_KEYS.includes(key) ? 3 : AREA_KEYS.includes(key) ? 2 : 1
            const hint = getResultHint(key)
            const comparison = AREA_KEYS.includes(key) ? getComparison(value) : ''
            const context = getContextForKey(key)
            const hasTooltip = hint || comparison || context

            return (
              <div key={key} className={`rounded-2xl bg-white border border-indigo-100 p-5 shadow-sm hover:scale-[1.02] transition-transform ${hasTooltip ? 'group relative' : ''}`}>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{LABELS[key] ?? key}</div>
                <div className="text-2xl font-black text-indigo-600">
                  {formatUnit(value, unit, power)}
                </div>

                {hasTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-normal w-48 z-10 shadow-lg pointer-events-none">
                    {hint && <p className="mb-2">{hint}</p>}
                    {comparison && <p className="mb-2">{comparison}</p>}
                    {context && <p>{context}</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 sm:grid-cols-3">
        {rest.map(([key, value]) => {
          if (key === 'typ') {
            const hint = getResultHint(key)
            const context = getContextForKey(key)
            const hasTooltip = hint || context
            return (
              <div key={key} className={`col-span-full rounded-2xl bg-violet-50 px-5 py-4 flex items-center gap-4 border border-violet-100 shadow-sm ${hasTooltip ? 'group relative' : ''}`}>
                <span className="text-2xl">{'\u{1F4D0}'}</span>
                <div>
                  <dt className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Dreieckstyp</dt>
                  <dd className="font-black text-violet-700 text-lg capitalize">{String(value)}</dd>
                </div>
                {hasTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-normal w-48 z-10 shadow-lg pointer-events-none">
                    {hint && <p className="mb-1">{hint}</p>}
                    {context && <p>{context}</p>}
                  </div>
                )}
              </div>
            )
          }
          if (typeof value !== 'number') return null
          const isAngle = ['alpha', 'beta', 'gamma'].includes(key)
          const power = VOLUME_KEYS.includes(key) ? 3 : AREA_KEYS.includes(key) ? 2 : 1
          const hint = getResultHint(key)
          const context = getContextForKey(key)
          const hasTooltip = hint || context
          return (
            <div key={key} className={`p-1 ${hasTooltip ? 'group relative' : ''}`}>
              <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{LABELS[key] ?? key}</dt>
              <dd className="font-black text-slate-700 text-base">
                {isAngle ? formatUnit(value, '°') : formatUnit(value, unit, power)}
              </dd>
              {hasTooltip && (
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-normal w-48 z-10 shadow-lg pointer-events-none">
                  {hint && <p className="mb-1">{hint}</p>}
                  {context && <p>{context}</p>}
                </div>
              )}
            </div>
          )
        })}
      </dl>
    </div>
  )
}
