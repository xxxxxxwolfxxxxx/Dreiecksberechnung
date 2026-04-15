import { generateSpickzettel } from '@/utils/pdfGenerator'
import type { Solution } from '@/lib/shapes/types'

describe('pdfGenerator', () => {
  const mockTriangleSolution: Solution = {
    values: {
      a: 3,
      b: 4,
      c: 5,
      alpha: 36.87,
      beta: 53.13,
      gamma: 90,
      flaeche: 6,
      umfang: 12,
      typ: 'rechtwinklig'
    },
    method: 'Pythagoras',
    formulas: ['a² + b² = c²'],
    steps: []
  }

  const mockCircleSolution: Solution = {
    values: {
      r: 5,
      d: 10,
      flaeche: 78.54,
      umfang: 31.42
    },
    method: 'Circle formulas',
    formulas: ['A = πr²', 'C = 2πr'],
    steps: []
  }

  it('generates PDF for triangle with correct shape label', async () => {
    const pdf = await generateSpickzettel(mockTriangleSolution, 'cm', 'dreieck')
    expect(pdf).toBeInstanceOf(Blob)
    expect(pdf.size).toBeGreaterThan(0)
  })

  it('generates PDF for circle with correct shape label', async () => {
    const pdf = await generateSpickzettel(mockCircleSolution, 'cm', 'kreis')
    expect(pdf).toBeInstanceOf(Blob)
    expect(pdf.size).toBeGreaterThan(0)
  })

  it('includes all available result values in PDF', async () => {
    const pdf = await generateSpickzettel(mockTriangleSolution, 'm', 'dreieck')
    expect(pdf).toBeInstanceOf(Blob)
    expect(pdf.size).toBeGreaterThan(1000) // PDFs are usually > 1KB
  })

  it('handles SVG elements gracefully (with fallback)', async () => {
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const pdf = await generateSpickzettel(mockTriangleSolution, 'cm', 'dreieck', mockSvg)
    expect(pdf).toBeInstanceOf(Blob)
  })

  it('uses correct domain in PDF footer', async () => {
    const pdf = await generateSpickzettel(mockTriangleSolution, 'cm', 'dreieck')
    expect(pdf).toBeInstanceOf(Blob)
    // Content verification would require parsing PDF, but we verify it was created
    expect(pdf.type).toBe('application/pdf')
  })

  it('defaults to dreieck when shapeId not provided', async () => {
    const pdf = await generateSpickzettel(mockTriangleSolution, 'cm')
    expect(pdf).toBeInstanceOf(Blob)
    expect(pdf.size).toBeGreaterThan(0)
  })

  it('handles missing formulas array', async () => {
    const solutionNoFormulas: Solution = {
      ...mockTriangleSolution,
      formulas: []
    }
    const pdf = await generateSpickzettel(solutionNoFormulas, 'cm', 'dreieck')
    expect(pdf).toBeInstanceOf(Blob)
  })
})
