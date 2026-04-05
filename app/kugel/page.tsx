import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Kugel berechnen – Volumen, Oberfläche, Radius online',
  description: 'Kugel online berechnen: Volumen und Oberfläche aus Radius oder Durchmesser. Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function KugelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Kugel berechnen",
            "description": "Kugel online berechnen: Volumen und Oberfläche aus Radius oder Durchmesser.",
            "url": "https://dreieck-berechnen.de/kugel",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kugel" />
      <ShapeInfo shapeId="kugel" />
      <MoreShapes currentId="kugel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
