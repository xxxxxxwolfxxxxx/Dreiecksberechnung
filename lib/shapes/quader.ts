import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const quader: Shape = {
  id: 'quader',
  label: 'Quader',
  minRequired: 3,
  defaultValues: { a: 6, b: 4, c: 3 },
  inputs: [
    { key: 'a', label: 'L\u00E4nge a', unit: 'length' },
    { key: 'b', label: 'Breite b', unit: 'length' },
    { key: 'c', label: 'H\u00F6he c', unit: 'length' },
  ],
  solve(k) {
    const { a, b, c } = k
    if (!a || !b || !c) return { solutions: [], error: 'Alle drei Ma\u00DFe (L\u00E4nge, Breite, H\u00F6he) werden ben\u00F6tigt' }

    const volumen = a * b * c
    const oberflaeche = 2 * (a * b + b * c + a * c)
    const raumdiagonale = Math.sqrt(a ** 2 + b ** 2 + c ** 2)

    const steps: string[] = [
      `Gegeben: a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`,
      `Volumen:\nV = a \u00B7 b \u00B7 c = ${fmt(a)} \u00B7 ${fmt(b)} \u00B7 ${fmt(c)} = ${fmt(volumen)}`,
      `Oberfl\u00E4che:\nA = 2 \u00B7 (a\u00B7b + b\u00B7c + a\u00B7c)\n= 2 \u00B7 (${fmt(a)}\u00B7${fmt(b)} + ${fmt(b)}\u00B7${fmt(c)} + ${fmt(a)}\u00B7${fmt(c)})\n= 2 \u00B7 (${fmt(a * b)} + ${fmt(b * c)} + ${fmt(a * c)})\n= ${fmt(oberflaeche)}`,
      `Raumdiagonale:\nd = \u221A(a\u00B2 + b\u00B2 + c\u00B2)\n= \u221A(${fmt(a)}\u00B2 + ${fmt(b)}\u00B2 + ${fmt(c)}\u00B2)\n= \u221A(${fmt(a ** 2)} + ${fmt(b ** 2)} + ${fmt(c ** 2)})\n= \u221A${fmt(a ** 2 + b ** 2 + c ** 2)}\n\u2248 ${fmt(raumdiagonale)}`,
    ]

    return {
      solutions: [{
        values: { a, b, c, volumen, oberflaeche, raumdiagonale },
        method: 'Quader-Formeln',
        formulas: [
          'V = a \u00B7 b \u00B7 c',
          'A = 2(ab + bc + ac)',
          'd = \u221A(a\u00B2 + b\u00B2 + c\u00B2)',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    // a = Breite (front horizontal), b = Höhe (front vertikal), c = Tiefe
    const { a, b, c } = v
    const cos30 = Math.cos(Math.PI / 6)
    const sin30 = Math.sin(Math.PI / 6)
    const depth = 0.45

    // Einheitsvektoren für Gesamtgröße
    // Breite gesamt = sa + dx, Höhe gesamt = sb + dy
    const scaleW = (size * 0.72) / (a + c * cos30 * depth)
    const scaleH = (size * 0.72) / (b + c * sin30 * depth)
    const scale = Math.min(scaleW, scaleH)

    const sa = a * scale       // Front-Breite
    const sb = b * scale       // Front-Höhe
    const dx = c * cos30 * depth * scale  // Tiefenversatz X
    const dy = c * sin30 * depth * scale  // Tiefenversatz Y

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
        // Vorderfläche
        { from: 0, to: 1, label: 'a' },
        { from: 1, to: 2, label: 'b' },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
        // Oberfläche und Seiten sichtbar
        { from: 3, to: 7 },
        { from: 7, to: 6 },
        { from: 6, to: 2 },
        // Rechte Seite unten sichtbar
        { from: 1, to: 5, label: 'c' },
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
