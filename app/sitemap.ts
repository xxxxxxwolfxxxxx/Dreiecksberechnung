import type { MetadataRoute } from 'next'
import { PEILUNGS_ROUTEN } from '@/lib/navigation/routen'
import { DREIECK_THEMEN } from '@/lib/dreieck-themen'
import { pfadFuerForm } from '@/lib/navigation/pfade'
import { lastmodFuer } from '@/lib/seo/lastmod'
import { absoluteUrl } from '@/lib/site'

/**
 * `lastModified` kommt aus `lib/seo/lastmod.ts` und nicht aus `new Date()`:
 * ein Build-Zeitstempel liesse alle URLs bei jedem Deploy gemeinsam auf
 * "heute" springen, woraufhin Google die Angabe als unzuverlaessig ignoriert.
 */
function eintrag(
  pfad: string,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(pfad),
    lastModified: lastmodFuer(pfad),
    changeFrequency: 'monthly',
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const shapes = [
    'dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute',
    'wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide',
  ]
  const formen = shapes.map(s =>
    eintrag(
      pfadFuerForm(s),
      s === 'dreieck' ? 1 : ['kreis', 'kugel', 'zylinder', 'wuerfel'].includes(s) ? 0.9 : 0.8,
    ),
  )
  const themen = DREIECK_THEMEN.map(thema => eintrag(`/${thema.id}`, 0.9))
  const peilungen = PEILUNGS_ROUTEN.map(route => eintrag(`/${route.id}`, 0.8))
  return [...formen, ...themen, ...peilungen]
}
