'use client'

import { useState } from 'react'
import { generateSpickzettel, downloadPDF } from '@/utils/pdfGenerator'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
  onExport?: () => void
}

export function SpickzettelExport({ solution, onExport }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const pdf = await generateSpickzettel(solution, 'cm')
      downloadPDF(pdf, `dreieck-spickzettel-${Date.now()}.pdf`)
      onExport?.()
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 18m-9-18L3 7m6 0v0m0 0h6m0 0v12m0-12H9"
        />
      </svg>
      {isLoading ? 'Wird erstellt...' : '📥 Spickzettel herunterladen'}
    </button>
  )
}
