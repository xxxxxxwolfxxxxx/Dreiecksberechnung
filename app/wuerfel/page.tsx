import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { shapeList } from '@/lib/shapes'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Würfel berechnen – Volumen, Oberfläche, Diagonale online',
  description: 'Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale und Flächendiagonale. Alle Formeln mit Schritt-für-Schritt-Erklärung.',
}

export default function WuerfelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Würfel berechnen",
            "description": "Würfel online berechnen: Volumen, Oberfläche, Raumdiagonale.",
            "url": "https://dreieck-berechnen.de/wuerfel",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="wuerfel" />
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Weitere Formen berechnen</h2>
        <div className="flex flex-wrap gap-2">
          {shapeList.filter(s => s.id !== 'wuerfel').map(s => (
            <Link key={s.id} href={`/${s.id}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
              {s.label}
            </Link>
          ))}
        </div>
      </section>
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
