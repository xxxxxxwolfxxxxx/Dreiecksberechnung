import { formatUnit } from '@/lib/format'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
  unit: string
}

const LABELS: Record<string, string> = {
  a: 'Seite a', b: 'Seite b', c: 'Seite c',
  alpha: 'Winkel \u03B1', beta: 'Winkel \u03B2', gamma: 'Winkel \u03B3',
  flaeche: 'Fl\u00E4che', umfang: 'Umfang',
  h_a: 'H\u00F6he h_a', h_b: 'H\u00F6he h_b', h_c: 'H\u00F6he h_c',
  inkreis: 'Inkreisradius', umkreis: 'Umkreisradius',
  r: 'Radius', d: 'Durchmesser',
  diagonale: 'Diagonale', mittellinie: 'Mittellinie',
  d1: 'Diagonale d\u2081', d2: 'Diagonale d\u2082', h: 'H\u00F6he h', h_a_pg: 'H\u00F6he h_a',
  typ: 'Dreieckstyp',
}

// Wichtige Felder die oben angezeigt werden
const HIGHLIGHT_KEYS = ['flaeche', 'umfang', 'r', 'diagonale']

export function ResultsPanel({ solution, unit }: Props) {
  const entries = Object.entries(solution.values)
  const highlighted = entries.filter(([k]) => HIGHLIGHT_KEYS.includes(k))
  const rest = entries.filter(([k]) => !HIGHLIGHT_KEYS.includes(k))

  return (
    <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3">
        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Ergebnis</h3>
      </div>

      {/* Hervorgehobene Hauptwerte */}
      {highlighted.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-100">
          {highlighted.map(([key, value]) => {
            if (typeof value !== 'number') return null
            const isArea = key === 'flaeche'
            return (
              <div key={key} className="rounded-xl bg-blue-50 p-3 text-center">
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{LABELS[key] ?? key}</div>
                <div className="mt-1 text-xl font-extrabold text-blue-800">
                  {formatUnit(value, unit, isArea ? 2 : 1)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Alle weiteren Werte */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3">
        {rest.map(([key, value]) => {
          if (key === 'typ') return (
            <div key={key} className="col-span-full rounded-lg bg-purple-50 px-3 py-2 flex items-center gap-2">
              <span className="text-purple-600">{'\u25B2'}</span>
              <div>
                <dt className="text-xs text-purple-500">Dreieckstyp</dt>
                <dd className="font-bold text-purple-800 capitalize">{String(value)}</dd>
              </div>
            </div>
          )
          if (typeof value !== 'number') return null
          const isAngle = ['alpha', 'beta', 'gamma'].includes(key)
          return (
            <div key={key}>
              <dt className="text-xs text-gray-400 font-medium">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold text-gray-800">
                {isAngle ? formatUnit(value, '\u00B0') : formatUnit(value, unit, 1)}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
