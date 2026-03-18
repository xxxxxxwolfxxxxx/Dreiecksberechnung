import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'

export const metadata: Metadata = {
  title: 'Quader berechnen – Volumen, Oberfläche, Raumdiagonale online',
  description: 'Quader online berechnen: Volumen, Oberfläche und Raumdiagonale. Mit Schritt-für-Schritt-Erklärung für Schüler.',
}

export default function QuaderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Quader berechnen",
            "description": "Quader online berechnen: Volumen, Oberfläche, Raumdiagonale.",
            "url": "https://dreieck-berechnen.de/quader",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="quader" />
      <MoreShapes currentId="quader" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
