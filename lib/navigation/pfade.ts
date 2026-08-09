/**
 * Zuordnung Form-ID → URL-Pfad. Einzige Quelle für interne Links, Sitemap
 * und die Aktiv-Markierung in der Navigation.
 *
 * Der Dreieck-Rechner liegt bewusst auf der Startseite statt auf /dreieck:
 * dreieck-berechnen.de ist eine Exact-Match-Domain, und laut Search Console
 * (Stand 09.08.2026) entfielen 126 von 188 Impressionen sowie sämtliche
 * Klicks auf "/". Vorher lag der Rechner auf /dreieck, "/" leitete dorthin
 * weiter — Google hat daraufhin beide URLs mit identischem Titel indexiert.
 * Seitdem ist die Richtung umgedreht.
 */
export const STARTSEITEN_FORM = 'dreieck'

export function pfadFuerForm(id: string): string {
  return id === STARTSEITEN_FORM ? '/' : `/${id}`
}

/**
 * Ob `pathname` die Seite von `id` ist. Der alte Pfad /dreieck zählt weiter
 * als aktiv, damit die Markierung während der Weiterleitung nicht springt.
 */
export function istAktiverPfad(pathname: string, id: string): boolean {
  if (id === STARTSEITEN_FORM) return pathname === '/' || pathname === `/${STARTSEITEN_FORM}`
  return pathname === `/${id}`
}
