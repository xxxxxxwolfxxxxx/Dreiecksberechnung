'use client'
import { formatNumber } from '@/lib/format'

/** Punkt der Skizze. Koordinaten in Rechen-Einheiten, y wächst nach unten (SVG). */
export interface SkizzePunkt {
  x: number
  y: number
  label: string
  /** 'hilfspunkt' ist z.B. der Fußpunkt des Lots — klein und unbeschriftet. */
  art: 'objekt' | 'boot' | 'hilfspunkt'
}

export interface SkizzeLinie {
  von: number
  bis: number
  label?: string
  gestrichelt?: boolean
}

interface Props {
  punkte: SkizzePunkt[]
  linien: SkizzeLinie[]
  /** Einheit für die Streckenbeschriftung, z.B. 'sm'. */
  einheit?: string
  /** Kurze Bildunterschrift. */
  legende?: string
}

const BREITE = 340
const HOEHE = 230
const RAND = 42

/**
 * Maßstäbliche Dreiecksskizze für die Peilungs-Rechner.
 * Skaliert die übergebenen Punkte gleichmäßig in die Zeichenfläche, damit die
 * Form des Dreiecks stimmt – Winkel und Längenverhältnisse bleiben erhalten.
 */
export function PeilSkizze({ punkte, linien, einheit = '', legende }: Props) {
  const xs = punkte.map(p => p.x)
  const ys = punkte.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const spanneX = maxX - minX || 1
  const spanneY = maxY - minY || 1
  const skala = Math.min((BREITE - 2 * RAND) / spanneX, (HOEHE - 2 * RAND) / spanneY)
  const versatzX = (BREITE - spanneX * skala) / 2
  const versatzY = (HOEHE - spanneY * skala) / 2

  const auf = (p: { x: number; y: number }) => ({
    x: versatzX + (p.x - minX) * skala,
    y: versatzY + (p.y - minY) * skala,
  })

  const bild = punkte.map(auf)

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${BREITE} ${HOEHE}`}
        className="w-full h-auto"
        role="img"
        aria-label={legende ?? 'Skizze des Peildreiecks'}
      >
        {linien.map((linie, i) => {
          const a = bild[linie.von]
          const b = bild[linie.bis]
          const mitte = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={linie.gestrichelt ? '#94a3b8' : '#0d9488'}
                strokeWidth={linie.gestrichelt ? 1.5 : 2.5}
                strokeDasharray={linie.gestrichelt ? '5 4' : undefined}
                strokeLinecap="round"
              />
              {linie.label && (
                <text
                  x={mitte.x}
                  y={mitte.y - 6}
                  textAnchor="middle"
                  className="fill-teal-700"
                  style={{ fontSize: 11, fontWeight: 700 }}
                >
                  {linie.label}
                </text>
              )}
            </g>
          )
        })}

        {punkte.map((punkt, i) => {
          const p = bild[i]
          if (punkt.art === 'hilfspunkt') {
            return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#94a3b8" />
          }
          const istBoot = punkt.art === 'boot'
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={istBoot ? 6 : 5}
                fill={istBoot ? '#0f766e' : '#f59e0b'}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y + (istBoot ? 22 : -13)}
                textAnchor="middle"
                className={istBoot ? 'fill-teal-800' : 'fill-amber-700'}
                style={{ fontSize: 12, fontWeight: 800 }}
              >
                {punkt.label}
              </text>
            </g>
          )
        })}
      </svg>
      {legende && (
        <figcaption className="mt-2 text-center text-xs text-slate-400 font-medium">
          {legende}
          {einheit ? ` · Längen in ${einheit}` : ''}
        </figcaption>
      )}
    </figure>
  )
}

/** Beschriftung einer Strecke: „2,83 sm". */
export function streckenLabel(wert: number, einheit: string): string {
  return `${formatNumber(wert)}${einheit ? ` ${einheit}` : ''}`
}
