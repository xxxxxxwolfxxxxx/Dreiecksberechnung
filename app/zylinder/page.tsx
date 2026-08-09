import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Zylinder berechnen – Volumen, Oberfläche, Mantelfläche online',
  description: 'Zylinder online berechnen: Volumen, Mantelfläche und Oberfläche aus Radius und Höhe. Mit Schritt-für-Schritt-Erklärung.',
}

export default function ZylinderPage() {
  return (
    <>
      <RechnerSchema
        name="Zylinder berechnen"
        description="Zylinder online berechnen: Volumen, Mantelfläche und Oberfläche aus Radius und Höhe."
        path="/zylinder"
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="zylinder" />
      <ShapeInfo shapeId="zylinder" />
      <MoreShapes currentId="zylinder" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
