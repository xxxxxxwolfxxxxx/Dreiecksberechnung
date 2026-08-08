/**
 * Die Navigations-Rechner als eigene Rubrik neben den 2D-Formen und 3D-Körpern.
 * Einzige Quelle für Navigation, Querverweise und Sitemap — die IDs sind
 * gleichzeitig die Routen und die Schlüssel in `peilung-inhalte.ts`.
 */
export interface PeilungsRoute {
  id: string
  label: string
}

export const PEILUNGS_ROUTEN: PeilungsRoute[] = [
  { id: 'kreuzpeilung', label: 'Kreuzpeilung' },
  { id: 'vier-strich-peilung', label: 'Vier-Strich-Peilung' },
]
