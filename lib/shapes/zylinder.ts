import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const zylinder: Shape = {
  id: 'zylinder',
  label: 'Zylinder',
  minRequired: 2,
  defaultValues: { r: 4, h: 8 },
  inputs: [
    { key: 'r', label: 'Radius r', unit: 'length' },
    { key: 'h', label: 'H\u00F6he h', unit: 'length' },
  ],
  solve(k) {
    const { r, h } = k
    if (!r || !h) return { solutions: [], error: 'Radius r und H\u00F6he h werden ben\u00F6tigt' }

    const grundflaeche = Math.PI * r ** 2
    const mantelflaeche = 2 * Math.PI * r * h
    const oberflaeche = 2 * Math.PI * r * (r + h)
    const volumen = Math.PI * r ** 2 * h

    const steps: string[] = [
      `Gegeben: r = ${fmt(r)}, h = ${fmt(h)}`,
      `Grundfl\u00E4che:\nG = \u03C0 \u00B7 r\u00B2 = \u03C0 \u00B7 ${fmt(r)}\u00B2 = \u03C0 \u00B7 ${fmt(r ** 2)} \u2248 ${fmt(grundflaeche)}`,
      `Mantelfl\u00E4che:\nM = 2 \u00B7 \u03C0 \u00B7 r \u00B7 h = 2 \u00B7 \u03C0 \u00B7 ${fmt(r)} \u00B7 ${fmt(h)} \u2248 ${fmt(mantelflaeche)}`,
      `Oberfl\u00E4che:\nA = 2 \u00B7 \u03C0 \u00B7 r \u00B7 (r + h)\n= 2 \u00B7 \u03C0 \u00B7 ${fmt(r)} \u00B7 (${fmt(r)} + ${fmt(h)})\n= 2 \u00B7 \u03C0 \u00B7 ${fmt(r)} \u00B7 ${fmt(r + h)}\n\u2248 ${fmt(oberflaeche)}`,
      `Volumen:\nV = \u03C0 \u00B7 r\u00B2 \u00B7 h = \u03C0 \u00B7 ${fmt(r)}\u00B2 \u00B7 ${fmt(h)} \u2248 ${fmt(volumen)}`,
    ]

    return {
      solutions: [{
        values: { r, h, grundflaeche, mantelflaeche, oberflaeche, volumen },
        method: 'Zylinder-Formeln',
        formulas: [
          'G = \u03C0 \u00B7 r\u00B2',
          'M = 2 \u00B7 \u03C0 \u00B7 r \u00B7 h',
          'A = 2 \u00B7 \u03C0 \u00B7 r \u00B7 (r + h)',
          'V = \u03C0 \u00B7 r\u00B2 \u00B7 h',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    const { r, h } = v

    // Skalierung: Gesamthöhe = h + 2*r*0.25, Gesamtbreite = 2*r
    const totalH = h + 2 * r * 0.25
    const totalW = 2 * r
    const scale = Math.min((size * 0.75) / totalH, (size * 0.75) / totalW)

    const r_svg = r * scale
    const h_svg = h * scale
    const ry = r_svg * 0.25

    const cx = size / 2
    const top_y = (size - h_svg) / 2
    const bot_y = top_y + h_svg

    const pts = [
      { x: cx - r_svg, y: top_y, label: '' }, // 0: oben links
      { x: cx + r_svg, y: top_y, label: '' }, // 1: oben rechts
      { x: cx - r_svg, y: bot_y, label: '' }, // 2: unten links
      { x: cx + r_svg, y: bot_y, label: '' }, // 3: unten rechts
      { x: cx,         y: top_y, label: '' }, // 4: Mitte oben (Radiuslinie Start)
      { x: cx + r_svg, y: top_y, label: '' }, // 5: Mitte oben rechts (Radiuslinie Ende)
    ]

    return {
      points: pts,
      lines: [
        { from: 0, to: 2, label: 'h' },
        { from: 1, to: 3 },
        { from: 4, to: 5, label: 'r' },
      ],
      ellipses: [
        { cx, cy: top_y, rx: r_svg, ry, dashed: false },
        { cx, cy: bot_y, rx: r_svg, ry, dashed: false },
      ],
      width: size,
      height: size,
    }
  },
}
