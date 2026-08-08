/**
 * Winkel-Grundlagen für die terrestrische Navigation.
 *
 * Peilungen werden als rechtweisende Richtungen in Grad geführt: 000° = Nord,
 * 090° = Ost. Alle Rechnungen hier arbeiten mit diesem Kompass-Kreis, nicht mit
 * dem mathematischen Einheitskreis.
 */

/** Ein Strich ist die alte seemännische Winkeleinheit: 1/32 des Vollkreises. */
export const GRAD_PRO_STRICH = 360 / 32

/** Umrechnungsfaktor Grad → Radiant. */
export const RAD = Math.PI / 180

/** Bringt eine beliebige Gradangabe in den Bereich 0° … 360°. */
export function normalisiereRichtung(grad: number): number {
  const rest = grad % 360
  return rest < 0 ? rest + 360 : rest
}

/**
 * Kleinster Winkel zwischen zwei Richtungen, immer 0° … 180°.
 * Aus 350° und 010° werden so 20° und nicht 340°.
 */
export function winkelDifferenz(richtungA: number, richtungB: number): number {
  const differenz = Math.abs(normalisiereRichtung(richtungA) - normalisiereRichtung(richtungB))
  return differenz > 180 ? 360 - differenz : differenz
}

/** Strich in Grad: 4 Strich = 45°. */
export function strichInGrad(strich: number): number {
  return strich * GRAD_PRO_STRICH
}

/** Grad in Strich: 90° = 8 Strich. */
export function gradInStrich(grad: number): number {
  return grad / GRAD_PRO_STRICH
}

/** Sinus einer Gradangabe. */
export function sinGrad(grad: number): number {
  return Math.sin(grad * RAD)
}

/** Kosinus einer Gradangabe. */
export function cosGrad(grad: number): number {
  return Math.cos(grad * RAD)
}
