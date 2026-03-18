'use client'
import type { Shape, SVGData } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  data?: SVGData
  isPreview?: boolean
}

export function ShapeDrawing({ shape, data, isPreview = false }: Props) {
  const svgData = data ?? shape.toSVG(shape.defaultValues, 280)

  if (!svgData.points.length) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  return (
    <div className="relative">
      {isPreview && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="bg-white/90 text-xs text-gray-500 px-3 py-1 rounded-full border">
            Vorschau &ndash; Werte eingeben zum Berechnen
          </span>
        </div>
      )}
      <svg
        viewBox={`0 0 ${svgData.width} ${svgData.height}`}
        className={`w-full rounded-xl border bg-white ${isPreview ? 'opacity-60 border-dashed border-gray-300' : 'border-blue-200'}`}
        style={{ maxHeight: '300px' }}
      >
        {svgData.lines.map((line, i) => {
          const from = svgData.points[line.from]
          const to   = svgData.points[line.to]
          if (!from || !to) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isPreview ? "#94a3b8" : "#3b82f6"} strokeWidth="2"
              />
              {line.label && (
                <text x={mx} y={my - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill={isPreview ? "#64748b" : "#1d4ed8"}>
                  {line.label}
                </text>
              )}
            </g>
          )
        })}
        {svgData.points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4" fill={isPreview ? "#94a3b8" : "#3b82f6"} />
            {pt.label && (
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill={isPreview ? "#64748b" : "#1e40af"}>
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
