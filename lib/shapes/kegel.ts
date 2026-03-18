import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const kegel: Shape = {
  id: 'kegel',
  label: 'Kegel',
  minRequired: 2,
  defaultValues: { r: 4, h: 8 },
  inputs: [
    { key: 'r', label: 'Radius r', unit: 'length' },
    { key: 'h', label: 'H\u00F6he h', unit: 'length' },
  ],
  solve(k) {
    const { r, h } = k
    if (!r || !h) return { solutions: [], error: 'Radius r und H\u00F6he h werden ben\u00F6tigt' }

    const mantellinie = Math.sqrt(r ** 2 + h ** 2)
    const grundflaeche = Math.PI * r ** 2
    const mantelflaeche = Math.PI * r * mantellinie
    const oberflaeche = Math.PI * r * (r + mantellinie)
    const volumen = (1 / 3) * Math.PI * r ** 2 * h

    const steps: string[] = [
      `Gegeben: r = ${fmt(r)}, h = ${fmt(h)}`,
      `Mantellinie (Schr\u00E4glinie):\ns = \u221A(r\u00B2 + h\u00B2)\n= \u221A(${fmt(r)}\u00B2 + ${fmt(h)}\u00B2)\n= \u221A(${fmt(r ** 2)} + ${fmt(h ** 2)})\n= \u221A${fmt(r ** 2 + h ** 2)}\n\u2248 ${fmt(mantellinie)}`,
      `Grundfl\u00E4che:\nG = \u03C0 \u00B7 r\u00B2 = \u03C0 \u00B7 ${fmt(r)}\u00B2 \u2248 ${fmt(grundflaeche)}`,
      `Mantelfl\u00E4che:\nM = \u03C0 \u00B7 r \u00B7 s\n= \u03C0 \u00B7 ${fmt(r)} \u00B7 ${fmt(mantellinie)}\n\u2248 ${fmt(mantelflaeche)}`,
      `Oberfl\u00E4che:\nA = \u03C0 \u00B7 r \u00B7 (r + s)\n= \u03C0 \u00B7 ${fmt(r)} \u00B7 (${fmt(r)} + ${fmt(mantellinie)})\n= \u03C0 \u00B7 ${fmt(r)} \u00B7 ${fmt(r + mantellinie)}\n\u2248 ${fmt(oberflaeche)}`,
      `Volumen:\nV = \u2153 \u00B7 \u03C0 \u00B7 r\u00B2 \u00B7 h\n= \u2153 \u00B7 \u03C0 \u00B7 ${fmt(r)}\u00B2 \u00B7 ${fmt(h)}\n= \u2153 \u00B7 \u03C0 \u00B7 ${fmt(r ** 2)} \u00B7 ${fmt(h)}\n\u2248 ${fmt(volumen)}`,
    ]

    return {
      solutions: [{
        values: { r, h, mantellinie, grundflaeche, mantelflaeche, oberflaeche, volumen },
        method: 'Kegel-Formeln',
        formulas: [
          's = \u221A(r\u00B2 + h\u00B2)',
          'G = \u03C0 \u00B7 r\u00B2',
          'M = \u03C0 \u00B7 r \u00B7 s',
          'A = \u03C0 \u00B7 r \u00B7 (r + s)',
          'V = \u2153 \u00B7 \u03C0 \u00B7 r\u00B2 \u00B7 h',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    const { r, h } = v

    // Gleiche Skalierung wie Zylinder
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
      { x: cx,          y: top_y, label: 'S' }, // 0: Spitze
      { x: cx - r_svg,  y: bot_y, label: '' },  // 1: Basis links
      { x: cx + r_svg,  y: bot_y, label: '' },  // 2: Basis rechts
      { x: cx,          y: bot_y, label: '' },  // 3: Basis Mitte (Höhenlinie)
    ]

    return {
      points: pts,
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2, label: 's' },
        { from: 0, to: 3, label: 'h', dashed: true },
        { from: 3, to: 2, label: 'r' },
      ],
      ellipses: [
        { cx, cy: bot_y, rx: r_svg, ry, dashed: false },
      ],
      width: size,
      height: size,
    }
  },
}
