'use client'
import { useState } from 'react'
import type { Shape, SVGData } from '@/lib/shapes/types'

interface Props {
  shape: Shape
  data?: SVGData
  isPreview?: boolean
}

const HOT = '#e8590c'
const MONO = 'var(--font-plex-mono), ui-monospace, monospace'

export function ShapeDrawing({ shape, data, isPreview = false }: Props) {
  const [hoveredPointLabel, setHoveredPointLabel] = useState<string | null>(null)
  const [hoveredLineLabel, setHoveredLineLabel] = useState<string | null>(null)

  const svgData = data ?? shape.toSVG(shape.defaultValues, 280)

  if (!svgData.points.length && !svgData.circles?.length && !svgData.ellipses?.length) return (
    <div className="flex h-[280px] items-center justify-center font-mono text-xs text-ink-3">
      Zeichnung erscheint nach der Berechnung
    </div>
  )

  const stroke = isPreview ? '#a7aebb' : '#2f54eb'
  const textFill = isPreview ? '#7b8390' : '#1d39b8'
  const fill = isPreview ? 'rgba(167,174,187,0.08)' : 'rgba(47,84,235,0.07)'
  const polygon = svgData.points.length >= 3 && !svgData.circles?.length && !svgData.ellipses?.length
    ? svgData.points.map(p => `${p.x},${p.y}`).join(' ')
    : null

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        data-shape-drawing="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgData.width} ${svgData.height}`}
        className="block w-full max-w-[440px] overflow-visible"
        style={{ maxHeight: 'min(480px, 85vw)' }}
        onMouseLeave={() => {
          setHoveredPointLabel(null)
          setHoveredLineLabel(null)
        }}
      >
        {polygon && <polygon points={polygon} fill={fill} />}

        {/* Kreise */}
        {svgData.circles?.map((c, i) => (
          <g key={`c${i}`}>
            <circle cx={c.cx} cy={c.cy} r={c.r} fill={fill} stroke={stroke} strokeWidth="2" />
            {c.label && (
              <text x={c.cx + c.r * 0.7} y={c.cy - c.r * 0.7} textAnchor="middle" fontSize="11.5" fontWeight="600" fontFamily={MONO} fill={textFill}>
                {c.label}
              </text>
            )}
          </g>
        ))}

        {/* Ellipsen (für 3D-Formen) */}
        {svgData.ellipses?.map((e, i) => (
          <g key={`el${i}`}>
            <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray={e.dashed ? '6,4' : undefined} />
            {e.label && (
              <text x={e.cx + e.rx * 0.6} y={e.cy - e.ry - 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fontFamily={MONO} fill={textFill}>
                {e.label}
              </text>
            )}
          </g>
        ))}

        {/* Linien */}
        {svgData.lines.map((line, i) => {
          const from = svgData.points[line.from]
          const to = svgData.points[line.to]
          if (!from || !to) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          const isHovered = hoveredLineLabel === line.label
          return (
            <g
              key={i}
              onMouseEnter={() => !isPreview && line.label && setHoveredLineLabel(line.label)}
              onMouseLeave={() => setHoveredLineLabel(null)}
              className={!isPreview ? 'cursor-pointer' : ''}
            >
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth="14" />
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isHovered ? HOT : stroke}
                strokeWidth={isHovered ? 3.5 : 2}
                strokeLinecap="round"
                strokeDasharray={line.dashed || isPreview ? '5,4' : undefined}
                className="transition-all duration-150"
              />
              {line.label && (
                <text
                  x={mx} y={my - 7}
                  textAnchor="middle"
                  fontSize={isHovered ? 13 : 11.5}
                  fontWeight="600"
                  fontFamily={MONO}
                  fill={isHovered ? HOT : textFill}
                  paintOrder="stroke"
                  stroke="#fbfbfd"
                  strokeWidth="4"
                  className="transition-all duration-150"
                >
                  {line.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Zusätzliche Text-Labels (z.B. Winkel) */}
        {svgData.labels?.map((lbl, i) => (
          <text
            key={`lbl${i}`}
            x={lbl.x} y={lbl.y}
            textAnchor="middle"
            fontSize={lbl.small ? 10.5 : 12}
            fontWeight="500"
            fontFamily={MONO}
            fill={isPreview ? '#a7aebb' : '#6a4ee0'}
          >
            {lbl.text}
          </text>
        ))}

        {/* Punkte */}
        {svgData.points.map((pt, i) => {
          const isHovered = hoveredPointLabel === pt.label
          return (
            <g
              key={i}
              onMouseEnter={() => !isPreview && pt.label && setHoveredPointLabel(pt.label)}
              onMouseLeave={() => setHoveredPointLabel(null)}
              className={!isPreview ? 'cursor-pointer' : ''}
            >
              <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />
              <circle
                cx={pt.x} cy={pt.y}
                r={isHovered ? 6 : 4.5}
                fill="#fff"
                stroke={isHovered ? HOT : stroke}
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
              {pt.label && (
                <text
                  x={pt.x}
                  y={pt.y - (isHovered ? 14 : 11)}
                  textAnchor="middle"
                  fontSize={isHovered ? 15 : 13}
                  fontWeight="700"
                  fill={isHovered ? HOT : textFill}
                  className="transition-all duration-150"
                >
                  {pt.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <p className="mb-1.5 font-mono text-[11.5px] text-ink-3">
        {isPreview ? 'Vorschau – Werte eingeben zum Berechnen' : 'Fahre über Ecken und Seiten, um sie hervorzuheben'}
      </p>
    </div>
  )
}
