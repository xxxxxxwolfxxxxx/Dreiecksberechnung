import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Würfel berechnen – Volumen, Oberfläche, Diagonale',
  description: 'Würfel online berechnen: Volumen, Oberfläche, Raum- und Flächendiagonale aus der Kantenlänge – mit Rechenweg Schritt für Schritt.',
}

export default function WuerfelPage() {
  return (
    <>
      <RechnerSchema
        name="Würfel berechnen"
        description="Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale."
        path="/wuerfel"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="wuerfel" />
      <ShapeInfo shapeId="wuerfel" />
      <MoreShapes currentId="wuerfel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
