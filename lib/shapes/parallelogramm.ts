import type { Shape } from './types'
import { formatNumber } from '../format'

const toRad = (d: number) => (d * Math.PI) / 180
const fmt = formatNumber

export const parallelogramm: Shape = {
  id: 'parallelogramm', label: 'Parallelogramm', minRequired: 3,
  defaultValues: { a: 6, b: 4, alpha: 60, beta: 120, h_a: 3.46, flaeche: 20.78, umfang: 20, d1: 5.29, d2: 8.72 },
  inputs: [
    { key: 'a',     label: 'Seite a',  unit: 'length' },
    { key: 'b',     label: 'Seite b',  unit: 'length', optional: true },
    { key: 'alpha', label: 'Winkel \u03B1', unit: 'angle',  optional: true },
    { key: 'h_a',   label: 'H\u00F6he h_a', unit: 'length', optional: true },
    { key: 'd1',    label: 'Diagonale d1', unit: 'length', optional: true },
  ],
  solve(k) {
    const { a, b, alpha, h_a, d1 } = k as Record<string, number>
    const steps: string[] = []
    const aVal = a; let alphaVal = alpha, h = h_a
    if (!aVal) return { solutions: [], error: 'Seite a eingeben' }

    // d1 + a + b -> alpha berechnen
    if (!alphaVal && aVal && b && d1) {
      const cosAlpha = (aVal * aVal + b * b - d1 * d1) / (2 * aVal * b)
      if (Math.abs(cosAlpha) > 1) return { solutions: [], error: 'Kein Parallelogramm mit diesen Werten m\u00F6glich' }
      alphaVal = Math.acos(cosAlpha) * 180 / Math.PI
      steps.push(`Winkel \u03B1 aus den Diagonalen:\ncos(\u03B1) = (a\u00B2 + b\u00B2 \u2212 d1\u00B2) / (2\u00B7a\u00B7b) = ${fmt(cosAlpha)}\n\u03B1 = ${fmt(alphaVal)}\u00B0`)
    }

    if (!h && aVal && alphaVal) h = aVal * Math.sin(toRad(alphaVal))
    if (!alphaVal && h && aVal) alphaVal = Math.asin(Math.min(h / aVal, 1)) * 180 / Math.PI
    if (!h && alphaVal) h = aVal * Math.sin(toRad(alphaVal))

    if (!h && !alphaVal) return { solutions: [], error: 'Winkel \u03B1 oder H\u00F6he h_a eingeben' }

    if (steps.length === 0) {
      const parts = [`a = ${fmt(aVal)}`]
      if (b) parts.push(`b = ${fmt(b)}`)
      if (alphaVal) parts.push(`\u03B1 = ${fmt(alphaVal)}\u00B0`)
      if (h_a) parts.push(`h_a = ${fmt(h_a)}`)
      steps.push(`Gegeben: ${parts.join(', ')}`)
    }

    const hSafe = h as number
    if (alphaVal && !h_a) {
      steps.push(`H\u00F6he:\nh_a = a \u00B7 sin(\u03B1) = ${fmt(aVal)} \u00B7 sin(${fmt(alphaVal)}\u00B0) = ${fmt(hSafe)}`)
    }

    const flaecheVal = b && alphaVal ? aVal * b * Math.sin(toRad(alphaVal)) : aVal * hSafe
    const values: Record<string, number> = { a: aVal, h_a: hSafe, flaeche: flaecheVal }

    if (b) {
      values.b = b
      values.umfang = 2 * (aVal + b)
      steps.push(`Fl\u00E4che:\nA = a \u00B7 b \u00B7 sin(\u03B1) = ${fmt(aVal)} \u00B7 ${fmt(b)} \u00B7 sin(${fmt(alphaVal!)}\u00B0) = ${fmt(flaecheVal)}`)
      steps.push(`Umfang:\nU = 2 \u00B7 (a + b) = 2 \u00B7 (${fmt(aVal)} + ${fmt(b)}) = ${fmt(values.umfang)}`)
      if (alphaVal) {
        values.alpha = alphaVal
        values.beta = 180 - alphaVal
        values.d1 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(alphaVal)))
        values.d2 = Math.sqrt(aVal**2 + b**2 - 2*aVal*b*Math.cos(toRad(180 - alphaVal)))
        steps.push(`Diagonalen:\nd1 = ${fmt(values.d1)}, d2 = ${fmt(values.d2)}`)
      }
    } else {
      steps.push(`Fl\u00E4che:\nA = a \u00B7 h = ${fmt(aVal)} \u00B7 ${fmt(hSafe)} = ${fmt(flaecheVal)}`)
    }

    return { solutions: [{
      values,
      method: 'Parallelogramm-Formeln',
      formulas: ['A = a \u00B7 h', 'U = 2(a + b)'],
      steps,
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
