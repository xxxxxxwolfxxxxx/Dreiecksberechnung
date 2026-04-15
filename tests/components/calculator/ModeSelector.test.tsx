import { render, screen, fireEvent } from '@testing-library/react'
import { ModeSelector } from '@/components/calculator/ModeSelector'

describe('ModeSelector', () => {
  test('zeigt alle 4 Optionen an', () => {
    render(<ModeSelector onSelect={() => {}} />)
    expect(screen.getByText(/Alle 3 Seiten/i)).toBeInTheDocument()
    expect(screen.getByText(/2 Seiten \+ 1 Winkel/i)).toBeInTheDocument()
    expect(screen.getByText(/1 Seite \+ 2 Winkel/i)).toBeInTheDocument()
    expect(screen.getByText(/Weiß nicht/i)).toBeInTheDocument()
  })

  test('ruft onSelect mit korrekter modeId auf bei Klick', () => {
    const onSelect = jest.fn()
    render(<ModeSelector onSelect={onSelect} />)

    // Klick auf SSS Option
    fireEvent.click(screen.getByText(/Alle 3 Seiten/i))
    expect(onSelect).toHaveBeenCalledWith('sss')

    // Klick auf SWS Option
    fireEvent.click(screen.getByText(/2 Seiten \+ 1 Winkel/i))
    expect(onSelect).toHaveBeenCalledWith('sws')

    // Klick auf WSW Option
    fireEvent.click(screen.getByText(/1 Seite \+ 2 Winkel/i))
    expect(onSelect).toHaveBeenCalledWith('wsw')

    // Klick auf WWW Option
    fireEvent.click(screen.getByText(/Weiß nicht/i))
    expect(onSelect).toHaveBeenCalledWith('www')
  })

  test('zeigt Hint-Texte unter den Buttons', () => {
    render(<ModeSelector onSelect={() => {}} />)
    expect(screen.getByText(/Die einfachste Methode/i)).toBeInTheDocument()
    expect(screen.getByText(/Der Klassiker in der Schule/i)).toBeInTheDocument()
    expect(screen.getByText(/Für spezielle Aufgaben/i)).toBeInTheDocument()
    expect(screen.getByText(/Einfach ausprobieren!/i)).toBeInTheDocument()
  })
})
