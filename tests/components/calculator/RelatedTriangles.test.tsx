import { render, screen, fireEvent } from '@testing-library/react'
import { RelatedTriangles } from '@/components/calculator/RelatedTriangles'

describe('RelatedTriangles', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  test('rendert alle Related Triangles für einen Type', () => {
    render(<RelatedTriangles typ="rechtwinklig" onSelect={mockOnSelect} />)

    // Alle 4 rechtwinkligen Dreiecke sollten angezeigt werden
    expect(screen.getByText(/3-4-5 Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/5-12-13 Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/45-45-90 Dreieck/i)).toBeInTheDocument()
    expect(screen.getByText(/30-60-90 Dreieck/i)).toBeInTheDocument()
  })

  test('zeigt "3-4-5 Dreieck" Text für rechtwinklig an', () => {
    render(<RelatedTriangles typ="rechtwinklig" onSelect={mockOnSelect} />)
    expect(screen.getByText(/3-4-5 Dreieck/i)).toBeInTheDocument()
  })

  test('ruft onSelect mit korrekten a, b, c Werten auf bei Klick', () => {
    render(<RelatedTriangles typ="rechtwinklig" onSelect={mockOnSelect} />)

    // Klick auf "3-4-5 Dreieck"
    fireEvent.click(screen.getByText(/3-4-5 Dreieck/i))
    expect(mockOnSelect).toHaveBeenCalledWith({ a: 3, b: 4, c: 5 })

    // Klick auf "5-12-13 Dreieck"
    fireEvent.click(screen.getByText(/5-12-13 Dreieck/i))
    expect(mockOnSelect).toHaveBeenCalledWith({ a: 5, b: 12, c: 13 })
  })

  test('zeigt unterschiedliche Dreiecke für unterschiedliche Types', () => {
    const { rerender } = render(
      <RelatedTriangles typ="rechtwinklig" onSelect={mockOnSelect} />
    )
    expect(screen.getByText(/3-4-5 Dreieck/i)).toBeInTheDocument()
    expect(screen.queryByText(/Seitenlänge 5/i)).not.toBeInTheDocument()

    rerender(<RelatedTriangles typ="gleichseitig" onSelect={mockOnSelect} />)
    expect(screen.queryByText(/3-4-5 Dreieck/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Seitenlänge 5/i)).toBeInTheDocument()
  })

  test('zeigt Description an wenn vorhanden', () => {
    render(<RelatedTriangles typ="rechtwinklig" onSelect={mockOnSelect} />)

    // Die Descriptions sollten sichtbar sein
    expect(
      screen.getByText(/Klassiker – Das ursprüngliche Pythagoras-Beispiel/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Nächstes pythagoräisches Triple/i)).toBeInTheDocument()
  })
})
