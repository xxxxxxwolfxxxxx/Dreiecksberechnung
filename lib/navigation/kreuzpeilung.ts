/**
 * Kreuzpeilung — Standortbestimmung aus zwei Peilungen.
 *
 * Zwei feste Objekte A und B (Leuchtturm, Kirchturm, Tonne) mit bekanntem
 * Abstand b bilden die Basislinie. Vom Boot aus wird jedes Objekt rechtweisend
 * gepeilt. Boot, A und B bilden damit ein Dreieck, in dem alle drei Winkel
 * bekannt sind und eine Seite (die Basis) gemessen ist — der klassische
 * WSW-Fall, den der Sinussatz löst.
 */
import { formatNumber } from '../format'
import { RAD, normalisiereRichtung, sinGrad, winkelDifferenz } from './winkel'

/** Ab diesem Schnittwinkel gilt der Schnitt als brauchbar, darunter als schleifend. */
export const SCHLEIFEND_UNTER_GRAD = 30
/** Darunter ist das Ergebnis in der Praxis nicht mehr verwertbar. */
export const KRITISCH_UNTER_GRAD = 15
/** Für die Fehlerabschätzung angenommener Peilfehler einer Handpeilung. */
export const ANGENOMMENER_PEILFEHLER_GRAD = 2

/** Unter diesem Schnittwinkel ist sin(γ) ≈ 0 — es lässt sich nichts rechnen. */
const MIN_SCHNITTWINKEL_GRAD = 1
/** Toleranz beim Abgleich Peilungen ↔ Basisrichtung (Rundung auf ganze Grad). */
const KONSISTENZ_TOLERANZ_GRAD = 0.5

export interface KreuzpeilungEingabe {
  /** Rechtweisende Peilung vom Boot zum Objekt A in Grad. */
  peilungA: number
  /** Rechtweisende Peilung vom Boot zum Objekt B in Grad. */
  peilungB: number
  /** Rechtweisende Richtung der Basislinie, von A nach B, in Grad. */
  basisrichtung: number
  /** Abstand der beiden Objekte (Basis b) in der gewählten Längeneinheit. */
  basislaenge: number
}

export interface KreuzpeilungErgebnis {
  /** Entfernung Boot → Objekt A. */
  entfernungA: number
  /** Entfernung Boot → Objekt B. */
  entfernungB: number
  /** Senkrechter Abstand des Bootes von der Basislinie A–B. */
  abstandBasislinie: number
  /** Winkel am Boot zwischen den beiden Peilstrahlen (Schnittwinkel γ). */
  schnittwinkel: number
  /** Winkel am Objekt A zwischen Basislinie und Peilstrahl. */
  winkelA: number
  /** Winkel am Objekt B zwischen Basislinie und Peilstrahl. */
  winkelB: number
  /** Grobe Streuung des Standorts bei ±2° Peilfehler (Näherung). */
  unsicherheit: number
  warnungen: string[]
  methode: string
  formeln: string[]
  schritte: string[]
}

export type KreuzpeilungAusgabe =
  | { ok: true; ergebnis: KreuzpeilungErgebnis }
  | { ok: false; fehler: string }

const fmt = formatNumber

/** Formatiert eine Richtung dreistellig, wie es an Bord üblich ist: 007°, 145°. */
function richtung(grad: number): string {
  return `${String(Math.round(normalisiereRichtung(grad))).padStart(3, '0')}°`
}

function warnungenFuer(schnittwinkel: number): string[] {
  // Nicht nur der spitze, auch der fast gestreckte Schnitt ist unbrauchbar:
  // in beiden Fällen geht sin(γ) gegen 0.
  const guete = Math.min(schnittwinkel, 180 - schnittwinkel)
  if (guete < KRITISCH_UNTER_GRAD) {
    return [
      `Schleifender Schnitt: Die Peilstrahlen schneiden sich unter ${fmt(schnittwinkel)}°. ` +
        `Unter ${KRITISCH_UNTER_GRAD}° ist der Standort praktisch nicht bestimmbar — schon ein halbes Grad ` +
        `Peilfehler verschiebt den Schnittpunkt um ein Vielfaches der Bootslänge. Nimm ein anderes Objektpaar.`,
    ]
  }
  if (guete < SCHLEIFEND_UNTER_GRAD) {
    return [
      `Grenzwertiger Schnittwinkel von ${fmt(schnittwinkel)}°: Erst ab etwa ${SCHLEIFEND_UNTER_GRAD}° ` +
        `ist eine Kreuzpeilung zuverlässig. Behandle den Standort als Schätzung und peile möglichst ` +
        `zwei Objekte, die weiter auseinander liegen.`,
    ]
  }
  return []
}

/**
 * Berechnet Standort-Kenngrößen aus zwei Peilungen und der bekannten Basis.
 * Gibt einen sprechenden Fehler zurück, wenn die Eingaben kein Dreieck ergeben.
 */
export function berechneKreuzpeilung(eingabe: KreuzpeilungEingabe): KreuzpeilungAusgabe {
  const { peilungA, peilungB, basisrichtung, basislaenge } = eingabe

  if (![peilungA, peilungB, basisrichtung, basislaenge].every(Number.isFinite)) {
    return { ok: false, fehler: 'Bitte beide Peilungen, die Basisrichtung und den Abstand der Objekte eingeben.' }
  }
  if (basislaenge <= 0) {
    return { ok: false, fehler: 'Der Abstand der beiden Objekte (Basis b) muss größer als 0 sein.' }
  }

  const schnittwinkel = winkelDifferenz(peilungA, peilungB)
  if (schnittwinkel < MIN_SCHNITTWINKEL_GRAD) {
    return {
      ok: false,
      fehler:
        'Beide Peilungen zeigen in dieselbe Richtung. Wenn zwei Objekte in Deckung liegen, ergibt sich nur eine ' +
        'Standlinie und kein Schnittpunkt — such dir ein Objekt, das deutlich seitlicher steht.',
    }
  }
  if (schnittwinkel > 180 - MIN_SCHNITTWINKEL_GRAD) {
    return {
      ok: false,
      fehler:
        'Die beiden Objekte liegen von dir aus fast genau gegenüber (Schnittwinkel ≈ 180°). Du stehst dann auf ' +
        'der Verbindungslinie und der Schnittpunkt ist nicht bestimmbar.',
    }
  }

  // Winkel am Objekt: zwischen der Basislinie und dem Peilstrahl zurück zum Boot.
  // Von A aus liegt das Boot in Richtung (peilungA + 180°), die Basis in Richtung basisrichtung.
  const winkelA = winkelDifferenz(peilungA + 180, basisrichtung)
  // Von B aus zeigt die Basis in die Gegenrichtung (basisrichtung + 180°).
  const winkelB = winkelDifferenz(peilungB + 180, basisrichtung + 180)
  const winkelsumme = winkelA + winkelB

  // Die Winkelsumme im Dreieck erzwingt γ = 180° − α − β. Weicht das vom
  // gepeilten Schnittwinkel ab, passen die drei Richtungsangaben nicht zusammen.
  if (Math.abs(180 - winkelsumme - schnittwinkel) > KONSISTENZ_TOLERANZ_GRAD) {
    return {
      ok: false,
      fehler:
        'Peilungen und Basisrichtung passen nicht zusammen — mit diesen Werten gibt es keinen Standort. ' +
        'Prüfe die Richtungen: Beide Peilungen laufen rechtweisend vom Boot zum Objekt, die Basisrichtung ' +
        'rechtweisend von Objekt A zu Objekt B (nicht umgekehrt).',
    }
  }

  const sinSchnitt = sinGrad(schnittwinkel)
  const entfernungA = (basislaenge * sinGrad(winkelB)) / sinSchnitt
  const entfernungB = (basislaenge * sinGrad(winkelA)) / sinSchnitt
  const abstandBasislinie = entfernungA * sinGrad(winkelA)
  // Näherung: Ein Peilfehler Δ verschiebt die Standlinie um d · Δ (im Bogenmaß);
  // der Schnittpunkt wandert zusätzlich um den Faktor 1/sin(γ).
  const unsicherheit =
    (Math.max(entfernungA, entfernungB) * ANGENOMMENER_PEILFEHLER_GRAD * RAD) / sinSchnitt

  const schritte = [
    `Gegeben: Peilung zu A = ${richtung(peilungA)}, Peilung zu B = ${richtung(peilungB)}, ` +
      `Basisrichtung A→B = ${richtung(basisrichtung)}, Basis b = ${fmt(basislaenge)}`,
    `Schnittwinkel am Boot (kleinerer Winkel zwischen den beiden Peilungen):\n\u03B3 = \u2222(${richtung(peilungA)}, ${richtung(peilungB)}) = ${fmt(schnittwinkel)}\u00B0`,
    `Winkel am Objekt A (Peilstrahl zurück gegen Basislinie):\n\u03B1 = ${fmt(winkelA)}\u00B0`,
    `Winkel am Objekt B:\n\u03B2 = 180\u00B0 \u2212 \u03B3 \u2212 \u03B1 = ${fmt(winkelB)}\u00B0`,
    `Entfernung zu A (Sinussatz):\nd\u2090 = b \u00B7 sin(\u03B2) / sin(\u03B3) = ${fmt(basislaenge)} \u00B7 sin(${fmt(winkelB)}\u00B0) / sin(${fmt(schnittwinkel)}\u00B0) = ${fmt(entfernungA)}`,
    `Entfernung zu B (Sinussatz):\nd_b = b \u00B7 sin(\u03B1) / sin(\u03B3) = ${fmt(basislaenge)} \u00B7 sin(${fmt(winkelA)}\u00B0) / sin(${fmt(schnittwinkel)}\u00B0) = ${fmt(entfernungB)}`,
    `Abstand von der Basislinie (Höhe im Dreieck):\nh = d\u2090 \u00B7 sin(\u03B1) = ${fmt(entfernungA)} \u00B7 sin(${fmt(winkelA)}\u00B0) = ${fmt(abstandBasislinie)}`,
  ]

  return {
    ok: true,
    ergebnis: {
      entfernungA,
      entfernungB,
      abstandBasislinie,
      schnittwinkel,
      winkelA,
      winkelB,
      unsicherheit,
      warnungen: warnungenFuer(schnittwinkel),
      methode: 'Sinussatz (WSW)',
      formeln: [
        '\u03B3 = |Peilung A \u2212 Peilung B|',
        '\u03B1 + \u03B2 + \u03B3 = 180\u00B0',
        'd\u2090 = b \u00B7 sin(\u03B2) / sin(\u03B3)',
        'h = d\u2090 \u00B7 sin(\u03B1)',
      ],
      schritte,
    },
  }
}
