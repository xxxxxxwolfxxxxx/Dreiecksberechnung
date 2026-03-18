import type { Shape } from './types'

export const kreis: Shape = {
  id: 'kreis', label: 'Kreis', minRequired: 1,
  inputs: [
    { key: 'r',      label: 'Radius r',      unit: 'length' },
    { key: 'd',      label: 'Durchmesser d', unit: 'length' },
    { key: 'umfang', label: 'Umfang U',      unit: 'length' },
    { key: 'flaeche',label: 'Fläche A',      unit: 'area'   },
  ],
  solve(k) {
    let r: number | undefined
    if (k.r)       r = k.r
    else if (k.d)  r = k.d / 2
    else if (k.umfang)  r = k.umfang / (2 * Math.PI)
    else if (k.flaeche) r = Math.sqrt(k.flaeche / Math.PI)
    if (!r || r <= 0) return { solutions: [], error: 'Bitte einen Wert eingeben' }
    return { solutions: [{
      values: { r, d: 2*r, umfang: 2*Math.PI*r, flaeche: Math.PI*r*r },
      method: 'Kreisformeln',
      formulas: ['U = 2πr', 'A = πr²'],
    }] }
  },
  toSVG(values, size) {
    const cx = size / 2, cy = size / 2
    const r = (size * 0.4)
    return {
      points: [{ x: cx + r, y: cy, label: 'r' }],
      lines: [{ from: 0, to: 0, label: `r = ${values.r}` }],
      width: size, height: size,
    }
  },
}
