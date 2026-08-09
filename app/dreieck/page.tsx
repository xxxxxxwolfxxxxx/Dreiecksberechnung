import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Dreieck berechnen – Fläche, Umfang, Winkel online',
  description: 'Dreieck online berechnen: Fläche, Umfang, alle Winkel, Höhen und Radien. Alle Formeln erklärt. Kostenlos und ohne Anmeldung.',
}

export default function DreieckPage() {
  return (
    <>
      <RechnerSchema
        name="Dreieck berechnen"
        description="Dreieck online berechnen: Fläche, Umfang, alle Winkel, Höhen und Radien."
        path="/dreieck"
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="dreieck" />
      <ShapeInfo shapeId="dreieck" />
      <MoreShapes currentId="dreieck" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
