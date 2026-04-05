import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Kegel berechnen – Volumen, Mantelfläche, Oberfläche online',
  description: 'Kegel online berechnen: Volumen, Mantelfläche, Mantellinie und Oberfläche. Alle Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function KegelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Kegel berechnen",
            "description": "Kegel online berechnen: Volumen, Mantelfläche, Mantellinie und Oberfläche.",
            "url": "https://dreieck-berechnen.de/kegel",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kegel" />
      <ShapeInfo shapeId="kegel" />
      <MoreShapes currentId="kegel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
