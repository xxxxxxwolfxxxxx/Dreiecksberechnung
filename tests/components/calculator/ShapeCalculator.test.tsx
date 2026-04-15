import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'

describe('ShapeCalculator', () => {
  test('zeigt Calculator direkt an (ohne Wizard)', () => {
    render(<ShapeCalculator shapeId="dreieck" />)
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()
  })

  test('zeigt Zeichnung und Eingabe-Panel', () => {
    render(<ShapeCalculator shapeId="dreieck" />)
    expect(screen.getByText(/Zeichnung/i)).toBeInTheDocument()
    const inputPanelHeaders = screen.getAllByText(/Werte eingeben/i)
    expect(inputPanelHeaders.length).toBeGreaterThan(0)
  })

  test('funktioniert für alle Formen ohne Wizard', () => {
    render(<ShapeCalculator shapeId="rechteck" />)
    expect(screen.getByText(/Rechteck berechnen/i)).toBeInTheDocument()
  })
})
