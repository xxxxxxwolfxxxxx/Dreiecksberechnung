import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const kreis: Shape = {
  id: 'kreis', label: 'Kreis', minRequired: 1,
  defaultValues: { r: 5, d: 10, umfang: 31.42, flaeche: 78.54 },
  inputs: [
    { key: 'r',      label: 'Radius r',      unit: 'length' },
    { key: 'd',      label: 'Durchmesser d', unit: 'length' },
    { key: 'umfang', label: 'Umfang U',      unit: 'length' },
    { key: 'flaeche',label: 'Fl\u00E4che A',      unit: 'area'   },
  ],
  solve(k) {
    let r: number | undefined
    let steps: string[]
    if (k.r) {
      r = k.r
      steps = [
        `Gegeben: Radius r = ${fmt(r)}`,
        `Durchmesser:\nd = 2 \u00B7 r = 2 \u00B7 ${fmt(r)} = ${fmt(2 * r)}`,
        `Umfang:\nU = 2\u03C0r = 2 \u00B7 \u03C0 \u00B7 ${fmt(r)} = ${fmt(2 * Math.PI * r)}`,
        `Fl\u00E4che:\nA = \u03C0r\u00B2 = \u03C0 \u00B7 ${fmt(r)}\u00B2 = ${fmt(Math.PI * r * r)}`,
      ]
    } else if (k.d) {
      r = k.d / 2
      steps = [
        `Gegeben: Durchmesser d = ${fmt(k.d)}`,
        `Radius:\nr = d / 2 = ${fmt(k.d)} / 2 = ${fmt(r)}`,
        `Umfang:\nU = \u03C0 \u00B7 d = \u03C0 \u00B7 ${fmt(k.d)} = ${fmt(2 * Math.PI * r)}`,
        `Fl\u00E4che:\nA = \u03C0r\u00B2 = \u03C0 \u00B7 ${fmt(r)}\u00B2 = ${fmt(Math.PI * r * r)}`,
      ]
    } else if (k.umfang) {
      r = k.umfang / (2 * Math.PI)
      steps = [
        `Gegeben: Umfang U = ${fmt(k.umfang)}`,
        `Radius:\nr = U / (2\u03C0) = ${fmt(k.umfang)} / (2\u03C0) = ${fmt(r)}`,
        `Durchmesser:\nd = 2r = ${fmt(2 * r)}`,
        `Fl\u00E4che:\nA = \u03C0r\u00B2 = ${fmt(Math.PI * r * r)}`,
      ]
    } else if (k.flaeche) {
      r = Math.sqrt(k.flaeche / Math.PI)
      steps = [
        `Gegeben: Fl\u00E4che A = ${fmt(k.flaeche)}`,
        `Radius:\nr = \u221A(A / \u03C0) = \u221A(${fmt(k.flaeche)} / \u03C0) = ${fmt(r)}`,
        `Durchmesser:\nd = 2r = ${fmt(2 * r)}`,
        `Umfang:\nU = 2\u03C0r = ${fmt(2 * Math.PI * r)}`,
      ]
    } else {
      steps = []
    }
    if (!r || r <= 0) return { solutions: [], error: 'Bitte einen Wert eingeben' }
    return { solutions: [{
      values: { r, d: 2*r, umfang: 2*Math.PI*r, flaeche: Math.PI*r*r },
      method: 'Kreisformeln',
      formulas: ['U = 2\u03C0r', 'A = \u03C0r\u00B2'],
      steps,
    }] }
  },
  toSVG(values, size) {
    const cx = size / 2, cy = size / 2
    const r = size * 0.38
    const midX = cx + r / 2
    return {
      points: [
        { x: cx, y: cy, label: 'M' },           // Mittelpunkt
        { x: cx + r, y: cy, label: '' },         // Punkt auf dem Kreis
      ],
      lines: [
        { from: 0, to: 1, label: `r = ${fmt(values.r)}` },  // Radius-Linie
      ],
      circles: [
        { cx, cy, r },
      ],
      width: size, height: size,
    }
  },
}
