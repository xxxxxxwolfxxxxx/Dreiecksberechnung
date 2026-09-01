/**
 * Datum der letzten inhaltlichen Aenderung je Route – bewusst von Hand
 * gepflegt.
 *
 * Vorher stand in `app/sitemap.ts` ein `new Date()`: dadurch trugen alle
 * URLs denselben Build-Zeitstempel und sprangen bei jedem Deploy gemeinsam
 * auf ein neues Datum. Google stuft solche `lastmod`-Angaben als
 * unzuverlaessig ein und ignoriert sie danach komplett – die Angabe war
 * also nicht nur falsch, sondern wertlos.
 *
 * Deshalb: nur anfassen, wenn sich der Inhalt der Seite wirklich geaendert
 * hat. Ein neues Deployment allein ist kein Grund.
 */

/** Route → Datum der letzten Inhaltsaenderung, Format YYYY-MM-DD. */
export const LASTMOD: Readonly<Record<string, string>> = {
  // Rechner: Umbau auf Startseite plus URL-Parameter
  '/': '2026-08-09',
  '/kreis': '2026-08-09',
  '/rechteck': '2026-08-09',
  '/trapez': '2026-08-09',
  '/parallelogramm': '2026-08-09',
  '/raute': '2026-08-09',
  '/wuerfel': '2026-08-09',
  '/quader': '2026-08-09',
  '/kugel': '2026-08-09',
  '/zylinder': '2026-08-09',
  '/kegel': '2026-08-09',
  '/pyramide': '2026-08-09',
  // Dreieck-Themenseiten: neu angelegt
  '/dreieck-flaeche': '2026-08-09',
  '/dreieck-winkel': '2026-08-09',
  '/dreieck-seiten': '2026-08-09',
  '/dreieck-umfang': '2026-08-09',
  // Navigation/See
  '/kreuzpeilung': '2026-08-09',
  '/vier-strich-peilung': '2026-08-09',
}

/**
 * Datum fuer Routen, die noch nicht in `LASTMOD` stehen. Bewusst ein festes
 * Datum statt „heute", damit auch der Fallback nicht bei jedem Build springt.
 */
export const LASTMOD_FALLBACK = '2026-08-09'

/** Letzte Inhaltsaenderung als `Date` – je Aufruf ein eigenes Objekt. */
export function lastmodFuer(pfad: string): Date {
  return new Date(LASTMOD[pfad] ?? LASTMOD_FALLBACK)
}
