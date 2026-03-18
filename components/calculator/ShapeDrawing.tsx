'use client'
import type { Shape, SVGData } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  data?: SVGData
  isPreview?: boolean
}

export function ShapeDrawing({ shape, data, isPreview = false }: Props) {
  const svgData = data ?? shape.toSVG(shape.defaultValues, 280)

  if (!svgData.points.length && !svgData.circles?.length && !svgData.ellipses?.length) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  const stroke = isPreview ? '#94a3b8' : '#3b82f6'
  const textFill = isPreview ? '#64748b' : '#1d4ed8'

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${svgData.width} ${svgData.height}`}
        className={`w-full rounded-xl border bg-white ${isPreview ? 'opacity-60 border-dashed border-gray-300' : 'border-blue-200'}`}
        style={{ maxHeight: 'min(300px, 70vw)' }}
      >
        {/* Kreise */}
        {svgData.circles?.map((c, i) => (
          <g key={`c${i}`}>
            <circle
              cx={c.cx} cy={c.cy} r={c.r}
              fill={isPreview ? 'rgba(148,163,184,0.1)' : 'rgba(59,130,246,0.08)'}
              stroke={stroke}
              strokeWidth="2"
            />
            {c.label && (
              <text x={c.cx + c.r * 0.7} y={c.cy - c.r * 0.7} textAnchor="middle" fontSize="12" fontWeight="600" fill={textFill}>
                {c.label}
              </text>
            )}
          </g>
        ))}

        {/* Ellipsen (für 3D-Formen) */}
        {svgData.ellipses?.map((e, i) => (
          <g key={`el${i}`}>
            <ellipse
              cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeDasharray={e.dashed ? '6,4' : undefined}
            />
            {e.label && (
              <text x={e.cx + e.rx * 0.6} y={e.cy - e.ry - 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={textFill}>
                {e.label}
              </text>
            )}
          </g>
        ))}

        {/* Linien */}
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
                stroke={stroke} strokeWidth="2"
                strokeDasharray={line.dashed ? '6,4' : undefined}
              />
              {line.label && (
                <text x={mx} y={my - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill={textFill}>
                  {line.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Punkte */}
        {svgData.points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4" fill={stroke} />
            {pt.label && (
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill={isPreview ? "#64748b" : "#1e40af"}>
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      {isPreview && (
        <p className="text-center text-xs text-gray-400">
          Vorschau &ndash; Werte eingeben zum Berechnen
        </p>
      )}
    </div>
  )
}
