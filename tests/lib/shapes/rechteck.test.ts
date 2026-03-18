import { rechteck } from '@/lib/shapes/rechteck'
test('Rechteck: a + b', () => {
  const r = rechteck.solve({ a: 4, b: 3 })
  expect(r.solutions[0].values.flaeche).toBeCloseTo(12)
  expect(r.solutions[0].values.diagonale).toBeCloseTo(5, 1)
})
test('Rechteck: Fläche + a → b', () => {
  const r = rechteck.solve({ flaeche: 12, a: 4 })
  expect(r.solutions[0].values.b).toBeCloseTo(3)
})
