import { trapez } from '@/lib/shapes/trapez'
test('Trapez: a, c, h → Fläche', () => {
  const r = trapez.solve({ a: 6, c: 4, h: 3 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(15)
})
