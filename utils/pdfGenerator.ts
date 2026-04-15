import jsPDF from 'jspdf'
import type { Solution } from '@/lib/shapes/types'

// PDF Layout Constants
const PDF_MARGIN_TOP = 20
const PDF_MARGIN_SIDE = 20
const PDF_MARGIN_BOTTOM = 20
const PDF_TITLE_SIZE = 20
const PDF_TITLE_SPACING = 15
const PDF_SUBTITLE_SIZE = 12
const PDF_HEADING_SIZE = 12
const PDF_CONTENT_SIZE = 10
const PDF_SMALL_SIZE = 9
const PDF_FOOTER_SIZE = 8
const PDF_LINE_SPACING = 7
const PDF_FOOTER_BUFFER = 10
const PAGE_BREAK_THRESHOLD_STANDARD = 20
const PAGE_BREAK_THRESHOLD_LARGE = 40

export async function generateSpickzettel(
  solution: Solution,
  unit: string
): Promise<Blob> {
  const doc = new jsPDF()
  doc.setProperties({
    title: 'Dreieck Spickzettel',
    author: 'Geometrie-Rechner'
  })
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = PDF_MARGIN_TOP

  // Title
  doc.setFontSize(PDF_TITLE_SIZE)
  doc.text('Dreieck Spickzettel', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += PDF_TITLE_SPACING

  // Dreieck-Typ
  doc.setFontSize(PDF_SUBTITLE_SIZE)
  doc.setTextColor(100, 100, 100)
  doc.text(
    `Typ: ${solution.values.typ.charAt(0).toUpperCase() + solution.values.typ.slice(1)}`,
    PDF_MARGIN_SIDE,
    yPosition
  )
  yPosition += PDF_FOOTER_BUFFER

  // Main results
  doc.setFontSize(PDF_HEADING_SIZE)
  doc.setTextColor(0, 0, 0)
  doc.text('Ergebnisse:', PDF_MARGIN_SIDE, yPosition)
  yPosition += PDF_LINE_SPACING

  const results = [
    `Fläche: ${(solution.values.flaeche as number).toFixed(2)} ${unit}²`,
    `Umfang: ${(solution.values.umfang as number).toFixed(2)} ${unit}`,
    `a = ${(solution.values.a as number).toFixed(2)} ${unit}`,
    `b = ${(solution.values.b as number).toFixed(2)} ${unit}`,
    `c = ${(solution.values.c as number).toFixed(2)} ${unit}`,
    `α = ${(solution.values.alpha as number).toFixed(1)}°`,
    `β = ${(solution.values.beta as number).toFixed(1)}°`,
    `γ = ${(solution.values.gamma as number).toFixed(1)}°`
  ]

  doc.setFontSize(PDF_CONTENT_SIZE)
  results.forEach((result) => {
    if (yPosition > pageHeight - PAGE_BREAK_THRESHOLD_STANDARD) {
      doc.addPage()
      yPosition = PDF_MARGIN_TOP
    }
    doc.text(result, PDF_MARGIN_SIDE + 10, yPosition)
    yPosition += PDF_LINE_SPACING
  })

  yPosition += 5

  // Method & formulas
  if (yPosition > pageHeight - PAGE_BREAK_THRESHOLD_LARGE) {
    doc.addPage()
    yPosition = PDF_MARGIN_TOP
  }

  doc.setFontSize(PDF_HEADING_SIZE)
  doc.text('Berechnungsmethode:', PDF_MARGIN_SIDE, yPosition)
  yPosition += PDF_LINE_SPACING
  doc.setFontSize(PDF_CONTENT_SIZE)
  doc.text(solution.method, PDF_MARGIN_SIDE + 5, yPosition)
  yPosition += PDF_FOOTER_BUFFER

  if (solution.formulas?.length > 0) {
    doc.setFontSize(PDF_HEADING_SIZE)
    doc.text('Formeln:', PDF_MARGIN_SIDE, yPosition)
    yPosition += PDF_LINE_SPACING
    doc.setFontSize(PDF_SMALL_SIZE)
    solution.formulas.forEach((formula) => {
      if (yPosition > pageHeight - PAGE_BREAK_THRESHOLD_STANDARD) {
        doc.addPage()
        yPosition = PDF_MARGIN_TOP
      }
      doc.text(`• ${formula}`, PDF_MARGIN_SIDE + 5, yPosition)
      yPosition += PDF_SMALL_SIZE
    })
  }

  // Footer
  doc.setFontSize(PDF_FOOTER_SIZE)
  doc.setTextColor(150, 150, 150)
  doc.text('Erstellt mit geometrie-rechner.de', pageWidth / 2, pageHeight - PDF_FOOTER_BUFFER, {
    align: 'center'
  })

  // Convert to Blob
  const blob = doc.output('blob')
  if (blob instanceof Promise) {
    return await blob
  }
  return blob as Blob
}

/** @client - Browser-only function for downloading PDFs */
export function downloadPDF(
  blob: Blob,
  filename: string = 'dreieck-spickzettel.pdf'
): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
