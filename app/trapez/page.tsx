import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Trapez berechnen – Fläche, Umfang, Höhe',
  description: 'Trapez online berechnen: Fläche, Umfang und Höhe aus verschiedenen Eingabe-Kombinationen.',
}

export default function TrapezPage() {
  return (
    <>
      <RechnerSchema
        name="Trapez berechnen"
        description="Trapez online berechnen: Fläche, Umfang und Höhe."
        path="/trapez"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="trapez" />
      <ShapeInfo shapeId="trapez" />
      <MoreShapes currentId="trapez" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
