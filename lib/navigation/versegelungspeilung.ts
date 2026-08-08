/**
 * Versegelungspeilung — Entfernung aus zwei Seitenpeilungen und der dazwischen
 * gefahrenen Distanz.
 *
 * Ein Objekt wird zweimal relativ zum eigenen Kurs gepeilt, dazwischen wird die
 * gefahrene Distanz mitgeschrieben. Erste Peilung, zweite Peilung und Objekt
 * bilden ein Dreieck: Der Winkel am Objekt ist die Differenz der beiden
 * Seitenpeilungen, die gefahrene Distanz ist die dem Objekt gegenüberliegende
 * Seite — der Sinussatz liefert beide Entfernungen.
 *
 * Sonderfall Vier-Strich-Peilung: 45° und 90° ergeben ein gleichschenkliges
 * Dreieck, der Querabstand ist dann genau die gefahrene Distanz.
 */
import { formatNumber } from '../format'
import { cosGrad, gradInStrich, sinGrad } from './winkel'

/** Voreinstellung: 4 Strich (45°) und querab (90°). */
export const VOREINSTELLUNG_PEILUNG_1 = 45
export const VOREINSTELLUNG_PEILUNG_2 = 90

/** Unter dieser Differenz der Seitenpeilungen wird das Ergebnis unsicher. */
export const KLEINE_DIFFERENZ_UNTER_GRAD = 15
/** Objekt liegt so weit voraus, dass die Peilung kaum auswertbar ist. */
export const FAST_VORAUS_UNTER_GRAD = 10
/** Darunter ist sin(Winkel am Objekt) ≈ 0 — es lässt sich nichts rechnen. */
const MIN_DIFFERENZ_GRAD = 1
/** Toleranz beim Erkennen der Sonderfälle (Verdopplung, Vier-Strich). */
const SONDERFALL_TOLERANZ_GRAD = 0.5

export interface VersegelungEingabe {
  /** Erste Seitenpeilung, gemessen vom Kurs aus (0° = voraus), in Grad. */
  peilung1: number
  /** Zweite Seitenpeilung, gemessen vom Kurs aus, in Grad. */
  peilung2: number
  /** Zwischen beiden Peilungen gefahrene Distanz in der gewählten Einheit. */
  distanz: number
}

export interface VersegelungErgebnis {
  /** Entfernung zum Objekt im Moment der ersten Peilung. */
  entfernung1: number
  /** Entfernung zum Objekt im Moment der zweiten Peilung. */
  entfernung2: number
  /** Kürzester Abstand des Objekts von der Kurslinie (Abstand beim Querabpassieren). */
  querabstand: number
  /** Reststrecke auf dem Kurs, bis das Objekt querab steht (negativ: schon passiert). */
  restweg: number
  /** Winkel am Objekt = Differenz der beiden Seitenpeilungen. */
  winkelObjekt: number
  warnungen: string[]
  hinweise: string[]
  methode: string
  formeln: string[]
  schritte: string[]
}

export type VersegelungAusgabe =
  | { ok: true; ergebnis: VersegelungErgebnis }
  | { ok: false; fehler: string }

const fmt = formatNumber

/**
 * Gefahrene Distanz aus Fahrt über Grund und Zeitspanne.
 * 6 kn über 20 Minuten sind 2,0 sm.
 */
export function distanzAusFahrt(fahrtInKnoten: number, dauerInMinuten: number): number | undefined {
  if (!Number.isFinite(fahrtInKnoten) || !Number.isFinite(dauerInMinuten)) return undefined
  if (fahrtInKnoten <= 0 || dauerInMinuten <= 0) return undefined
  return (fahrtInKnoten * dauerInMinuten) / 60
}

function warnungenFuer(peilung1: number, differenz: number): string[] {
  const warnungen: string[] = []
  if (differenz < KLEINE_DIFFERENZ_UNTER_GRAD) {
    warnungen.push(
      `Die beiden Peilungen liegen nur ${fmt(differenz)}° auseinander. Die Entfernung wächst mit 1/sin dieser ` +
        `Differenz — ein Grad Peilfehler wird hier zu einem Fehler von vielen Zehnteln in der Entfernung. ` +
        `Warte länger zwischen den Peilungen oder wähle die zweite Peilung deutlich seitlicher.`,
    )
  }
  if (peilung1 < FAST_VORAUS_UNTER_GRAD) {
    warnungen.push(
      `Bei der ersten Peilung lag das Objekt mit ${fmt(peilung1)}° fast genau voraus. So kleine Seitenpeilungen ` +
        `lassen sich an Bord kaum genau ablesen; das Ergebnis ist entsprechend grob.`,
    )
  }
  return warnungen
}

function hinweiseFuer(peilung1: number, peilung2: number): string[] {
  const hinweise: string[] = [
    'Das Verfahren setzt gleichbleibenden Kurs und gleichbleibende Fahrt voraus. Strom, Windversatz und ' +
      'Ruderarbeit zwischen den beiden Peilungen verfälschen das Ergebnis — gerechnet wird mit der Distanz ' +
      'über Grund, nicht mit der durchs Wasser gelaufenen.',
  ]
  const istVierStrich =
    Math.abs(peilung1 - VOREINSTELLUNG_PEILUNG_1) < SONDERFALL_TOLERANZ_GRAD &&
    Math.abs(peilung2 - VOREINSTELLUNG_PEILUNG_2) < SONDERFALL_TOLERANZ_GRAD
  if (istVierStrich) {
    hinweise.push(
      'Klassische Vier-Strich-Peilung: 45° (4 Strich) und querab (90°) ergeben ein gleichschenkliges Dreieck. ' +
        'Der Querabstand ist genau die gefahrene Distanz — dafür braucht man an Bord keinen Rechner.',
    )
  } else if (Math.abs(peilung2 - 2 * peilung1) < SONDERFALL_TOLERANZ_GRAD) {
    hinweise.push(
      'Verdopplung der Seitenpeilung: Die zweite Peilung ist doppelt so groß wie die erste. Dann ist die ' +
        'Entfernung bei der zweiten Peilung immer genau so groß wie die gefahrene Distanz — unabhängig davon, ' +
        'welche Winkel du gewählt hast.',
    )
  }
  return hinweise
}

/**
 * Berechnet Entfernungen und Querabstand aus zwei Seitenpeilungen und der
 * dazwischen gefahrenen Distanz.
 */
export function berechneVersegelungspeilung(eingabe: VersegelungEingabe): VersegelungAusgabe {
  const { peilung1, peilung2, distanz } = eingabe

  if (![peilung1, peilung2, distanz].every(Number.isFinite)) {
    return { ok: false, fehler: 'Bitte beide Seitenpeilungen und die gefahrene Distanz eingeben.' }
  }
  if (distanz <= 0) {
    return { ok: false, fehler: 'Die zwischen den Peilungen gefahrene Distanz muss größer als 0 sein.' }
  }
  if (peilung1 <= 0 || peilung1 >= 180 || peilung2 <= 0 || peilung2 > 180) {
    return {
      ok: false,
      fehler:
        'Die Seitenpeilung wird vom eigenen Kurs aus gemessen: 0° ist genau voraus, 90° querab, 180° genau ' +
        'achtern. Genau voraus (0°) und genau achtern (180° bei der ersten Peilung) lassen sich nicht auswerten.',
    }
  }

  const winkelObjekt = peilung2 - peilung1
  if (winkelObjekt < MIN_DIFFERENZ_GRAD) {
    return {
      ok: false,
      fehler:
        'Die zweite Seitenpeilung muss größer sein als die erste: Während du weiterfährst, wandert das Objekt ' +
        'nach hinten, die Seitenpeilung nimmt also zu. Bleibt sie gleich, hältst du direkt auf das Objekt zu ' +
        'oder direkt davon weg — dann lässt sich keine Entfernung bestimmen.',
    }
  }

  const sinObjekt = sinGrad(winkelObjekt)
  const entfernung1 = (distanz * sinGrad(peilung2)) / sinObjekt
  const entfernung2 = (distanz * sinGrad(peilung1)) / sinObjekt
  const querabstand = entfernung2 * sinGrad(peilung2)
  const restweg = entfernung2 * cosGrad(peilung2)

  const schritte = [
    `Gegeben: erste Seitenpeilung = ${fmt(peilung1)}° (${fmt(gradInStrich(peilung1))} Strich), ` +
      `zweite Seitenpeilung = ${fmt(peilung2)}° (${fmt(gradInStrich(peilung2))} Strich), ` +
      `gefahrene Distanz = ${fmt(distanz)}`,
    `Winkel am Objekt (Differenz der Seitenpeilungen):\nδ = ${fmt(peilung2)}° − ${fmt(peilung1)}° = ${fmt(winkelObjekt)}°`,
    `Entfernung bei der zweiten Peilung (Sinussatz):\nd₂ = s · sin(α1) / sin(δ) = ${fmt(distanz)} · sin(${fmt(peilung1)}°) / sin(${fmt(winkelObjekt)}°) = ${fmt(entfernung2)}`,
    `Entfernung bei der ersten Peilung:\nd₁ = s · sin(α2) / sin(δ) = ${fmt(distanz)} · sin(${fmt(peilung2)}°) / sin(${fmt(winkelObjekt)}°) = ${fmt(entfernung1)}`,
    `Querabstand zur Kurslinie:\nq = d₂ · sin(α2) = ${fmt(entfernung2)} · sin(${fmt(peilung2)}°) = ${fmt(querabstand)}`,
    `Reststrecke, bis das Objekt querab steht:\nr = d₂ · cos(α2) = ${fmt(entfernung2)} · cos(${fmt(peilung2)}°) = ${fmt(restweg)}`,
  ]

  return {
    ok: true,
    ergebnis: {
      entfernung1,
      entfernung2,
      querabstand,
      restweg,
      winkelObjekt,
      warnungen: warnungenFuer(peilung1, winkelObjekt),
      hinweise: hinweiseFuer(peilung1, peilung2),
      methode: 'Sinussatz (Versegelungspeilung)',
      formeln: [
        'δ = α2 − α1',
        'd₂ = s · sin(α1) / sin(δ)',
        'd₁ = s · sin(α2) / sin(δ)',
        'q = d₂ · sin(α2)',
      ],
      schritte,
    },
  }
}
