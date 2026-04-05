import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Parallelogramm berechnen – Fläche, Umfang, Winkel',
  description: 'Parallelogramm online berechnen: Fläche, Umfang, Winkel und Diagonalen.',
}

export default function ParallelogrammPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Parallelogramm berechnen",
            "description": "Parallelogramm online berechnen: Fläche, Umfang, Winkel und Diagonalen.",
            "url": "https://geometrie-rechner.de/parallelogramm",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="parallelogramm" />
      <ShapeInfo shapeId="parallelogramm" />
      <MoreShapes currentId="parallelogramm" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
