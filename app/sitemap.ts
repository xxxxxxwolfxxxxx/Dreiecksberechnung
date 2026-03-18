import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://geometrie-rechner.de'
  const shapes = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
  return shapes.map(s => ({
    url: `${base}/${s}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s === 'dreieck' ? 1 : 0.8,
  }))
}
