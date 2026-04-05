import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Pyramide berechnen – Volumen, Oberfläche, Mantelfläche online',
  description: 'Pyramide (quadratisch) online berechnen: Volumen, Mantelfläche und Oberfläche aus Grundkante und Höhe. Mit Schritt-für-Schritt-Erklärung.',
}

export default function PyramidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Pyramide berechnen",
            "description": "Quadratische Pyramide online berechnen: Volumen, Mantelfläche und Oberfläche.",
            "url": "https://dreieck-berechnen.de/pyramide",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="pyramide" />
      <ShapeInfo shapeId="pyramide" />
      <MoreShapes currentId="pyramide" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
