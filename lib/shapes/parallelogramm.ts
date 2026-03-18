import type { Shape, SVGData } from './types'

const toRad = (d: number) => (d * Math.PI) / 180

export const parallelogramm: Shape = {
  id: 'parallelogramm', label: 'Parallelogramm', minRequired: 3,
  inputs: [
    { key: 'a',     label: 'Seite a',  unit: 'length' },
    { key: 'b',     label: 'Seite b',  unit: 'length', optional: true },
    { key: 'alpha', label: 'Winkel α', unit: 'angle',  optional: true },
    { key: 'h_a',   label: 'Höhe h_a', unit: 'length', optional: true },
    { key: 'd1',    label: 'Diagonale d1', unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, b, alpha, h_a, d1 } = k as Record<string, number>
    let aVal = a, alphaVal = alpha, h = h_a
    if (!aVal) return { solutions: [], error: 'Seite a eingeben' }

    // d1 + a + b → alpha berechnen
    if (!alphaVal && aVal && b && d1) {
      const cosAlpha = (aVal * aVal + b * b - d1 * d1) / (2 * aVal * b)
      if (Math.abs(cosAlpha) > 1) return { solutions: [], error: 'Kein Parallelogramm mit diesen Werten möglich' }
      alphaVal = Math.acos(cosAlpha) * 180 / Math.PI
    }

    if (!h && aVal && alphaVal) h = aVal * Math.sin(toRad(alphaVal))
    if (!alphaVal && h && aVal) alphaVal = Math.asin(Math.min(h / aVal, 1)) * 180 / Math.PI
    if (!h && alphaVal) h = aVal * Math.sin(toRad(alphaVal))

    if (!h && !alphaVal) return { solutions: [], error: 'Winkel α oder Höhe h_a eingeben' }

    const hSafe = h as number
    const flaecheVal = b && alphaVal ? aVal * b * Math.sin(toRad(alphaVal)) : aVal * hSafe
    const values: Record<string, number> = { a: aVal, h_a: hSafe, flaeche: flaecheVal }

    if (b) {
      values.b = b
      values.umfang = 2 * (aVal + b)
      if (alphaVal) {
        values.alpha = alphaVal
        values.beta = 180 - alphaVal
        values.d1 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(alphaVal)))
        values.d2 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(180 - alphaVal)))
      }
    }

    return { solutions: [{
      values,
      method: 'Parallelogramm-Formeln',
      formulas: ['A = a · h', 'U = 2(a + b)'],
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
