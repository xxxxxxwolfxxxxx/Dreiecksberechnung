import { kreis } from '@/lib/shapes/kreis'
test('Kreis: Radius → Fläche', () => {
  const r = kreis.solve({ r: 5 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(78.54, 1)
  expect(r.solutions[0].values.umfang).toBeCloseTo(31.42, 1)
})
test('Kreis: Fläche → Radius', () => {
  const r = kreis.solve({ flaeche: 78.54 })
  expect(r.solutions[0].values.r).toBeCloseTo(5, 1)
})
test('Kreis: Umfang → Radius', () => {
  const r = kreis.solve({ umfang: 31.416 })
  expect(r.solutions[0].values.r).toBeCloseTo(5, 1)
})
