import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Rechteck berechnen – Fläche, Umfang, Diagonale',
  description: 'Rechteck online berechnen: Fläche, Umfang, Diagonale. Alle Eingabe-Kombinationen unterstützt.',
}

export default function RechteckPage() {
  return (
    <>
      <RechnerSchema
        name="Rechteck berechnen"
        description="Rechteck online berechnen: Fläche, Umfang, Diagonale."
        path="/rechteck"
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="rechteck" />
      <ShapeInfo shapeId="rechteck" />
      <MoreShapes currentId="rechteck" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
