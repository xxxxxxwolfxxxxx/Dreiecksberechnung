import type { Metadata } from 'next'
import Link from 'next/link'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'

export const metadata: Metadata = {
  title: 'Quader berechnen – Volumen, Oberfläche, Raumdiagonale',
  description: 'Quader online berechnen: Volumen, Oberfläche und Raumdiagonale aus Länge, Breite und Höhe. Auch der richtige Rechner, wenn du das Volumen eines rechteckigen Körpers suchst.',
}

export default function QuaderPage() {
  return (
    <>
      <RechnerSchema
        name="Quader berechnen"
        description="Quader online berechnen: Volumen, Oberfläche, Raumdiagonale."
        path="/quader"
        matheThemen={['Geometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="quader" />
      <ShapeInfo shapeId="quader" />

      {/*
        Laut Search Console landen Suchanfragen wie „volumen berechnen rechteck“
        oder „volumen rechteck“ auf dieser Seite. Der Abschnitt greift die
        Formulierung auf und raeumt die Verwechslung Rechteck/Quader auf,
        statt die Nutzer raten zu lassen.
      */}
      <section aria-labelledby="rechteck-heading" className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 id="rechteck-heading" className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
          Volumen vom Rechteck berechnen – das ist der Quader
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Wer nach dem &bdquo;Volumen eines Rechtecks&ldquo; sucht, meint fast immer einen rechteckigen
          Körper – also genau diesen Quader. Ein Rechteck selbst ist flach: Es hat nur Länge
          und Breite und damit eine Fläche, aber kein Volumen. Sobald eine dritte Angabe
          dazukommt – die Höhe oder Tiefe –, wird aus dem Rechteck ein Quader, und der hat ein
          Volumen.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Praktisch heisst das: Nimm die Grundfläche deines Rechtecks und multipliziere sie mit
          der Höhe. Ein Beet von 2,00 m × 1,50 m, das 20 cm hoch mit Erde gefüllt werden soll,
          fasst also 2,00 · 1,50 · 0,20 = 0,60 m³ – das sind 600 Liter Erde. Trag die drei Werte
          einfach oben in den Rechner ein.
        </p>
        <p className="text-slate-500 text-sm">
          Brauchst du nur die Fläche und nicht das Volumen, ist der{' '}
          <Link href="/rechteck" className="font-semibold text-indigo-600 hover:underline">
            Rechteck-Rechner
          </Link>{' '}
          der richtige. Sind alle drei Kanten gleich lang, führt der{' '}
          <Link href="/wuerfel" className="font-semibold text-indigo-600 hover:underline">
            Würfel-Rechner
          </Link>{' '}
          schneller zum Ziel.
        </p>
      </section>

      <MoreShapes currentId="quader" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
