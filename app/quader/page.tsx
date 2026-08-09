import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Quader berechnen – Volumen, Oberfläche, Raumdiagonale online',
  description: 'Quader online berechnen: Volumen, Oberfläche und Raumdiagonale. Mit Schritt-für-Schritt-Erklärung für Schüler.',
}

export default function QuaderPage() {
  return (
    <>
      <RechnerSchema
        name="Quader berechnen"
        description="Quader online berechnen: Volumen, Oberfläche, Raumdiagonale."
        path="/quader"
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="quader" />
      <ShapeInfo shapeId="quader" />
      <MoreShapes currentId="quader" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
