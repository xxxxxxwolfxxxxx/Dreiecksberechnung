import type { Metadata } from 'next'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { shapeList } from '@/lib/shapes'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pyramide berechnen – Volumen, Oberfläche, Mantelfläche online',
  description: 'Pyramide (quadratisch) online berechnen: Volumen, Mantelfläche und Oberfläche aus Grundkante und Höhe. Mit Schritt-für-Schritt-Erklärung.',
}

export default function PyramidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            "name": "Pyramide berechnen",
            "description": "Quadratische Pyramide online berechnen: Volumen, Mantelfläche und Oberfläche.",
            "url": "https://dreieck-berechnen.de/pyramide",
            "educationalLevel": "secondary",
            "inLanguage": "de",
          })
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <ShapeCalculator shapeId="pyramide" />
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Weitere Formen berechnen</h2>
        <div className="flex flex-wrap gap-2">
          {shapeList.filter(s => s.id !== 'pyramide').map(s => (
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
