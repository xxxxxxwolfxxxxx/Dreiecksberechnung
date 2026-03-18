import type { Shape } from './types'
import { formatNumber } from '../format'

const toRad2 = (d: number) => (d * Math.PI) / 180
const fmt = formatNumber

export const raute: Shape = {
  id: 'raute', label: 'Raute', minRequired: 2,
  defaultValues: { a: 5, alpha: 60, beta: 120, h: 4.33, d1: 5, d2: 8.66, flaeche: 21.65, umfang: 20 },
  inputs: [
    { key: 'a',     label: 'Seite a',     unit: 'length' },
    { key: 'alpha', label: 'Winkel \u03B1',    unit: 'angle', optional: true },
    { key: 'd1',    label: 'Diagonale d1',unit: 'length', optional: true },
    { key: 'd2',    label: 'Diagonale d2',unit: 'length', optional: true },
    { key: 'h',     label: 'H\u00F6he h',      unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, alpha, d1, d2, h } = k as Record<string, number>
    if (d1 && d2) {
      const aVal = Math.sqrt((d1/2)**2 + (d2/2)**2)
      const alphaVal = 2 * Math.asin(d2 / (2 * aVal)) * 180 / Math.PI
      const hVal = d2*d1/(2*aVal)
      const steps = [
        `Gegeben: d1 = ${fmt(d1)}, d2 = ${fmt(d2)}`,
        `Seite a:\na = \u221A((d1/2)\u00B2 + (d2/2)\u00B2) = \u221A((${fmt(d1/2)})\u00B2 + (${fmt(d2/2)})\u00B2) = ${fmt(aVal)}`,
        `Winkel \u03B1:\n\u03B1 = 2 \u00B7 arcsin(d2 / (2a)) = ${fmt(alphaVal)}\u00B0`,
        `Fl\u00E4che:\nA = d1 \u00B7 d2 / 2 = ${fmt(d1)} \u00B7 ${fmt(d2)} / 2 = ${fmt(d1*d2/2)}`,
        `Umfang:\nU = 4a = 4 \u00B7 ${fmt(aVal)} = ${fmt(4*aVal)}`,
      ]
      return { solutions: [{
        values: { a: aVal, alpha: alphaVal, d1, d2, flaeche: d1*d2/2, umfang: 4*aVal, h: hVal },
        method: 'Raute (Diagonalen)',
        formulas: ['A = d1 \u00B7 d2 / 2'],
        steps,
      }] }
    }
    if (!a) return { solutions: [], error: 'Seite a eingeben' }
    let alphaVal = alpha
    if (!alphaVal && h) alphaVal = Math.asin(h / a) * 180 / Math.PI
    if (!alphaVal) return { solutions: [], error: 'Winkel \u03B1 oder H\u00F6he h eingeben' }
    const hVal = a * Math.sin(toRad2(alphaVal))
    const d1Val = 2 * a * Math.sin(toRad2(alphaVal / 2))
    const d2Val = 2 * a * Math.cos(toRad2(alphaVal / 2))
    const flaecheVal = a * hVal

    const steps = [
      `Gegeben: a = ${fmt(a)}, \u03B1 = ${fmt(alphaVal)}\u00B0`,
      `H\u00F6he:\nh = a \u00B7 sin(\u03B1) = ${fmt(a)} \u00B7 sin(${fmt(alphaVal)}\u00B0) = ${fmt(hVal)}`,
      `Diagonale d1:\nd1 = 2a \u00B7 sin(\u03B1/2) = 2 \u00B7 ${fmt(a)} \u00B7 sin(${fmt(alphaVal/2)}\u00B0) = ${fmt(d1Val)}`,
      `Diagonale d2:\nd2 = 2a \u00B7 cos(\u03B1/2) = 2 \u00B7 ${fmt(a)} \u00B7 cos(${fmt(alphaVal/2)}\u00B0) = ${fmt(d2Val)}`,
      `Fl\u00E4che:\nA = a \u00B7 h = ${fmt(a)} \u00B7 ${fmt(hVal)} = ${fmt(flaecheVal)}`,
      `Umfang:\nU = 4a = 4 \u00B7 ${fmt(a)} = ${fmt(4 * a)}`,
    ]

    return { solutions: [{
      values: { a, alpha: alphaVal, beta: 180 - alphaVal, h: hVal, d1: d1Val, d2: d2Val, flaeche: flaecheVal, umfang: 4 * a },
      method: 'Raute (Seite + Winkel)',
      formulas: ['A = a \u00B7 h = a\u00B2 \u00B7 sin(\u03B1)', 'U = 4a'],
      steps,
    }] }
  },
  toSVG(v, size) {
    const cx = size / 2, cy = size / 2
    const actualD1 = v.d1 || v.a * Math.sqrt(2)
    const actualD2 = v.d2 || v.a * Math.sqrt(2)
    // Skaliere so dass die größte Halbdiagonale maximal 40% der SVG-Größe beträgt
    const maxHalf = Math.max(actualD1, actualD2) / 2
    const scale = (size * 0.4) / maxHalf
    const hd1 = (actualD1 / 2) * scale  // halbe horizontale Diagonale
    const hd2 = (actualD2 / 2) * scale  // halbe vertikale Diagonale
    return {
      points: [
        { x: cx,       y: cy - hd2, label: '' },
        { x: cx + hd1, y: cy,       label: '' },
        { x: cx,       y: cy + hd2, label: '' },
        { x: cx - hd1, y: cy,       label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}
