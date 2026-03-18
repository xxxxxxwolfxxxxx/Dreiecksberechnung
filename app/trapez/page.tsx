import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'

export const metadata: Metadata = {
  title: 'Trapez berechnen – Fläche, Umfang, Höhe',
  description: 'Trapez online berechnen: Fläche, Umfang und Höhe aus verschiedenen Eingabe-Kombinationen.',
}

export default function TrapezPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Trapez berechnen",
            "description": "Trapez online berechnen: Fläche, Umfang und Höhe.",
            "url": "https://geometrie-rechner.de/trapez",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="trapez" />
      <MoreShapes currentId="trapez" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
