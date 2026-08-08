import {
  ANGENOMMENER_PEILFEHLER_GRAD,
  berechneKreuzpeilung,
  type KreuzpeilungEingabe,
} from '@/lib/navigation/kreuzpeilung'

interface Punkt {
  /** Ost-Koordinate (x) in Seemeilen. */
  ost: number
  /** Nord-Koordinate (y) in Seemeilen. */
  nord: number
}

/** Rechtweisende Peilung von einem Punkt zum anderen, 0° = Nord. */
function peilung(von: Punkt, zu: Punkt): number {
  const grad = (Math.atan2(zu.ost - von.ost, zu.nord - von.nord) * 180) / Math.PI
  return (grad + 360) % 360
}

function abstand(von: Punkt, zu: Punkt): number {
  return Math.hypot(zu.ost - von.ost, zu.nord - von.nord)
}

/** Baut aus einer echten Geometrie die Eingaben, die an Bord gemessen würden. */
function eingabeAus(boot: Punkt, objektA: Punkt, objektB: Punkt): KreuzpeilungEingabe {
  return {
    peilungA: peilung(boot, objektA),
    peilungB: peilung(boot, objektB),
    basisrichtung: peilung(objektA, objektB),
    basislaenge: abstand(objektA, objektB),
  }
}

function ergebnisVon(eingabe: KreuzpeilungEingabe) {
  const ausgabe = berechneKreuzpeilung(eingabe)
  if (!ausgabe.ok) throw new Error(`Unerwarteter Fehler: ${ausgabe.fehler}`)
  return ausgabe.ergebnis
}

test('Lehrbuchfall: Basis nach Ost, Boot mittig davor unter 90°', () => {
  // A = (0|0), B = (1|0), Boot 0,5 sm südlich der Basismitte
  const ergebnis = ergebnisVon({
    peilungA: 315,
    peilungB: 45,
    basisrichtung: 90,
    basislaenge: 1,
  })

  expect(ergebnis.schnittwinkel).toBeCloseTo(90, 6)
  expect(ergebnis.winkelA).toBeCloseTo(45, 6)
  expect(ergebnis.winkelB).toBeCloseTo(45, 6)
  expect(ergebnis.entfernungA).toBeCloseTo(Math.SQRT1_2, 6)
  expect(ergebnis.entfernungB).toBeCloseTo(Math.SQRT1_2, 6)
  expect(ergebnis.abstandBasislinie).toBeCloseTo(0.5, 6)
  expect(ergebnis.warnungen).toEqual([])
})

test('Rückrechnung aus echter Geometrie: Entfernungen stimmen mit den Koordinaten', () => {
  const boot: Punkt = { ost: 0, nord: 0 }
  const objektA: Punkt = { ost: -2, nord: 5 }
  const objektB: Punkt = { ost: 4, nord: 3 }

  const ergebnis = ergebnisVon(eingabeAus(boot, objektA, objektB))

  expect(ergebnis.entfernungA).toBeCloseTo(abstand(boot, objektA), 6)
  expect(ergebnis.entfernungB).toBeCloseTo(abstand(boot, objektB), 6)
})

test('Rückrechnung funktioniert auch über den Nord-Sprung (359°/001°) hinweg', () => {
  const boot: Punkt = { ost: 0, nord: 0 }
  const objektA: Punkt = { ost: -0.1, nord: 6 } // knapp westlich von Nord
  const objektB: Punkt = { ost: 3, nord: 1 }

  const ergebnis = ergebnisVon(eingabeAus(boot, objektA, objektB))

  expect(ergebnis.entfernungA).toBeCloseTo(abstand(boot, objektA), 6)
  expect(ergebnis.entfernungB).toBeCloseTo(abstand(boot, objektB), 6)
})

test('Abstand zur Basislinie ist der senkrechte Abstand', () => {
  // Basis von A = (0|0) nach B = (0|4), also genau nach Nord.
  // Boot 3 sm östlich der Basismitte → senkrechter Abstand 3 sm.
  const boot: Punkt = { ost: 3, nord: 2 }
  const ergebnis = ergebnisVon(eingabeAus(boot, { ost: 0, nord: 0 }, { ost: 0, nord: 4 }))

  expect(ergebnis.abstandBasislinie).toBeCloseTo(3, 6)
})

test('Objekte auf beiden Seiten: die Basislinie darf zwischen den Peilungen liegen', () => {
  const boot: Punkt = { ost: 0, nord: 0 }
  const ergebnis = ergebnisVon(eingabeAus(boot, { ost: -4, nord: 1 }, { ost: 4, nord: 1 }))

  expect(ergebnis.entfernungA).toBeCloseTo(Math.hypot(4, 1), 6)
  expect(ergebnis.entfernungB).toBeCloseTo(Math.hypot(4, 1), 6)
  expect(ergebnis.abstandBasislinie).toBeCloseTo(1, 6)
})

test('Schnittwinkel unter 30° wird als grenzwertig gemeldet', () => {
  const boot: Punkt = { ost: 0, nord: 0 }
  // Beide Objekte weit voraus, nur 20° auseinander
  const objektA: Punkt = { ost: 0, nord: 10 }
  const objektB: Punkt = { ost: 10 * Math.tan((20 * Math.PI) / 180), nord: 10 }
  const ergebnis = ergebnisVon(eingabeAus(boot, objektA, objektB))

  expect(ergebnis.schnittwinkel).toBeCloseTo(20, 6)
  expect(ergebnis.warnungen).toHaveLength(1)
  expect(ergebnis.warnungen[0]).toMatch(/Grenzwertig/i)
})

test('Schnittwinkel unter 15° wird als schleifender Schnitt gemeldet', () => {
  const ergebnis = ergebnisVon({
    peilungA: 0,
    peilungB: 8,
    basisrichtung: 94,
    basislaenge: 1.4,
  })

  expect(ergebnis.schnittwinkel).toBeCloseTo(8, 6)
  expect(ergebnis.warnungen[0]).toMatch(/Schleifender Schnitt/i)
})

test('Unsicherheit wächst, wenn der Schnittwinkel kleiner wird', () => {
  const gut = ergebnisVon({ peilungA: 315, peilungB: 45, basisrichtung: 90, basislaenge: 1 })
  const schleifend = ergebnisVon({ peilungA: 0, peilungB: 8, basisrichtung: 94, basislaenge: 1.4 })

  expect(schleifend.unsicherheit).toBeGreaterThan(gut.unsicherheit)
})

test('Unsicherheit entspricht der Näherung d · Δ / sin(γ)', () => {
  const ergebnis = ergebnisVon({ peilungA: 315, peilungB: 45, basisrichtung: 90, basislaenge: 1 })
  const erwartet =
    (Math.max(ergebnis.entfernungA, ergebnis.entfernungB) *
      ANGENOMMENER_PEILFEHLER_GRAD *
      (Math.PI / 180)) /
    Math.sin((ergebnis.schnittwinkel * Math.PI) / 180)

  expect(ergebnis.unsicherheit).toBeCloseTo(erwartet, 10)
})

test('Zwei gleiche Peilungen ergeben keinen Standort', () => {
  const ausgabe = berechneKreuzpeilung({
    peilungA: 40,
    peilungB: 40,
    basisrichtung: 90,
    basislaenge: 2,
  })

  expect(ausgabe.ok).toBe(false)
  if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/Deckung/)
})

test('Verdrehte Basisrichtung (B→A statt A→B) wird als Widerspruch erkannt', () => {
  const boot: Punkt = { ost: 0, nord: 0 }
  const objektA: Punkt = { ost: -2, nord: 5 }
  const objektB: Punkt = { ost: 4, nord: 3 }
  const richtig = eingabeAus(boot, objektA, objektB)

  const ausgabe = berechneKreuzpeilung({
    ...richtig,
    basisrichtung: richtig.basisrichtung + 180,
  })

  expect(ausgabe.ok).toBe(false)
  if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/passen nicht zusammen/)
})

test('Geometrisch unmögliche Kombination wird abgelehnt', () => {
  // Peilungen liegen beidseits der Basisrichtung — dafür gibt es keinen Standort.
  const ausgabe = berechneKreuzpeilung({
    peilungA: 60,
    peilungB: 330,
    basisrichtung: 0,
    basislaenge: 1,
  })

  expect(ausgabe.ok).toBe(false)
})

test('Basis von 0 oder negativen Werten wird abgelehnt', () => {
  for (const basislaenge of [0, -3]) {
    const ausgabe = berechneKreuzpeilung({ peilungA: 315, peilungB: 45, basisrichtung: 90, basislaenge })
    expect(ausgabe.ok).toBe(false)
    if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/Abstand/)
  }
})

test('Fehlende Eingaben werden abgelehnt', () => {
  const ausgabe = berechneKreuzpeilung({
    peilungA: 315,
    peilungB: NaN,
    basisrichtung: 90,
    basislaenge: 1,
  })

  expect(ausgabe.ok).toBe(false)
  if (!ausgabe.ok) expect(ausgabe.fehler).toMatch(/eingeben/)
})

test('Lösungsweg nennt Sinussatz und alle Zwischenwerte', () => {
  const ergebnis = ergebnisVon({ peilungA: 315, peilungB: 45, basisrichtung: 90, basislaenge: 1 })

  expect(ergebnis.methode).toMatch(/Sinussatz/)
  expect(ergebnis.schritte).toHaveLength(7)
  expect(ergebnis.schritte.join('\n')).toMatch(/Sinussatz/)
  expect(ergebnis.formeln.length).toBeGreaterThan(0)
})
