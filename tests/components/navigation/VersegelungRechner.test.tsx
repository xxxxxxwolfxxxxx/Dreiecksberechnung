import { fireEvent, render, screen } from '@testing-library/react'
import { VersegelungRechner } from '@/components/navigation/VersegelungRechner'

describe('VersegelungRechner', () => {
  test('rechnet die voreingestellte Vier-Strich-Peilung sofort durch', () => {
    render(<VersegelungRechner />)

    expect(screen.getByLabelText('1. Seitenpeilung')).toHaveValue(45)
    expect(screen.getByLabelText('2. Seitenpeilung')).toHaveValue(90)
    expect(screen.getByText('Querabstand')).toBeInTheDocument()
    // Querabstand = gefahrene Distanz = 2 sm
    expect(screen.getAllByText(/^2 sm$/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Klassische Vier-Strich-Peilung/)).toBeInTheDocument()
  })

  test('Vorlage-Knopf setzt beide Seitenpeilungen', () => {
    render(<VersegelungRechner />)

    fireEvent.click(screen.getByRole('button', { name: '30° → 60°' }))

    expect(screen.getByLabelText('1. Seitenpeilung')).toHaveValue(30)
    expect(screen.getByLabelText('2. Seitenpeilung')).toHaveValue(60)
    expect(screen.getByText(/Verdopplung/)).toBeInTheDocument()
  })

  test('Strich-Hinweis unter dem Feld folgt der Eingabe', () => {
    render(<VersegelungRechner />)

    expect(screen.getByText('entspricht 4 Strich')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('1. Seitenpeilung'), { target: { value: '22.5' } })
    expect(screen.getByText('entspricht 2 Strich')).toBeInTheDocument()
  })

  test('Umschalten auf Fahrt und Zeit rechnet die Distanz selbst aus', () => {
    render(<VersegelungRechner />)

    fireEvent.click(screen.getByRole('button', { name: 'aus Fahrt & Zeit' }))

    expect(screen.getByLabelText('Fahrt über Grund')).toHaveValue(6)
    expect(screen.getByLabelText('Zeit zwischen den Peilungen')).toHaveValue(20)
    expect(screen.getByText('ergibt 2 sm')).toBeInTheDocument()
  })

  test('unbrauchbare Winkelkombination zeigt eine Fehlermeldung statt Zahlen', () => {
    render(<VersegelungRechner />)

    fireEvent.change(screen.getByLabelText('2. Seitenpeilung'), { target: { value: '30' } })

    expect(screen.getByText('Damit lässt sich keine Entfernung bestimmen')).toBeInTheDocument()
    expect(screen.getByText(/zweite Seitenpeilung muss größer sein/)).toBeInTheDocument()
    expect(screen.queryByText('Querabstand')).not.toBeInTheDocument()
  })

  test('kleine Peilungsdifferenz erzeugt eine Warnung neben dem Ergebnis', () => {
    render(<VersegelungRechner />)

    fireEvent.change(screen.getByLabelText('2. Seitenpeilung'), { target: { value: '50' } })

    expect(screen.getByText(/unsichere Ausgangswerte/)).toBeInTheDocument()
    expect(screen.getByText('Querabstand')).toBeInTheDocument()
  })

  test('bei Kilometern entfällt die Umrechnung aus Knoten', () => {
    render(<VersegelungRechner />)

    fireEvent.change(screen.getByLabelText('Längeneinheit'), { target: { value: 'km' } })

    expect(screen.queryByRole('button', { name: 'aus Fahrt & Zeit' })).not.toBeInTheDocument()
    expect(screen.getByText(/rechnet in Seemeilen/)).toBeInTheDocument()
  })
})
