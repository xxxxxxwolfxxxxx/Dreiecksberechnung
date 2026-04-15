import { render, screen } from '@testing-library/react'
import { DeepExplanation } from '@/components/calculator/DeepExplanation'
import type { Solution } from '@/lib/shapes/types'

describe('DeepExplanation', () => {
  const mockRightTriangleSolution: Solution = {
    values: {
      a: 3, b: 4, c: 5,
      alpha: 36.87, beta: 53.13, gamma: 90,
      flaeche: 6, umfang: 12,
      h_a: 4, h_b: 3, h_c: 2.4,
      inkreis: 1, umkreis: 2.5,
      typ: 'rechtwinklig'
    },
    method: 'Kosinussatz',
    formulas: ['c² = a² + b²'],
    steps: []
  }

  const mockEqualTriangleSolution: Solution = {
    values: {
      a: 5, b: 5, c: 5,
      alpha: 60, beta: 60, gamma: 60,
      flaeche: 10.825, umfang: 15,
      h_a: 4.33, h_b: 4.33, h_c: 4.33,
      inkreis: 1.44, umkreis: 2.89,
      typ: 'gleichseitig'
    },
    method: 'SSS',
    formulas: [],
    steps: []
  }

  it('rendert Deep Explanation für rechtwinkliges Dreieck', () => {
    render(<DeepExplanation solution={mockRightTriangleSolution} />)
    expect(screen.getByText(/Das rechtwinklige Dreieck/i)).toBeInTheDocument()
    const headings = screen.getAllByRole('heading')
    expect(headings.some(h => h.textContent?.includes('Der Satz des Pythagoras'))).toBe(true)
  })

  it('zeigt Pythagoras-Berechnung mit konkreten Zahlen', () => {
    render(<DeepExplanation solution={mockRightTriangleSolution} />)
    expect(screen.getByText(/3² \+ 4² = 5/i)).toBeInTheDocument()
  })

  it('rendert Deep Explanation für gleichseitiges Dreieck', () => {
    render(<DeepExplanation solution={mockEqualTriangleSolution} />)
    expect(screen.getByText(/Das gleichseitige Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/Symmetrieachsen/i)).toBeInTheDocument()
  })

  it('hat mehrere Sections mit Überschriften', () => {
    render(<DeepExplanation solution={mockRightTriangleSolution} />)
    expect(screen.getByText(/Was ist ein rechtwinkliges Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/Praktische Anwendungen/i)).toBeInTheDocument()
    expect(screen.getByText(/Flächen- und Umfangsberechnung/i)).toBeInTheDocument()
  })

  it('zeigt Merksatz am Ende', () => {
    render(<DeepExplanation solution={mockRightTriangleSolution} />)
    expect(screen.getByText(/Merksatz/i)).toBeInTheDocument()
  })
})
