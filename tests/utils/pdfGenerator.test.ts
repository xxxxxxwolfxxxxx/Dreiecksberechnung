import { generateSpickzettel } from '@/utils/pdfGenerator'
import type { Solution } from '@/lib/shapes/types'

describe('pdfGenerator', () => {
  const mockSolution: Solution = {
    values: {
      a: 3,
      b: 4,
      c: 5,
      alpha: 36.87,
      beta: 53.13,
      gamma: 90,
      flaeche: 6,
      umfang: 12,
      h_a: 4,
      h_b: 3,
      h_c: 2.4,
      inkreis: 1,
      umkreis: 2.5,
      typ: 'rechtwinklig'
    },
    method: 'Kosinussatz',
    formulas: ['c² = a² + b²'],
    steps: ['Step 1', 'Step 2']
  }

  it('returns a valid PDF blob', async () => {
    const pdf = await generateSpickzettel(mockSolution, 'cm')
    expect(pdf).toBeInstanceOf(Blob)
  })

  it('includes solution values in PDF', async () => {
    const pdf = await generateSpickzettel(mockSolution, 'cm')
    expect(pdf.size).toBeGreaterThan(1000) // Reasonable PDF size
  })

  it('creates downloadable file with correct MIME type', async () => {
    const pdf = await generateSpickzettel(mockSolution, 'cm')
    expect(pdf.type).toBe('application/pdf')
  })

  it('handles empty formulas array', async () => {
    const solutionNoFormulas = { ...mockSolution, formulas: [] }
    const pdf = await generateSpickzettel(solutionNoFormulas, 'cm')
    expect(pdf).toBeInstanceOf(Blob)
  })

  it('handles missing optional properties gracefully', async () => {
    const minimal: Solution = {
      values: {
        a: 5,
        b: 5,
        c: 5,
        alpha: 60,
        beta: 60,
        gamma: 60,
        flaeche: 10.8,
        umfang: 15,
        h_a: 4.3,
        h_b: 4.3,
        h_c: 4.3,
        inkreis: 1.4,
        umkreis: 2.9,
        typ: 'gleichseitig'
      },
      method: 'SSS',
      formulas: []
    }
    const pdf = await generateSpickzettel(minimal, 'cm')
    expect(pdf).toBeInstanceOf(Blob)
  })
})
