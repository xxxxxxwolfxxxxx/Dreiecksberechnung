import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'

describe('ShapeCalculator', () => {
  test('zeigt ModeSelector auf initialem Load an', () => {
    render(<ShapeCalculator shapeId="dreieck" />)
    expect(screen.getByText(/Was kennst du von deinem Dreieck/i)).toBeInTheDocument()
  })

  test('zeigt Calculator-Content nach Mode-Auswahl an', () => {
    render(<ShapeCalculator shapeId="dreieck" />)

    // ModeSelector sollte sichtbar sein
    expect(screen.getByText(/Was kennst du von deinem Dreieck/i)).toBeInTheDocument()

    // Klick auf eine Mode (z.B. SSS)
    const sssButton = screen.getByText(/Alle 3 Seiten/i)
    fireEvent.click(sssButton)

    // Nach dem Klick sollte der Calculator-Titel sichtbar sein
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()

    // ModeSelector sollte nicht mehr sichtbar sein
    expect(screen.queryByText(/Was kennst du von deinem Dreieck/i)).not.toBeInTheDocument()
  })

  test('zeigt Titel "Dreieck berechnen" nach Selection an', () => {
    render(<ShapeCalculator shapeId="dreieck" />)

    // Titel sollte nicht initial sichtbar sein
    expect(screen.queryByText(/Dreieck berechnen/i)).not.toBeInTheDocument()

    // Mode auswählen
    fireEvent.click(screen.getByText(/Weiß nicht/i))

    // Titel sollte jetzt sichtbar sein
    expect(screen.getByText(/Dreieck berechnen/i)).toBeInTheDocument()
  })
})
