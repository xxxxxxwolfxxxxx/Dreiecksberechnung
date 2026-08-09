import { werteAusQuery, einheitAusQuery } from '@/lib/rechner-query'
import { shapes } from '@/lib/shapes'

const dreieck = shapes.dreieck
const kreis = shapes.kreis
const parallelogramm = shapes.parallelogramm

function query(such: string): URLSearchParams {
  return new URLSearchParams(such)
}

describe('werteAusQuery – direkte Feldparameter', () => {
  test('übernimmt Seitenlängen aus einzelnen Parametern', () => {
    const werte = werteAusQuery(dreieck, query('a=3&b=4&c=5'))

    expect(werte).toEqual({ a: 3, b: 4, c: 5 })
  })

  test('akzeptiert Dezimalzahlen mit Punkt und mit Komma', () => {
    const werte = werteAusQuery(dreieck, query('a=3.5&b=4,25'))

    expect(werte).toEqual({ a: 3.5, b: 4.25 })
  })

  test('ignoriert Parameter, die kein Eingabefeld der Form sind', () => {
    const werte = werteAusQuery(kreis, query('r=5&utm_source=google&xyz=9'))

    expect(werte).toEqual({ r: 5 })
  })

  test('ignoriert nicht-numerische Werte', () => {
    const werte = werteAusQuery(kreis, query('r=abc'))

    expect(werte).toEqual({})
  })

  test('ignoriert negative und unsinnige Größen', () => {
    const werte = werteAusQuery(kreis, query('r=-5'))

    expect(werte).toEqual({})
  })

  test('liefert ein leeres Objekt ohne passende Parameter', () => {
    const werte = werteAusQuery(dreieck, query(''))

    expect(werte).toEqual({})
  })
})

describe('werteAusQuery – freier Ausdruck im q-Parameter', () => {
  test('liest Wertepaare aus einem Fließtext', () => {
    const werte = werteAusQuery(dreieck, query('q=Dreieck a=3 b=4 c=5'))

    expect(werte).toEqual({ a: 3, b: 4, c: 5 })
  })

  test('trennt Komma-Listen korrekt von Dezimalkommas', () => {
    const werte = werteAusQuery(dreieck, query('q=a=3,b=4,c=5'))

    expect(werte).toEqual({ a: 3, b: 4, c: 5 })
  })

  test('erkennt ein Dezimalkomma innerhalb einer Komma-Liste', () => {
    const werte = werteAusQuery(dreieck, query('q=a=3,5, b=4'))

    expect(werte).toEqual({ a: 3.5, b: 4 })
  })

  test('akzeptiert Doppelpunkt als Zuweisung', () => {
    const werte = werteAusQuery(kreis, query('q=Radius: 7'))

    expect(werte).toEqual({ r: 7 })
  })

  test('löst griechische Winkelbuchstaben auf', () => {
    const werte = werteAusQuery(dreieck, query('q=a=3 α=40 β=60'))

    expect(werte).toEqual({ a: 3, alpha: 40, beta: 60 })
  })

  test('löst deutsche Feldnamen auf', () => {
    const werte = werteAusQuery(kreis, query('q=Durchmesser=10'))

    expect(werte).toEqual({ d: 10 })
  })

  test('erkennt Höhen mit Unterstrich und ohne', () => {
    const werte = werteAusQuery(dreieck, query('q=a=3 ha=4'))

    expect(werte).toEqual({ a: 3, h_a: 4 })
  })

  test('ordnet gleichnamige Felder der jeweiligen Form zu', () => {
    const werte = werteAusQuery(parallelogramm, query('q=a=5 b=3 alpha=60'))

    expect(werte).toEqual({ a: 5, b: 3, alpha: 60 })
  })

  test('ignoriert einen Ausdruck ohne verwertbare Zuweisungen', () => {
    const werte = werteAusQuery(dreieck, query('q=x^2 + 3x - 4 = 0'))

    expect(werte).toEqual({})
  })

  test('ignoriert Winkelwerte ausserhalb des gueltigen Bereichs', () => {
    const werte = werteAusQuery(dreieck, query('q=a=3 alpha=200'))

    expect(werte).toEqual({ a: 3 })
  })

  test('direkte Parameter haben Vorrang vor dem q-Ausdruck', () => {
    const werte = werteAusQuery(dreieck, query('a=9&q=a=3 b=4'))

    expect(werte).toEqual({ a: 9, b: 4 })
  })
})

describe('einheitAusQuery', () => {
  test('übernimmt eine unterstützte Einheit', () => {
    expect(einheitAusQuery(query('einheit=m'))).toBe('m')
  })

  test('ignoriert eine unbekannte Einheit', () => {
    expect(einheitAusQuery(query('einheit=parsec'))).toBeUndefined()
  })

  test('liefert undefined ohne Angabe', () => {
    expect(einheitAusQuery(query('a=3'))).toBeUndefined()
  })
})
