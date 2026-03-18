import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'

export const metadata: Metadata = {
  title: 'Würfel berechnen – Volumen, Oberfläche, Diagonale online',
  description: 'Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale und Flächendiagonale. Alle Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function WuerfelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Würfel berechnen",
            "description": "Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale.",
            "url": "https://dreieck-berechnen.de/wuerfel",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="wuerfel" />
      <MoreShapes currentId="wuerfel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
