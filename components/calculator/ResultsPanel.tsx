import { formatUnit } from '@/lib/format'
import type { Solution } from '@/lib/shapes/types'

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
  d1: 'Diagonale d₁', d2: 'Diagonale d₂', h: 'Höhe h',
  typ: 'Dreieckstyp',
}

export function ResultsPanel({ solution, unit }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Methode: {solution.method}
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {Object.entries(solution.values).map(([key, value]) => {
          if (key === 'typ') return (
            <div key={key} className="col-span-full">
              <dt className="text-xs text-gray-500">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold capitalize">{String(value)}</dd>
            </div>
          )
          if (typeof value !== 'number') return null
          const isAngle = ['alpha','beta','gamma'].includes(key)
          const isArea = key === 'flaeche'
          return (
            <div key={key}>
              <dt className="text-xs text-gray-500 dark:text-gray-400">{LABELS[key] ?? key}</dt>
              <dd className="font-semibold">
                {isAngle ? `${formatUnit(value, '°')}` : formatUnit(value, unit, isArea ? 2 : 1)}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
