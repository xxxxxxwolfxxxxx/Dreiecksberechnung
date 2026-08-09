import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Würfel berechnen – Volumen, Oberfläche, Diagonale online',
  description: 'Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale und Flächendiagonale. Alle Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function WuerfelPage() {
  return (
    <>
      <RechnerSchema
        name="Würfel berechnen"
        description="Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale."
        path="/wuerfel"
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="wuerfel" />
      <ShapeInfo shapeId="wuerfel" />
      <MoreShapes currentId="wuerfel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
