import type { Metadata } from 'next'
import Link from 'next/link'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { DreieckFaq } from '@/components/DreieckFaq'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { ShapeInfo } from '@/components/ShapeInfo'
import { DREIECK_THEMEN } from '@/lib/dreieck-themen'

export const metadata: Metadata = {
  title: 'Dreieck berechnen – Fläche, Umfang & Winkel online',
  description: 'Dreieck online berechnen: aus drei bekannten Werten sofort Fläche, Umfang, alle Winkel, Höhen und Radien – mit Rechenweg und Skizze. Kostenlos, ohne Anmeldung.',
}

export default function StartseiteDreieck() {
  return (
    <>
      <RechnerSchema
        name="Dreieck berechnen"
        description="Dreieck online berechnen: Fläche, Umfang, alle Winkel, Höhen und Radien."
        path="/"
        matheThemen={['Geometry', 'Trigonometry']}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="dreieck" />
      <ShapeInfo shapeId="dreieck" />

      <nav aria-labelledby="themen-heading" className="rounded-2xl bg-white border border-indigo-100 shadow-sm p-5">
        <h2 id="themen-heading" className="text-lg font-black text-slate-800 mb-1 tracking-tight">
          Einzelne Größen gezielt berechnen
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Du suchst nur eine bestimmte Größe? Diese Seiten erklären den jeweiligen Rechenweg im Detail.
        </p>
        <ul className="space-y-2">
          {DREIECK_THEMEN.map(thema => (
            <li key={thema.id}>
              <Link
                href={`/${thema.id}`}
                className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800">{thema.linkText}</span>
                <span className="block text-sm text-slate-500">{thema.linkBeschreibung}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <DreieckFaq />

      <MoreShapes currentId="dreieck" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
