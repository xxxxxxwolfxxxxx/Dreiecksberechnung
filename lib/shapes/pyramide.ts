import type { Shape } from './types'
import { formatNumber } from '../format'

const fmt = formatNumber

export const pyramide: Shape = {
  id: 'pyramide',
  label: 'Pyramide',
  minRequired: 2,
  defaultValues: { a: 6, h: 8 },
  inputs: [
    { key: 'a', label: 'Grundkante a', unit: 'length' },
    { key: 'h', label: 'H\u00F6he h', unit: 'length' },
  ],
  solve(k) {
    const { a, h } = k
    if (!a || !h) return { solutions: [], error: 'Grundkante a und H\u00F6he h werden ben\u00F6tigt' }

    const apothema = Math.sqrt((a / 2) ** 2 + h ** 2)
    const grundflaeche = a ** 2
    const mantelflaeche = 2 * a * apothema
    const oberflaeche = a ** 2 + 2 * a * apothema
    const volumen = (1 / 3) * a ** 2 * h

    const steps: string[] = [
      `Gegeben: a = ${fmt(a)}, h = ${fmt(h)}`,
      `Apothema (H\u00F6he der Dreieckfl\u00E4che):\nap = \u221A((a/2)\u00B2 + h\u00B2)\n= \u221A((${fmt(a)}/2)\u00B2 + ${fmt(h)}\u00B2)\n= \u221A(${fmt((a / 2) ** 2)} + ${fmt(h ** 2)})\n= \u221A${fmt((a / 2) ** 2 + h ** 2)}\n\u2248 ${fmt(apothema)}`,
      `Grundfl\u00E4che:\nG = a\u00B2 = ${fmt(a)}\u00B2 = ${fmt(grundflaeche)}`,
      `Mantelfl\u00E4che:\nM = 2 \u00B7 a \u00B7 ap\n= 2 \u00B7 ${fmt(a)} \u00B7 ${fmt(apothema)}\n\u2248 ${fmt(mantelflaeche)}`,
      `Oberfl\u00E4che:\nA = a\u00B2 + 2 \u00B7 a \u00B7 ap\n= ${fmt(grundflaeche)} + 2 \u00B7 ${fmt(a)} \u00B7 ${fmt(apothema)}\n= ${fmt(grundflaeche)} + ${fmt(mantelflaeche)}\n\u2248 ${fmt(oberflaeche)}`,
      `Volumen:\nV = \u2153 \u00B7 a\u00B2 \u00B7 h\n= \u2153 \u00B7 ${fmt(a)}\u00B2 \u00B7 ${fmt(h)}\n= \u2153 \u00B7 ${fmt(grundflaeche)} \u00B7 ${fmt(h)}\n\u2248 ${fmt(volumen)}`,
    ]

    return {
      solutions: [{
        values: { a, h, apothema, grundflaeche, mantelflaeche, oberflaeche, volumen },
        method: 'Pyramiden-Formeln',
        formulas: [
          'ap = \u221A((a/2)\u00B2 + h\u00B2)',
          'G = a\u00B2',
          'M = 2 \u00B7 a \u00B7 ap',
          'A = a\u00B2 + 2 \u00B7 a \u00B7 ap',
          'V = \u2153 \u00B7 a\u00B2 \u00B7 h',
        ],
        steps,
      }],
    }
  },
  toSVG(v, size) {
    const { a, h } = v
    const cos30 = Math.cos(Math.PI / 6)
    const sin30 = Math.sin(Math.PI / 6)
    const depth = 0.4

    // Berechnung in Einheiten (unscaled), dann skalieren
    const sa_u = a
    const dx_u = a * cos30 * depth
    const dy_u = a * sin30 * depth
    const h_u = h

    // Gesamtbreite = sa + dx, Gesamthöhe = sa (vertikal-Anteil Grundfläche) + dy + h
    const totalW = sa_u + dx_u
    const totalH = sa_u + dy_u + h_u

    const scale = Math.min((size * 0.75) / totalW, (size * 0.80) / totalH)

    const sa = a * scale
    const dx = a * cos30 * depth * scale
    const dy = a * sin30 * depth * scale
    const h_svg = h * scale

    const startX = (size - (sa + dx)) / 2
    const startY = (size - (sa + dy + h_svg)) / 2

    // Grundfläche Eckpunkte
    // 0: A vorne-links
    // 1: B vorne-rechts
    // 2: C hinten-rechts
    // 3: D hinten-links
    // 4: S Spitze
    const pts = [
      { x: startX,            y: startY + h_svg + dy,      label: '' }, // 0: A vorne-links
      { x: startX + sa,       y: startY + h_svg + dy,      label: '' }, // 1: B vorne-rechts
      { x: startX + sa + dx,  y: startY + h_svg,           label: '' }, // 2: C hinten-rechts
      { x: startX + dx,       y: startY + h_svg,           label: '' }, // 3: D hinten-links
      { x: startX + sa / 2 + dx / 2, y: startY,           label: 'S' }, // 4: Spitze
      // Mittelpunkt Grundfläche für Höhenlinie
      { x: startX + sa / 2 + dx / 2, y: startY + h_svg + dy / 2, label: '' }, // 5: Mitte Grundfläche
    ]

    return {
      points: pts,
      lines: [
        // Grundfläche
        { from: 0, to: 1, label: 'a' },
        { from: 1, to: 2 },
        { from: 2, to: 3, dashed: true },
        { from: 3, to: 0 },
        // Kanten zur Spitze
        { from: 0, to: 4 },
        { from: 1, to: 4 },
        { from: 2, to: 4, dashed: true },
        { from: 3, to: 4, dashed: true },
        // Höhenlinie vom Grundflächenmittelpunkt zur Spitze
        { from: 5, to: 4, label: 'h', dashed: true },
      ],
      width: size,
      height: size,
    }
  },
}
