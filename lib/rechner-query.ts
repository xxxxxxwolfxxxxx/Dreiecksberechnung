import type { InputDefinition, Shape } from '@/lib/shapes/types'

/** Einheiten, die der Rechner anbietet. Muss zu UNITS in ShapeCalculator passen. */
export const EINHEITEN = ['mm', 'cm', 'm', 'km'] as const

/** Groesster Winkel, der als Eingabe noch sinnvoll ist (Innenwinkel). */
const MAX_WINKEL = 180

/**
 * Schreibvarianten, die auf einen internen Feld-Key zeigen. Schluessel und Ziel
 * liegen bereits in normalisierter Form vor (siehe `normalisiere`).
 *
 * Ein Alias greift nur, wenn die jeweilige Form das Zielfeld auch besitzt –
 * "d" meint beim Kreis den Durchmesser, beim Trapez einen Schenkel.
 */
const ALIASE: Record<string, string> = {
  winkela: 'alpha',
  winkelb: 'beta',
  winkelc: 'gamma',
  winkelalpha: 'alpha',
  winkelbeta: 'beta',
  winkelgamma: 'gamma',
  seitea: 'a',
  seiteb: 'b',
  seitec: 'c',
  radius: 'r',
  durchmesser: 'd',
  hoehe: 'h',
  kantenlaenge: 'a',
  grundkante: 'a',
  grundseite: 'a',
  laenge: 'a',
  breite: 'b',
  flache: 'flaeche',
  inhalt: 'flaeche',
}

/**
 * Vereinheitlicht einen Feldnamen: Kleinschreibung, Umlaute ausgeschrieben,
 * griechische Buchstaben als lateinische Entsprechung, ohne Trennzeichen.
 */
function normalisiere(roh: string): string {
  return roh
    .toLowerCase()
    .replace(/α/g, 'alpha')
    .replace(/β/g, 'beta')
    .replace(/γ/g, 'gamma')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[\s_\-.]/g, '')
}

/** Ordnet normalisierte Feldnamen den tatsaechlichen Keys einer Form zu. */
function feldRegister(shape: Shape): Map<string, InputDefinition> {
  const register = new Map<string, InputDefinition>()

  for (const feld of shape.inputs) {
    register.set(normalisiere(feld.key), feld)
  }

  return register
}

/** Loest einen Rohnamen gegen die Felder der Form auf. */
function findeFeld(roh: string, register: Map<string, InputDefinition>): InputDefinition | undefined {
  const normalisiert = normalisiere(roh)
  const direkt = register.get(normalisiert)

  if (direkt) return direkt

  const alias = ALIASE[normalisiert]

  return alias ? register.get(alias) : undefined
}

/**
 * Prueft, ob ein Wert fuer dieses Feld ueberhaupt sinnvoll ist. Unsinnige
 * Angaben werden verworfen statt an den Solver weitergereicht – ein leeres
 * Feld ist ehrlicher als ein Ergebnis aus Muell.
 */
function istGueltig(wert: number, feld: InputDefinition): boolean {
  if (!Number.isFinite(wert) || wert <= 0) return false

  return feld.unit !== 'angle' || wert < MAX_WINKEL
}

/** Wandelt eine Zahl in deutscher oder englischer Schreibweise um. */
function zuZahl(roh: string): number {
  return Number.parseFloat(roh.replace(',', '.'))
}

/**
 * Liest Zuweisungen der Form "a=3", "alpha: 40" oder "Radius 7" aus einem
 * freien Text. Das Dezimalkomma loest sich von selbst gegen die Komma-Liste
 * auf: nach dem Komma muss eine Ziffer folgen, sonst endet die Zahl davor.
 */
function ausAusdruck(ausdruck: string, register: Map<string, InputDefinition>): Record<string, number> {
  const zuweisung = /([\p{L}][\p{L}\p{N}_]*)\s*[=:]?\s*(-?\d+(?:[.,]\d+)?)/gu
  const werte: Record<string, number> = {}

  for (const treffer of ausdruck.matchAll(zuweisung)) {
    const feld = findeFeld(treffer[1], register)

    if (!feld) continue

    const wert = zuZahl(treffer[2])

    if (istGueltig(wert, feld)) {
      werte[feld.key] = wert
    }
  }

  return werte
}

/**
 * Ermittelt Startwerte fuer einen Rechner aus der URL.
 *
 * Zwei Quellen, direkte Parameter gewinnen:
 * - `?a=3&b=4&c=5` – teilbare Links auf eine konkrete Aufgabe
 * - `?q=Dreieck a=3 b=4 c=5` – freier Ausdruck, den Google an die
 *   SolveMathAction-Ziel-URL des MathSolver-Markups schickt
 */
export function werteAusQuery(shape: Shape, params: URLSearchParams): Partial<Record<string, number>> {
  const register = feldRegister(shape)
  const ausQ = ausAusdruck(params.get('q') ?? '', register)
  const direkt: Record<string, number> = {}

  for (const [roh, wert] of params.entries()) {
    if (roh === 'q') continue

    const feld = register.get(normalisiere(roh))

    if (!feld) continue

    const zahl = zuZahl(wert)

    if (istGueltig(zahl, feld)) {
      direkt[feld.key] = zahl
    }
  }

  return { ...ausQ, ...direkt }
}

/** Liest eine gewuenschte Einheit aus der URL, sofern sie unterstuetzt wird. */
export function einheitAusQuery(params: URLSearchParams): string | undefined {
  const gewuenscht = params.get('einheit')?.toLowerCase()

  return EINHEITEN.find(einheit => einheit === gewuenscht)
}
