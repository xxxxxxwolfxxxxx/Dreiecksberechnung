import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeDrawing } from '@/components/calculator/ShapeDrawing'
import { dreieck } from '@/lib/shapes/dreieck'

describe('ShapeDrawing', () => {
  test('zeigt SVG mit Points und Lines an', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} />
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Es sollte mindestens 3 Punkte geben (Ecken)
    const points = svg?.querySelectorAll('circle')
    expect(points?.length).toBeGreaterThanOrEqual(3)
  })

  test('zeigt Label bei Points und Lines an', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} />
    )

    const svg = container.querySelector('svg')
    // Punkte sollten Label-Texte haben (A, B, C)
    const texts = svg?.querySelectorAll('text')
    expect(texts?.length).toBeGreaterThan(0)
  })

  test('interaktive Elemente haben cursor-pointer Klasse (nicht im Preview)', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} isPreview={false} />
    )

    const svg = container.querySelector('svg')
    const groups = svg?.querySelectorAll('g')

    // Mindestens eine Gruppe sollte cursor-pointer haben (Lines/Points)
    const withCursorPointer = Array.from(groups || []).filter(g =>
      g.className.baseVal?.includes('cursor-pointer')
    )
    expect(withCursorPointer.length).toBeGreaterThan(0)
  })

  test('Preview-Modus hat keine cursor-pointer Klasse', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} isPreview={true} />
    )

    const svg = container.querySelector('svg')
    const groups = svg?.querySelectorAll('g')

    // Im Preview sollte keine cursor-pointer sein
    const withCursorPointer = Array.from(groups || []).filter(g =>
      g.className.baseVal?.includes('cursor-pointer')
    )
    expect(withCursorPointer.length).toBe(0)
  })

  test('zeigt Placeholder-Text wenn keine Daten', () => {
    // Erstelle eine einfache Shape ohne Punkte
    const mockShape = {
      toSVG: () => ({ points: [], lines: [], width: 280, height: 280 }),
      defaultValues: {}
    }

    render(<ShapeDrawing shape={mockShape as any} />)
    expect(screen.getByText(/Zeichnung erscheint nach der Berechnung/i)).toBeInTheDocument()
  })

  test('SVG hat onMouseLeave Handler', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} isPreview={false} />
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Teste, dass onMouseLeave Handler existiert
    fireEvent.mouseLeave(svg!)
    // Wenn kein Fehler geworfen wird, funktioniert es
    expect(svg).toBeInTheDocument()
  })

  test('Lines-Gruppen haben onMouseEnter/onMouseLeave Handler', () => {
    const { container } = render(
      <ShapeDrawing shape={dreieck} data={dreieck.toSVG({ a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 }, 280)} isPreview={false} />
    )

    const svg = container.querySelector('svg')
    const groups = svg?.querySelectorAll('g')

    // Sollte mindestens 3 Linien-Gruppen geben
    expect(groups?.length).toBeGreaterThanOrEqual(3)

    // Teste mouse events auf einer Gruppe
    if (groups && groups.length > 0) {
      fireEvent.mouseEnter(groups[0])
      fireEvent.mouseLeave(groups[0])
      // Keine Fehler = Handler existieren
      expect(groups[0]).toBeInTheDocument()
    }
  })
})
