import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Kegel berechnen – Volumen, Mantelfläche, Oberfläche',
  description: 'Kegel online berechnen: Volumen, Mantelfläche, Mantellinie und Oberfläche aus Radius und Höhe – mit Rechenweg Schritt für Schritt.',
}

export default function KegelPage() {
  return (
    <>
      <RechnerSchema
        name="Kegel berechnen"
        description="Kegel online berechnen: Volumen, Mantelfläche, Mantellinie und Oberfläche."
        path="/kegel"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kegel" />
      <ShapeInfo shapeId="kegel" />
      <MoreShapes currentId="kegel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
