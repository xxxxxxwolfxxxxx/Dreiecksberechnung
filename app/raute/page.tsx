import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Raute berechnen – Fläche, Diagonalen, Umfang online',
  description: 'Raute (Rhombus) online berechnen: Fläche, beide Diagonalen, Winkel und Umfang aus zwei bekannten Werten – mit Rechenweg und Skizze.',
}

export default function RautePage() {
  return (
    <>
      <RechnerSchema
        name="Raute berechnen"
        description="Raute (Rhombus) online berechnen: Fläche, Diagonalen, Winkel und Umfang."
        path="/raute"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="raute" />
      <ShapeInfo shapeId="raute" />
      <MoreShapes currentId="raute" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
