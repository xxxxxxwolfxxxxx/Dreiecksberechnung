import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Kugel berechnen – Volumen, Oberfläche, Radius online',
  description: 'Kugel online berechnen: Volumen und Oberfläche aus Radius oder Durchmesser. Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function KugelPage() {
  return (
    <>
      <RechnerSchema
        name="Kugel berechnen"
        description="Kugel online berechnen: Volumen und Oberfläche aus Radius oder Durchmesser."
        path="/kugel"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kugel" />
      <ShapeInfo shapeId="kugel" />
      <MoreShapes currentId="kugel" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
