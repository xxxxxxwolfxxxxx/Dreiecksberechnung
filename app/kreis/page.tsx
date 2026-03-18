import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { shapeList } from '@/lib/shapes'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kreis berechnen – Radius, Fläche, Umfang online',
  description: 'Kreis online berechnen: Radius, Durchmesser, Fläche und Umfang. Alle Formeln erklärt.',
}

export default function KreisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Kreis berechnen",
            "description": "Kreis online berechnen: Radius, Durchmesser, Fläche und Umfang.",
            "url": "https://geometrie-rechner.de/kreis",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="kreis" />
      <AdSlot slot="7625380516" format="auto" className="my-6" minHeight={90} />
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Weitere Formen berechnen</h2>
        <div className="flex flex-wrap gap-2">
          {shapeList.filter(s => s.id !== 'kreis').map(s => (
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
