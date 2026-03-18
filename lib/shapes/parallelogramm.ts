import type { Shape, SVGData } from './types'

const toRad = (d: number) => (d * Math.PI) / 180

export const parallelogramm: Shape = {
  id: 'parallelogramm', label: 'Parallelogramm', minRequired: 3,
  inputs: [
    { key: 'a',     label: 'Seite a',  unit: 'length' },
    { key: 'b',     label: 'Seite b',  unit: 'length' },
    { key: 'alpha', label: 'Winkel α', unit: 'angle' },
    { key: 'h_a',   label: 'Höhe h_a', unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, b, alpha, h_a } = k as Record<string, number>
    let aVal = a, alphaVal = alpha, h = h_a
    if (!h && aVal && alphaVal) h = aVal * Math.sin(toRad(alphaVal))
    if (!aVal || !b) return { solutions: [], error: 'Seiten a und b eingeben' }
    if (!alphaVal && !h) return { solutions: [], error: 'Winkel α oder Höhe h_a eingeben' }
    if (!alphaVal) alphaVal = Math.asin(h / aVal) * 180 / Math.PI
    if (!h) h = aVal * Math.sin(toRad(alphaVal))
    const flaeche = aVal * b * Math.sin(toRad(alphaVal))
    const d1 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(alphaVal)))
    const d2 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(180-alphaVal)))
    return { solutions: [{
      values: { a: aVal, b, alpha: alphaVal, beta: 180 - alphaVal, h_a: h, flaeche, umfang: 2*(aVal+b), d1, d2 },
      method: 'Parallelogramm-Formeln',
      formulas: ['A = a · h = a · b · sin(α)', 'U = 2(a + b)'],
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.6) / v.a
    const a = v.a * scale, b = v.b * scale
    const angle = toRad(v.alpha || 70)
    const dx = b * Math.cos(angle), dy = b * Math.sin(angle)
    const ox = size * 0.15, oy = size * 0.75
    return {
      points: [
        { x: ox, y: oy, label: '' },
        { x: ox + a, y: oy, label: '' },
        { x: ox + a + dx, y: oy - dy, label: '' },
        { x: ox + dx, y: oy - dy, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2, label: `b = ${v.b}` },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}
