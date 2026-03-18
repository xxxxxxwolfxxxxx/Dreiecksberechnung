import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const kugel: Shape = {
  id: 'kugel',
  label: 'Kugel',
  minRequired: 1,
  defaultValues: { r: 5 },
  inputs: [
    { key: 'r', label: 'Radius r', unit: 'length' },
  ],
  solve(k) {
    const r = k.r
    if (!r) return { solutions: [], error: 'Radius r wird ben\u00F6tigt' }

    const volumen = (4 / 3) * Math.PI * r ** 3
    const oberflaeche = 4 * Math.PI * r ** 2

    const steps: string[] = [
      `Gegeben: r = ${fmt(r)}`,
      `Volumen:\nV = \u2154 \u00B7 \u03C0 \u00B7 r\u00B3\n= \u2154 \u00B7 \u03C0 \u00B7 ${fmt(r)}\u00B3\n= \u2154 \u00B7 \u03C0 \u00B7 ${fmt(r ** 3)}\n\u2248 ${fmt(volumen)}`,
      `Oberfl\u00E4che:\nA = 4 \u00B7 \u03C0 \u00B7 r\u00B2\n= 4 \u00B7 \u03C0 \u00B7 ${fmt(r)}\u00B2\n= 4 \u00B7 \u03C0 \u00B7 ${fmt(r ** 2)}\n\u2248 ${fmt(oberflaeche)}`,
    ]

    return {
      solutions: [{
        values: { r, volumen, oberflaeche },
        method: 'Kugel-Formeln',
        formulas: [
          'V = \u2154 \u00B7 \u03C0 \u00B7 r\u00B3',
          'A = 4 \u00B7 \u03C0 \u00B7 r\u00B2',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    const cx = size / 2
    const cy = size / 2
    const r_svg = size * 0.38

    return {
      points: [
        { x: cx,          y: cy, label: 'M' },   // 0: Mittelpunkt
        { x: cx + r_svg,  y: cy, label: '' },     // 1: Radiuslinie Ende
      ],
      lines: [
        { from: 0, to: 1, label: 'r' },
      ],
      circles: [
        { cx, cy, r: r_svg },
      ],
      ellipses: [
        { cx, cy, rx: r_svg, ry: r_svg * 0.29, dashed: true },
      ],
      width: size,
      height: size,
    }
  },
}
