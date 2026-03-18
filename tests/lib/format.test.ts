import { formatNumber, formatUnit } from '@/lib/format'

test('formatNumber formatiert mit deutschem Komma', () => {
  expect(formatNumber(3.14159)).toBe('3,1416')
})
test('formatNumber ganze Zahlen ohne Dezimalstellen', () => {
  expect(formatNumber(5)).toBe('5')
})
test('formatUnit hängt Einheit an', () => {
  expect(formatUnit(12.5, 'cm')).toBe('12,5 cm')
})
test('formatUnit für Fläche', () => {
  expect(formatUnit(12.5, 'cm', 2)).toBe('12,5 cm²')
})
