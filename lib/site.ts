/** Kanonische Basis-URL der Seite. Einzige Quelle für Domain-Angaben. */
export const SITE_URL = 'https://dreieck-berechnen.de'

/**
 * Absolute URL zu einem internen Pfad. Der Wurzelpfad bleibt ohne
 * nachgestellten Slash, damit JSON-LD und Canonical dieselbe Schreibweise
 * verwenden – Next.js erzeugt für den Canonical ebenfalls "…de".
 */
export function absoluteUrl(pfad: string): string {
  return pfad === '/' ? SITE_URL : `${SITE_URL}${pfad}`
}
