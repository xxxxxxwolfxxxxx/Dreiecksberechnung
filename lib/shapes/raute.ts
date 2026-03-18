import type { Shape, SVGData } from './types'

const toRad2 = (d: number) => (d * Math.PI) / 180

export const raute: Shape = {
  id: 'raute', label: 'Raute', minRequired: 2,
  inputs: [
    { key: 'a',     label: 'Seite a',     unit: 'length' },
    { key: 'alpha', label: 'Winkel α',    unit: 'angle', optional: true },
    { key: 'd1',    label: 'Diagonale d1',unit: 'length', optional: true },
    { key: 'd2',    label: 'Diagonale d2',unit: 'length', optional: true },
    { key: 'h',     label: 'Höhe h',      unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, alpha, d1, d2, h } = k as Record<string, number>
    if (d1 && d2) {
      const aVal = Math.sqrt((d1/2)**2 + (d2/2)**2)
      const alphaVal = 2 * Math.asin(d2 / (2 * aVal)) * 180 / Math.PI
      return { solutions: [{
        values: { a: aVal, alpha: alphaVal, d1, d2, flaeche: d1*d2/2, umfang: 4*aVal, h: d2*d1/(2*aVal) },
        method: 'Raute (Diagonalen)',
        formulas: ['A = d1 · d2 / 2'],
      }] }
    }
    if (!a) return { solutions: [], error: 'Seite a eingeben' }
    let alphaVal = alpha
    if (!alphaVal && h) alphaVal = Math.asin(h / a) * 180 / Math.PI
    if (!alphaVal) return { solutions: [], error: 'Winkel α oder Höhe h eingeben' }
    const hVal = a * Math.sin(toRad2(alphaVal))
    const d1Val = 2 * a * Math.sin(toRad2(alphaVal / 2))
    const d2Val = 2 * a * Math.cos(toRad2(alphaVal / 2))
    return { solutions: [{
      values: { a, alpha: alphaVal, beta: 180 - alphaVal, h: hVal, d1: d1Val, d2: d2Val, flaeche: a * hVal, umfang: 4 * a },
      method: 'Raute (Seite + Winkel)',
      formulas: ['A = a · h = a² · sin(α)', 'U = 4a'],
    }] }
  },
  toSVG(v, size) {
    const cx = size / 2, cy = size / 2
    const d1 = ((v.d1 || v.a * 1.2)) * size * 0.35 / v.a
    const d2 = ((v.d2 || v.a)) * size * 0.35 / v.a
    return {
      points: [
        { x: cx, y: cy - d2, label: '' },
        { x: cx + d1, y: cy, label: '' },
        { x: cx, y: cy + d2, label: '' },
        { x: cx - d1, y: cy, label: '' },
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
