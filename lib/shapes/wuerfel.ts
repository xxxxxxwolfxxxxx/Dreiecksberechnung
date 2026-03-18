import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const wuerfel: Shape = {
  id: 'wuerfel',
  label: 'W\u00FCrfel',
  minRequired: 1,
  defaultValues: { a: 5 },
  inputs: [
    { key: 'a', label: 'Kantenl\u00E4nge a', unit: 'length' },
  ],
  solve(k) {
    const a = k.a
    if (!a) return { solutions: [], error: 'Kantenl\u00E4nge a wird ben\u00F6tigt' }

    const volumen = a ** 3
    const oberflaeche = 6 * a ** 2
    const raumdiagonale = a * Math.sqrt(3)
    const flaechendiagonale = a * Math.sqrt(2)

    const steps: string[] = [
      `Gegeben: a = ${fmt(a)}`,
      `Volumen:\nV = a\u00B3 = ${fmt(a)}\u00B3 = ${fmt(volumen)}`,
      `Oberfl\u00E4che:\nA = 6 \u00B7 a\u00B2 = 6 \u00B7 ${fmt(a)}\u00B2 = 6 \u00B7 ${fmt(a ** 2)} = ${fmt(oberflaeche)}`,
      `Raumdiagonale:\nd = a \u00B7 \u221A3 = ${fmt(a)} \u00B7 \u221A3 \u2248 ${fmt(raumdiagonale)}`,
      `Fl\u00E4chendiagonale:\nfd = a \u00B7 \u221A2 = ${fmt(a)} \u00B7 \u221A2 \u2248 ${fmt(flaechendiagonale)}`,
    ]

    return {
      solutions: [{
        values: { a, volumen, oberflaeche, raumdiagonale, flaechendiagonale },
        method: 'W\u00FCrfel-Formeln',
        formulas: [
          'V = a\u00B3',
          'A = 6 \u00B7 a\u00B2',
          'd = a \u00B7 \u221A3',
          'fd = a \u00B7 \u221A2',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    const a = v.a
    const maxDim = size * 0.72

    // Oblique-Projektion, Winkel 30°, Tiefenfaktor 0.45
    const cos30 = Math.cos(Math.PI / 6)
    const sin30 = Math.sin(Math.PI / 6)
    const depth = 0.45

    // Skalierung so dass alles passt
    // Gesamtbreite = sa + dx, Gesamthöhe = sb + dy
    // dx = a*cos30*depth*scale, dy = a*sin30*depth*scale
    // sa = sb = a*scale
    const scale = maxDim / (a * (1 + cos30 * depth))

    const sa = a * scale
    const sb = a * scale
    const dx = a * cos30 * depth * scale
    const dy = a * sin30 * depth * scale

    const startX = (size - (sa + dx)) / 2
    const startY = (size - (sb + dy)) / 2

    const pts = [
      { x: startX,        y: startY + dy + sb, label: '' }, // 0: A vorne-unten-links
      { x: startX + sa,   y: startY + dy + sb, label: '' }, // 1: B vorne-unten-rechts
      { x: startX + sa,   y: startY + dy,      label: '' }, // 2: C vorne-oben-rechts
      { x: startX,        y: startY + dy,      label: '' }, // 3: D vorne-oben-links
      { x: startX + dx,        y: startY + sb,      label: '' }, // 4: E hinten-unten-links (versteckt)
      { x: startX + sa + dx,   y: startY + sb,      label: '' }, // 5: F hinten-unten-rechts
      { x: startX + sa + dx,   y: startY,           label: '' }, // 6: G hinten-oben-rechts
      { x: startX + dx,        y: startY,           label: '' }, // 7: H hinten-oben-links
    ]

    return {
      points: pts,
      lines: [
        // Sichtbare Vorderfläche
        { from: 0, to: 1, label: 'a' },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
        // Sichtbare Oberfläche und Seiten
        { from: 3, to: 7 },
        { from: 7, to: 6 },
        { from: 6, to: 2 },
        // Sichtbare rechte Seite unten
        { from: 1, to: 5 },
        { from: 5, to: 6 },
        // Versteckte Kanten
        { from: 0, to: 4, dashed: true },
        { from: 4, to: 5, dashed: true },
        { from: 4, to: 7, dashed: true },
      ],
      width: size,
      height: size,
    }
  },
}
