import jsPDF from 'jspdf'
import type { Solution } from '@/lib/shapes/types'

export async function generateSpickzettel(
  solution: Solution,
  unit: string
): Promise<Blob> {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Title
  doc.setFontSize(20)
  doc.text('Dreieck Spickzettel', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Dreieck-Typ
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  const triangleType = String(solution.values.typ)
  const formattedType = triangleType.charAt(0).toUpperCase() + triangleType.slice(1)
  doc.text(`Typ: ${formattedType}`, 20, yPosition)
  yPosition += 10

  // Main results
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Ergebnisse:', 20, yPosition)
  yPosition += 8

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

  doc.setFontSize(10)
  results.forEach((result) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(result, 30, yPosition)
    yPosition += 7
  })

  yPosition += 5

  // Method & formulas
  if (yPosition > pageHeight - 40) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(12)
  doc.text('Berechnungsmethode:', 20, yPosition)
  yPosition += 7
  doc.setFontSize(10)
  doc.text(solution.method, 25, yPosition)
  yPosition += 10

  if (solution.formulas && solution.formulas.length > 0) {
    doc.setFontSize(12)
    doc.text('Formeln:', 20, yPosition)
    yPosition += 7
    doc.setFontSize(9)
    solution.formulas.forEach((formula) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`• ${formula}`, 25, yPosition)
      yPosition += 6
    })
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Erstellt mit geometrie-rechner.de', pageWidth / 2, pageHeight - 10, {
    align: 'center'
  })

  // Convert to Blob
  const blob = doc.output('blob')
  if (blob instanceof Promise) {
    return await blob
  }
  return blob as Blob
}

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
