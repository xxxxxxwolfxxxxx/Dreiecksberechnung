import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Raute berechnen – Fläche, Diagonalen, Winkel',
  description: 'Raute (Rhombus) online berechnen: Fläche, Diagonalen, Winkel und Umfang.',
}

export default function RautePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Raute berechnen",
            "description": "Raute (Rhombus) online berechnen: Fläche, Diagonalen, Winkel und Umfang.",
            "url": "https://dreieck-berechnen.de/raute",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="raute" />
      <ShapeInfo shapeId="raute" />
      <MoreShapes currentId="raute" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
