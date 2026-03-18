import { raute } from '@/lib/shapes/raute'
test('Raute: a, alpha → Fläche', () => {
  const r = raute.solve({ a: 5, alpha: 90 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(25)
})
