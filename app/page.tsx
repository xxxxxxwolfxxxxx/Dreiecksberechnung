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
      <AdSlot slot="1508045799" format="horizontal" minHeight={90} />
      <ShapeCalculator shapeId="dreieck" />
      <ShapeInfo shapeId="dreieck" />

      <nav aria-labelledby="themen-heading" className="rounded-[22px] bg-white border border-line p-6 sm:px-7 flex flex-col gap-3">
        <div>
          <h2 id="themen-heading" className="text-xl font-bold tracking-tight mb-1">
            Einzelne Größen gezielt berechnen
          </h2>
          <p className="text-sm text-ink-2">
            Du suchst nur eine bestimmte Größe? Diese Seiten erklären den jeweiligen Rechenweg im Detail.
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DREIECK_THEMEN.map(thema => (
            <li key={thema.id}>
              <Link
                href={`/${thema.id}`}
                className="flex h-full justify-between gap-3 rounded-[14px] border border-line px-4 py-3 !text-ink !no-underline transition-colors hover:border-brand-600 hover:bg-brand-50"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{thema.linkText}</span>
                  <span className="text-[13px] text-ink-3">{thema.linkBeschreibung}</span>
                </span>
                <span className="font-mono text-brand-600">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <DreieckFaq />

      <MoreShapes currentId="dreieck" />
      <AdSlot slot="4403201248" format="horizontal" minHeight={90} />
    </>
  )
}
