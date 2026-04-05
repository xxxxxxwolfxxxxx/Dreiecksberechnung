import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Kreis berechnen – Radius, Fläche, Umfang online',
  description: 'Kreis online berechnen: Radius, Durchmesser, Fläche und Umfang. Alle Formeln erklärt.',
}

export default function KreisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Kreis berechnen",
            "description": "Kreis online berechnen: Radius, Durchmesser, Fläche und Umfang.",
            "url": "https://geometrie-rechner.de/kreis",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kreis" />
      <ShapeInfo shapeId="kreis" />
      <MoreShapes currentId="kreis" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
