import jsPDF from 'jspdf'
import type { Solution } from '@/lib/shapes/types'
import { svgElementToImageData } from './svgToImage'

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

// Shape metadata for PDF titles and descriptions
const SHAPE_LABELS: Record<string, string> = {
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

export async function generateSpickzettel(
  solution: Solution,
  unit: string,
  shapeId: string = 'dreieck',
  svgElement?: SVGElement
): Promise<Blob> {
  const doc = new jsPDF()
  const shapeLabel = SHAPE_LABELS[shapeId] || 'Form'

  doc.setProperties({
    title: `${shapeLabel} Spickzettel`,
    author: 'Geometrie-Rechner'
  })

  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = PDF_MARGIN_TOP

  // Title
  doc.setFontSize(PDF_TITLE_SIZE)
  doc.text(`${shapeLabel} Spickzettel`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += PDF_TITLE_SPACING

  // SVG Drawing (if provided)
  if (svgElement) {
    if (yPosition > pageHeight - 120) {
      doc.addPage()
      yPosition = PDF_MARGIN_TOP
    }

    try {
      const imageData = await svgElementToImageData(svgElement, 150, 150)
      // Center the image
      const imgX = (pageWidth - 150) / 2
      doc.addImage(imageData, 'PNG', imgX, yPosition, 150, 150)
      yPosition += 160
    } catch (error) {
      console.warn('Failed to embed SVG in PDF:', error)
      // Continue without image
    }
  }

  // Shape Type (if available)
  if (solution.values.typ) {
    doc.setFontSize(PDF_SUBTITLE_SIZE)
    doc.setTextColor(100, 100, 100)
    const typStr = String(solution.values.typ)
    doc.text(
      `Typ: ${typStr.charAt(0).toUpperCase() + typStr.slice(1)}`,
      PDF_MARGIN_SIDE,
      yPosition
    )
    yPosition += PDF_FOOTER_BUFFER
  }

  // Results section
  doc.setFontSize(PDF_HEADING_SIZE)
  doc.setTextColor(0, 0, 0)
  doc.text('Ergebnisse:', PDF_MARGIN_SIDE, yPosition)
  yPosition += PDF_LINE_SPACING

  // Build results based on available values
  const results: string[] = []

  if (solution.values.flaeche !== undefined) {
    results.push(`Fläche: ${(solution.values.flaeche as number).toFixed(2)} ${unit}²`)
  }
  if (solution.values.oberflaeche !== undefined) {
    results.push(`Oberfläche: ${(solution.values.oberflaeche as number).toFixed(2)} ${unit}²`)
  }
  if (solution.values.volumen !== undefined) {
    results.push(`Volumen: ${(solution.values.volumen as number).toFixed(2)} ${unit}³`)
  }
  if (solution.values.umfang !== undefined) {
    results.push(`Umfang: ${(solution.values.umfang as number).toFixed(2)} ${unit}`)
  }

  // Add side lengths
  if (solution.values.a !== undefined) {
    results.push(`a = ${(solution.values.a as number).toFixed(2)} ${unit}`)
  }
  if (solution.values.b !== undefined) {
    results.push(`b = ${(solution.values.b as number).toFixed(2)} ${unit}`)
  }
  if (solution.values.c !== undefined) {
    results.push(`c = ${(solution.values.c as number).toFixed(2)} ${unit}`)
  }
  if (solution.values.d !== undefined) {
    results.push(`d = ${(solution.values.d as number).toFixed(2)} ${unit}`)
  }
  if (solution.values.h !== undefined) {
    results.push(`h = ${(solution.values.h as number).toFixed(2)} ${unit}`)
  }
  if (solution.values.r !== undefined) {
    results.push(`r = ${(solution.values.r as number).toFixed(2)} ${unit}`)
  }

  // Add angles
  if (solution.values.alpha !== undefined) {
    results.push(`α = ${(solution.values.alpha as number).toFixed(1)}°`)
  }
  if (solution.values.beta !== undefined) {
    results.push(`β = ${(solution.values.beta as number).toFixed(1)}°`)
  }
  if (solution.values.gamma !== undefined) {
    results.push(`γ = ${(solution.values.gamma as number).toFixed(1)}°`)
  }

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

  // Footer with correct domain
  doc.setFontSize(PDF_FOOTER_SIZE)
  doc.setTextColor(150, 150, 150)
  doc.text('Erstellt mit dreieck-berechnen.de', pageWidth / 2, pageHeight - PDF_FOOTER_BUFFER, {
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
  filename: string = 'spickzettel.pdf'
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
