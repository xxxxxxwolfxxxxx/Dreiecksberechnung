import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const rechteck: Shape = {
  id: 'rechteck', label: 'Rechteck', minRequired: 2,
  defaultValues: { a: 6, b: 4, flaeche: 24, umfang: 20, diagonale: 7.21 },
  inputs: [
    { key: 'a', label: 'Seite a', unit: 'length' },
    { key: 'b', label: 'Seite b', unit: 'length' },
    { key: 'diagonale', label: 'Diagonale d', unit: 'length', optional: true },
    { key: 'flaeche',   label: 'Fl\u00E4che A',    unit: 'area',   optional: true },
    { key: 'umfang',    label: 'Umfang U',    unit: 'length', optional: true },
  ],
  solve(k) {
    let a = k.a, b = k.b
    const steps: string[] = []
    if (!a && !b) return { solutions: [], error: 'Mindestens eine Seite eingeben' }
    if (!a && k.flaeche && b) { a = k.flaeche / b; steps.push(`a aus Fl\u00E4che:\na = A / b = ${fmt(k.flaeche)} / ${fmt(b)} = ${fmt(a)}`) }
    if (!b && k.flaeche && a) { b = k.flaeche / a; steps.push(`b aus Fl\u00E4che:\nb = A / a = ${fmt(k.flaeche)} / ${fmt(a)} = ${fmt(b)}`) }
    if (!a && k.diagonale && b) { a = Math.sqrt(k.diagonale ** 2 - b ** 2); steps.push(`a aus Diagonale:\na = \u221A(d\u00B2 \u2212 b\u00B2) = \u221A(${fmt(k.diagonale)}\u00B2 \u2212 ${fmt(b)}\u00B2) = ${fmt(a)}`) }
    if (!b && k.diagonale && a) { b = Math.sqrt(k.diagonale ** 2 - a ** 2); steps.push(`b aus Diagonale:\nb = \u221A(d\u00B2 \u2212 a\u00B2) = ${fmt(b)}`) }
    if (!a && k.umfang && b) { a = k.umfang / 2 - b; steps.push(`a aus Umfang:\na = U/2 \u2212 b = ${fmt(k.umfang)}/2 \u2212 ${fmt(b)} = ${fmt(a)}`) }
    if (!b && k.umfang && a) { b = k.umfang / 2 - a; steps.push(`b aus Umfang:\nb = U/2 \u2212 a = ${fmt(k.umfang)}/2 \u2212 ${fmt(a)} = ${fmt(b)}`) }
    if (!a || !b) return { solutions: [], error: 'Nicht genug Werte f\u00FCr eindeutige L\u00F6sung' }
    const d = Math.sqrt(a * a + b * b)
    const flaeche = a * b
    const umfang = 2 * (a + b)

    if (steps.length === 0) {
      steps.push(`Gegeben: a = ${fmt(a)}, b = ${fmt(b)}`)
    }
    steps.push(`Fl\u00E4che:\nA = a \u00B7 b = ${fmt(a)} \u00B7 ${fmt(b)} = ${fmt(flaeche)}`)
    steps.push(`Umfang:\nU = 2 \u00B7 (a + b) = 2 \u00B7 (${fmt(a)} + ${fmt(b)}) = ${fmt(umfang)}`)
    steps.push(`Diagonale:\nd = \u221A(a\u00B2 + b\u00B2) = \u221A(${fmt(a)}\u00B2 + ${fmt(b)}\u00B2) = ${fmt(d)}`)

    return { solutions: [{
      values: { a, b, flaeche, umfang, diagonale: d },
      method: 'Rechteck-Formeln',
      formulas: ['A = a \u00B7 b', 'U = 2(a + b)', 'd = \u221A(a\u00B2 + b\u00B2)'],
      steps,
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
