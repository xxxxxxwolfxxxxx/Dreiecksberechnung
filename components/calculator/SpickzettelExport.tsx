'use client'

import { useState } from 'react'
import { generateSpickzettel, downloadPDF } from '@/utils/pdfGenerator'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
  shapeId: string
  svgElement?: SVGElement | null
  onExport?: () => void
}

export function SpickzettelExport({ solution, shapeId, svgElement, onExport }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Get the SVG element from the DOM if not provided
      let svg = svgElement
      if (!svg) {
        const svgContainer = document.querySelector('svg[data-shape-drawing]')
        if (svgContainer instanceof SVGElement) {
          svg = svgContainer
        }
      }

      const pdf = await generateSpickzettel(solution, 'cm', shapeId, svg || undefined)
      const shapeLabel = getShapeLabel(shapeId)
      downloadPDF(pdf, `${shapeLabel.toLowerCase()}-spickzettel-${Date.now()}.pdf`)
      onExport?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PDF konnte nicht erstellt werden'
      setError(message)
      console.error('PDF generation failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={handleExport}
        disabled={isLoading}
        aria-label="PDF Spickzettel herunterladen"
        aria-busy={isLoading}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 18m-9-18L3 7m6 0v0m0 0h6m0 0v12m0-12H9"
          />
        </svg>
        {isLoading ? 'Wird erstellt...' : 'Spickzettel herunterladen'}
      </button>
      {error && (
        <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          Fehler: {error}
        </div>
      )}
    </div>
  )
}

function getShapeLabel(shapeId: string): string {
  const labels: Record<string, string> = {
    dreieck: 'Dreieck',
    kreis: 'Kreis',
    rechteck: 'Rechteck',
    trapez: 'Trapez',
    parallelogramm: 'Parallelogramm',
    raute: 'Raute',
    wuerfel: 'Würfel',
    quader: 'Quader',
    kugel: 'Kugel',
    zylinder: 'Zylinder',
    kegel: 'Kegel',
    pyramide: 'Pyramide'
  }
  return labels[shapeId] || 'Form'
}
