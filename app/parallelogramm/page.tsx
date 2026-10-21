import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Parallelogramm berechnen – Fläche, Umfang, Winkel',
  description: 'Parallelogramm online berechnen: Fläche, Umfang, Winkel und beide Diagonalen aus Seiten und Höhe – mit Rechenweg und Skizze.',
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
      <ShapeCalculator shapeId="parallelogramm" />
      <AdSlot slot="1508045799" format="horizontal" />
      <ShapeInfo shapeId="parallelogramm" />
      <MoreShapes currentId="parallelogramm" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" />
    </>
  )
}
