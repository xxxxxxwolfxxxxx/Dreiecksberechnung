import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'

describe('ShapeCalculator', () => {
  test('zeigt ModeSelector UND Calculator initial an (bei Dreieck)', () => {
    render(<ShapeCalculator shapeId="dreieck" />)
    // ModeSelector sollte sichtbar sein
    expect(screen.getByText(/Was kennst du von deinem Dreieck/i)).toBeInTheDocument()
    // Calculator sollte AUCH sichtbar sein (mit Zeichnung + Titel)
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()
  })

  test('zeigt Calculator nach Mode-Auswahl an und versteckt ModeSelector', () => {
    render(<ShapeCalculator shapeId="dreieck" />)

    // Beide sollten initial sichtbar sein
    expect(screen.getByText(/Was kennst du von deinem Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()

    // Klick auf eine Mode (z.B. SSS)
    const sssButton = screen.getByText(/Alle 3 Seiten/i)
    fireEvent.click(sssButton)

    // Nach dem Klick sollte der Calculator-Titel immer noch sichtbar sein
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()

    // ModeSelector sollte nicht mehr sichtbar sein
    expect(screen.queryByText(/Was kennst du von deinem Dreieck/i)).not.toBeInTheDocument()
  })

  test('zeigt Calculator für andere Formen (ohne ModeSelector) an', () => {
    render(<ShapeCalculator shapeId="rechteck" />)

    // Calculator sollte sichtbar sein
    expect(screen.getByText(/Rechteck berechnen/i)).toBeInTheDocument()

    // ModeSelector sollte NICHT sichtbar sein (nur bei Dreieck)
    expect(screen.queryByText(/Was kennst du von deinem Dreieck/i)).not.toBeInTheDocument()
  })
})
