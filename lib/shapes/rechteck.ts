import type { Shape, SVGData } from './types'

export const rechteck: Shape = {
  id: 'rechteck', label: 'Rechteck', minRequired: 2,
  inputs: [
    { key: 'a', label: 'Seite a', unit: 'length' },
    { key: 'b', label: 'Seite b', unit: 'length' },
    { key: 'diagonale', label: 'Diagonale d', unit: 'length', optional: true },
    { key: 'flaeche',   label: 'Fläche A',    unit: 'area',   optional: true },
    { key: 'umfang',    label: 'Umfang U',    unit: 'length', optional: true },
  ],
  solve(k) {
    let a = k.a, b = k.b
    if (!a && !b) return { solutions: [], error: 'Mindestens eine Seite eingeben' }
    if (!a && k.flaeche && b) a = k.flaeche / b
    if (!b && k.flaeche && a) b = k.flaeche / a
    if (!a && k.diagonale && b) a = Math.sqrt(k.diagonale ** 2 - b ** 2)
    if (!b && k.diagonale && a) b = Math.sqrt(k.diagonale ** 2 - a ** 2)
    if (!a && k.umfang && b) a = k.umfang / 2 - b
    if (!b && k.umfang && a) b = k.umfang / 2 - a
    if (!a || !b) return { solutions: [], error: 'Nicht genug Werte für eindeutige Lösung' }
    const d = Math.sqrt(a * a + b * b)
    return { solutions: [{
      values: { a, b, flaeche: a * b, umfang: 2 * (a + b), diagonale: d },
      method: 'Rechteck-Formeln',
      formulas: ['A = a · b', 'U = 2(a + b)', 'd = √(a² + b²)'],
    }] }
  },
  toSVG(v, size) {
    const scale = (size * 0.7) / Math.max(v.a, v.b)
    const w = v.a * scale, h = v.b * scale
    const ox = (size - w) / 2, oy = (size - h) / 2
    return {
      points: [
        { x: ox,   y: oy,   label: '' },
        { x: ox+w, y: oy,   label: '' },
        { x: ox+w, y: oy+h, label: '' },
        { x: ox,   y: oy+h, label: '' },
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
