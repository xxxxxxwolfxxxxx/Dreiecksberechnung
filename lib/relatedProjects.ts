/**
 * Eigene Projekte, die im Footer unter "Weitere Projekte" verlinkt werden.
 * Alle vier Seiten verlinken untereinander.
 */

export interface RelatedProject {
  name: string
  url: string
  description: string
  title: string
}

export const RELATED_PROJECTS: readonly RelatedProject[] = [
  {
    name: 'Dachplattenrechner.de',
    url: 'https://dachplattenrechner.de/',
    description: 'Dachfläche, Trapezblech, Kantteile und Lattung berechnen',
    title: 'Dachplattenrechner – Dachfläche und Blechbedarf online berechnen',
  },
  {
    name: 'Deutschland-Rechnet.de',
    url: 'https://deutschland-rechnet.de/',
    description: '105+ Rechner für Steuern, Kredit, Energie und Familie',
    title: 'Deutschland rechnet – kostenlose Online-Rechner für alle Lebenslagen',
  },
  {
    name: 'SportbootNavi.de',
    url: 'https://sportbootnavi.de/',
    description: 'Törnplaner und Navigation für Binnenwasserstraßen',
    title: 'SportbootNavi – Törnplaner und Navigation für Sportboote',
  },
]
