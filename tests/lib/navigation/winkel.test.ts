import {
  GRAD_PRO_STRICH,
  cosGrad,
  gradInStrich,
  normalisiereRichtung,
  sinGrad,
  strichInGrad,
  winkelDifferenz,
} from '@/lib/navigation/winkel'

test('Ein Strich sind 11,25 Grad', () => {
  expect(GRAD_PRO_STRICH).toBeCloseTo(11.25, 10)
  expect(strichInGrad(4)).toBeCloseTo(45, 10)
  expect(gradInStrich(90)).toBeCloseTo(8, 10)
})

test('normalisiereRichtung bringt Werte in den Bereich 0 bis 360', () => {
  expect(normalisiereRichtung(370)).toBeCloseTo(10, 10)
  expect(normalisiereRichtung(-10)).toBeCloseTo(350, 10)
  expect(normalisiereRichtung(360)).toBeCloseTo(0, 10)
  expect(normalisiereRichtung(180)).toBeCloseTo(180, 10)
})

test('winkelDifferenz nimmt immer den kleineren Winkel', () => {
  expect(winkelDifferenz(350, 10)).toBeCloseTo(20, 10)
  expect(winkelDifferenz(10, 350)).toBeCloseTo(20, 10)
  expect(winkelDifferenz(0, 180)).toBeCloseTo(180, 10)
  expect(winkelDifferenz(45, 315)).toBeCloseTo(90, 10)
  expect(winkelDifferenz(120, 120)).toBeCloseTo(0, 10)
})

test('sinGrad und cosGrad rechnen in Grad, nicht in Radiant', () => {
  expect(sinGrad(90)).toBeCloseTo(1, 10)
  expect(sinGrad(30)).toBeCloseTo(0.5, 10)
  expect(cosGrad(60)).toBeCloseTo(0.5, 10)
  expect(cosGrad(90)).toBeCloseTo(0, 10)
})
