import {
  berechneVersegelungspeilung,
  distanzAusFahrt,
  type VersegelungEingabe,
} from '@/lib/navigation/versegelungspeilung'

function ergebnisVon(eingabe: VersegelungEingabe) {
  const ausgabe = berechneVersegelungspeilung(eingabe)
  if (!ausgabe.ok) throw new Error(`Unerwarteter Fehler: ${ausgabe.fehler}`)
  return ausgabe.ergebnis
}

test('Vier-Strich-Peilung: Querabstand gleich gefahrene Distanz', () => {
  const ergebnis = ergebnisVon({ peilung1: 45, peilung2: 90, distanz: 2 })

  expect(ergebnis.winkelObjekt).toBeCloseTo(45, 6)
  expect(ergebnis.entfernung2).toBeCloseTo(2, 6)
  expect(ergebnis.querabstand).toBeCloseTo(2, 6)
  expect(ergebnis.entfernung1).toBeCloseTo(2 * Math.SQRT2, 6)
  expect(ergebnis.restweg).toBeCloseTo(0, 6)
  expect(ergebnis.warnungen).toEqual([])
  expect(ergebnis.hinweise.join(' ')).toMatch(/Vier-Strich-Peilung/)
})

test('Verdopplung der Seitenpeilung: Entfernung gleich gefahrene Distanz', () => {
  const ergebnis = ergebnisVon({ peilung1: 30, peilung2: 60, distanz: 3 })

  expect(ergebnis.entfernung2).toBeCloseTo(3, 6)
  expect(ergebnis.entfernung1).toBeCloseTo((3 * Math.sin((60 * Math.PI) / 180)) / 0.5, 6)
  expect(ergebnis.querabstand).toBeCloseTo(3 * Math.sin((60 * Math.PI) / 180), 6)
  expect(ergebnis.hinweise.join(' ')).toMatch(/Verdopplung/)
})

test('Rückrechnung aus echter Geometrie: Querabstand und Entfernungen stimmen', () => {
  // Kurs nach Ost, Objekt 1,5 sm nördlich der Kurslinie.
  // Erste Peilung an der Position 0, zweite nach 2,5 sm.
  const querab = 1.5
  const gefahren = 2.5
  const objektVoraus = 4 // Längsabstand des Objekts bei der ersten Peilung
  const grad = (bogen: number) => (bogen * 180) / Math.PI

  const peilung1 = grad(Math.atan2(querab, objektVoraus))
  const peilung2 = grad(Math.atan2(querab, objektVoraus - gefahren))
  const ergebnis = ergebnisVon({ peilung1, peilung2, distanz: gefahren })

  expect(ergebnis.querabstand).toBeCloseTo(querab, 6)
  expect(ergebnis.entfernung1).toBeCloseTo(Math.hypot(querab, objektVoraus), 6)
  expect(ergebnis.entfernung2).toBeCloseTo(Math.hypot(querab, objektVoraus - gefahren), 6)
  expect(ergebnis.restweg).toBeCloseTo(objektVoraus - gefahren, 6)
})

test('Zweite Peilung achterlicher als querab: Restweg wird negativ', () => {
  const ergebnis = ergebnisVon({ peilung1: 60, peilung2: 120, distanz: 1 })

  expect(ergebnis.restweg).toBeLessThan(0)
  expect(ergebnis.querabstand).toBeGreaterThan(0)
})

test('Kleine Peilungsdifferenz wird als unsicher gemeldet', () => {
  const ergebnis = ergebnisVon({ peilung1: 40, peilung2: 50, distanz: 1 })

  expect(ergebnis.warnungen.join(' ')).toMatch(/auseinander/)
})

test('Objekt fast voraus wird als unsicher gemeldet', () => {
  const ergebnis = ergebnisVon({ peilung1: 5, peilung2: 90, distanz: 1 })

  expect(ergebnis.warnungen.join(' ')).toMatch(/voraus/)
})

test('Hinweis auf Strom und gleichbleibenden Kurs steht immer dabei', () => {
  const ergebnis = ergebnisVon({ peilung1: 45, peilung2: 90, distanz: 2 })

  expect(ergebnis.hinweise[0]).toMatch(/Strom/)
})

test('Zweite Peilung nicht größer als die erste → Fehler', () => {
  for (const peilung2 of [45, 30]) {
    const ausgabe = berechneVersegelungspeilung({ peilung1: 45, peilung2, distanz: 2 })
    expect(ausgabe.ok).toBe(false)
    if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/größer/)
  }
})

test('Distanz von 0 oder negativ → Fehler', () => {
  for (const distanz of [0, -1]) {
    const ausgabe = berechneVersegelungspeilung({ peilung1: 45, peilung2: 90, distanz })
    expect(ausgabe.ok).toBe(false)
    if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/Distanz/)
  }
})

test('Seitenpeilung 0° oder über 180° → Fehler', () => {
  for (const eingabe of [
    { peilung1: 0, peilung2: 90, distanz: 1 },
    { peilung1: 45, peilung2: 190, distanz: 1 },
    { peilung1: 180, peilung2: 200, distanz: 1 },
  ]) {
    expect(berechneVersegelungspeilung(eingabe).ok).toBe(false)
  }
})

test('Fehlende Eingaben werden abgelehnt', () => {
  const ausgabe = berechneVersegelungspeilung({ peilung1: 45, peilung2: 90, distanz: NaN })
  expect(ausgabe.ok).toBe(false)
  if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/eingeben/)
})

test('distanzAusFahrt: 6 kn über 20 Minuten sind 2 sm', () => {
  expect(distanzAusFahrt(6, 20)).toBeCloseTo(2, 10)
  expect(distanzAusFahrt(4.5, 40)).toBeCloseTo(3, 10)
})

test('distanzAusFahrt lehnt unbrauchbare Werte ab', () => {
  expect(distanzAusFahrt(0, 20)).toBeUndefined()
  expect(distanzAusFahrt(6, 0)).toBeUndefined()
  expect(distanzAusFahrt(-6, 20)).toBeUndefined()
  expect(distanzAusFahrt(NaN, 20)).toBeUndefined()
})

test('Lösungsweg nennt den Sinussatz und alle Zwischenschritte', () => {
  const ergebnis = ergebnisVon({ peilung1: 45, peilung2: 90, distanz: 2 })

  expect(ergebnis.methode).toMatch(/Sinussatz/)
  expect(ergebnis.schritte).toHaveLength(6)
  expect(ergebnis.formeln.length).toBeGreaterThan(0)
})
