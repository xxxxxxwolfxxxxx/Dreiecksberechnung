import { parallelogramm } from '@/lib/shapes/parallelogramm'
test('Parallelogramm: a, b, alpha → Fläche', () => {
  const r = parallelogramm.solve({ a: 5, b: 4, alpha: 90 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(20)
})
