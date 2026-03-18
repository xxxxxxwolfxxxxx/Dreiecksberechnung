import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const trapez: Shape = {
  id: 'trapez', label: 'Trapez', minRequired: 3,
  defaultValues: { a: 8, c: 4, h: 3, b: 4, d: 4, flaeche: 18, umfang: 20, mittellinie: 6 },
  inputs: [
    { key: 'a', label: 'Grundseite a', unit: 'length' },
    { key: 'c', label: 'Seite c (parallel)', unit: 'length' },
    { key: 'h', label: 'H\u00F6he h', unit: 'length' },
    { key: 'b', label: 'Schenkel b', unit: 'length', optional: true },
    { key: 'd', label: 'Schenkel d', unit: 'length', optional: true },
    { key: 'flaeche', label: 'Fl\u00E4che A', unit: 'area', optional: true },
  ],
  solve(k) {
    const { a, c, h, b, d, flaeche } = k as Record<string, number>
    const steps: string[] = []
    let hVal = h
    if (!hVal && flaeche && a && c) {
      hVal = (2 * flaeche) / (a + c)
      steps.push(`H\u00F6he aus Fl\u00E4che:\nh = 2A / (a + c) = 2 \u00B7 ${fmt(flaeche)} / (${fmt(a)} + ${fmt(c)}) = ${fmt(hVal)}`)
    }
    if (!hVal && a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
      if (a === c) return { solutions: [], error: 'a und c m\u00FCssen unterschiedlich sein f\u00FCr diese Berechnung' }
      const x1 = (a * a - c * c + d * d - b * b) / (2 * (a - c))
      const h2 = b * b - x1 * x1
      if (h2 < 0) return { solutions: [], error: 'Kein Trapez mit diesen Seiten m\u00F6glich' }
      hVal = Math.sqrt(h2)
      steps.push(`H\u00F6he aus den vier Seiten berechnet:\nh = ${fmt(hVal)}`)
    }
    if (!a || !c || !hVal) return { solutions: [], error: 'Grundseiten a, c und H\u00F6he h angeben' }

    if (steps.length === 0) {
      steps.push(`Gegeben: a = ${fmt(a)}, c = ${fmt(c)}, h = ${fmt(hVal)}`)
    }

    const A = ((a + c) / 2) * hVal
    const m = (a + c) / 2
    const bVal = b || Math.sqrt(hVal ** 2 + ((a - c) / 2) ** 2)
    const U = a + c + bVal + (d || bVal)

    steps.push(`Fl\u00E4che:\nA = (a + c) / 2 \u00B7 h = (${fmt(a)} + ${fmt(c)}) / 2 \u00B7 ${fmt(hVal)} = ${fmt(A)}`)
    steps.push(`Mittellinie:\nm = (a + c) / 2 = (${fmt(a)} + ${fmt(c)}) / 2 = ${fmt(m)}`)
    steps.push(`Umfang:\nU = a + b + c + d = ${fmt(U)}`)

    return { solutions: [{
      values: { a, c, h: hVal, flaeche: A, umfang: U, mittellinie: m },
      method: 'Trapez-Formel',
      formulas: ['A = (a + c) / 2 \u00B7 h', 'M = (a + c) / 2'],
      steps,
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.7) / v.a
    const ax = v.a * scale, cx = v.c * scale
    const h = Math.min(v.h * scale, size * 0.5)
    const ox = (size - ax) / 2, oy = size * 0.75
    const offset = (ax - cx) / 2
    return {
      points: [
        { x: ox, y: oy, label: '' },
        { x: ox + ax, y: oy, label: '' },
        { x: ox + offset + cx, y: oy - h, label: '' },
        { x: ox + offset, y: oy - h, label: '' },
      ],
      lines: [
        { from: 0, to: 1, label: `a = ${v.a}` },
        { from: 1, to: 2 },
        { from: 2, to: 3, label: `c = ${v.c}` },
        { from: 3, to: 0 },
      ],
      width: size, height: size,
    }
  },
}
