import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { shapeList } from '@/lib/shapes'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trapez berechnen – Fläche, Umfang, Höhe',
  description: 'Trapez online berechnen: Fläche, Umfang und Höhe aus verschiedenen Eingabe-Kombinationen.',
}

export default function TrapezPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Trapez berechnen",
            "description": "Trapez online berechnen: Fläche, Umfang und Höhe.",
            "url": "https://geometrie-rechner.de/trapez",
            "educationalLevel": "secondary",
            "inLanguage": "de",
            "applicationCategory": "EducationalApplication"
          })
        }}
      />
      <AdSlot slot="XXXXXXXXXX" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="trapez" />
      <AdSlot slot="XXXXXXXXXX" format="rectangle" className="my-6" minHeight={250} />
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Weitere Formen berechnen</h2>
        <div className="flex flex-wrap gap-2">
          {shapeList.filter(s => s.id !== 'trapez').map(s => (
            <Link key={s.id} href={`/${s.id}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
