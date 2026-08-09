import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Parallelogramm berechnen – Fläche, Umfang, Winkel',
  description: 'Parallelogramm online berechnen: Fläche, Umfang, Winkel und Diagonalen.',
}

export default function ParallelogrammPage() {
  return (
    <>
      <RechnerSchema
        name="Parallelogramm berechnen"
        description="Parallelogramm online berechnen: Fläche, Umfang, Winkel und Diagonalen."
        path="/parallelogramm"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="parallelogramm" />
      <ShapeInfo shapeId="parallelogramm" />
      <MoreShapes currentId="parallelogramm" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
