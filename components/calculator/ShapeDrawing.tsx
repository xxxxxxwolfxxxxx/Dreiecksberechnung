import type { SVGData } from '@/lib/shapes/types'

interface Props {
  data: SVGData
}

export function ShapeDrawing({ data }: Props) {
  if (!data.points.length) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-900"
      style={{ maxHeight: '320px' }}
    >
      {data.lines.map((line, i) => {
        const from = data.points[line.from]
        const to   = data.points[line.to]
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        return (
          <g key={i}>
            <line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#3b82f6" strokeWidth="2"
            />
            {line.label && (
              <text x={mx} y={my - 6} textAnchor="middle" fontSize="11" fill="#6b7280">
                {line.label}
              </text>
            )}
          </g>
        )
      })}
      {data.points.map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" />
          {pt.label && (
            <text x={pt.x} y={pt.y - 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">
              {pt.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
