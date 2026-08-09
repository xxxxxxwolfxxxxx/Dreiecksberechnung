import type { MetadataRoute } from 'next'
import { PEILUNGS_ROUTEN } from '@/lib/navigation/routen'
import { DREIECK_THEMEN } from '@/lib/dreieck-themen'
import { pfadFuerForm } from '@/lib/navigation/pfade'
import { SITE_URL, absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const shapes = [
    'dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute',
    'wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide',
  ]
  const formen = shapes.map(s => ({
    url: absoluteUrl(pfadFuerForm(s)),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s === 'dreieck' ? 1 : ['kreis', 'kugel', 'zylinder', 'wuerfel'].includes(s) ? 0.9 : 0.8,
  }))
  const themen = DREIECK_THEMEN.map(thema => ({
    url: `${SITE_URL}/${thema.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))
  const peilungen = PEILUNGS_ROUTEN.map(route => ({
    url: `${SITE_URL}/${route.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [...formen, ...themen, ...peilungen]
}
