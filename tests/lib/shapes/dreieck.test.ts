import { dreieck } from '@/lib/shapes/dreieck'

describe('Dreieck Solver', () => {
  // SSS
  test('SSS: 3-4-5 Dreieck gibt korrekten Winkel', () => {
    const r = dreieck.solve({ a: 3, b: 4, c: 5 })
    expect(r.solutions).toHaveLength(1)
    expect(r.solutions[0].values.gamma).toBeCloseTo(90, 1)
    expect(r.solutions[0].method).toContain('SSS')
  })

  // SWS
  test('SWS: 2 Seiten + eingeschlossener Winkel', () => {
    const r = dreieck.solve({ a: 3, b: 4, gamma: 90 })
    expect(r.solutions[0].values.c).toBeCloseTo(5, 2)
  })

  // WSW
  test('WSW: 2 Winkel + Seite', () => {
    const r = dreieck.solve({ alpha: 60, beta: 60, c: 5 })
    expect(r.solutions[0].values.gamma).toBeCloseTo(60, 1)
    expect(r.solutions[0].values.a).toBeCloseTo(5, 2)
  })

  // WWS
  test('WWS: 2 Winkel + nicht-eingeschlossene Seite', () => {
    const r = dreieck.solve({ alpha: 30, beta: 60, a: 3 })
    expect(r.solutions[0].values.c).toBeCloseTo(6, 1)
  })

  // SSW — 1 Lösung
  test('SSW: eindeutige Lösung', () => {
    const r = dreieck.solve({ a: 5, b: 7, alpha: 30 })
    expect(r.solutions.length).toBeGreaterThanOrEqual(1)
  })

  // SSW — 2 Lösungen
  test('SSW: zwei Lösungen (ambiguous case)', () => {
    const r = dreieck.solve({ a: 5, b: 8, alpha: 30 })
    expect(r.solutions).toHaveLength(2)
  })

  // SSW — 0 Lösungen
  test('SSW: kein Dreieck möglich', () => {
    const r = dreieck.solve({ a: 1, b: 10, alpha: 60 })
    expect(r.error).toBeTruthy()
    expect(r.solutions).toHaveLength(0)
  })

  // Dreiecksungleichung
  test('Ungültige Seiten liefern Fehler', () => {
    const r = dreieck.solve({ a: 1, b: 2, c: 10 })
    expect(r.error).toBeTruthy()
  })

  // Fläche
  test('Lösung enthält Fläche und Umfang', () => {
    const r = dreieck.solve({ a: 3, b: 4, c: 5 })
    expect(r.solutions[0].values.flaeche).toBeCloseTo(6, 2)
    expect(r.solutions[0].values.umfang).toBeCloseTo(12, 2)
  })

  // Alle Ausgabewerte vorhanden
  test('Vollständige Ausgabe: Höhen, Radien, Typ', () => {
    const v = dreieck.solve({ a: 3, b: 4, c: 5 }).solutions[0].values
    expect(v.h_a).toBeDefined()
    expect(v.h_b).toBeDefined()
    expect(v.h_c).toBeDefined()
    expect(v.inkreis).toBeDefined()
    expect(v.umkreis).toBeDefined()
    expect(v.typ).toBeDefined()
  })
})
