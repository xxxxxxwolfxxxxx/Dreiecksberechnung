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
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleExport}
        disabled={isLoading}
        aria-label="PDF Spickzettel herunterladen"
        aria-busy={isLoading}
        className="flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        <span aria-hidden="true" className="font-mono">↓</span>
        {isLoading ? 'Wird erstellt …' : 'Spickzettel herunterladen'}
      </button>
      {error && (
        <div className="rounded-[10px] border border-[#f3cccc] bg-[#fdf2f2] px-3 py-2 text-[13px] text-[#8f1f1f]">
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
