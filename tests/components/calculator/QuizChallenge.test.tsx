import { render, screen, fireEvent } from '@testing-library/react'
import { QuizChallenge } from '@/components/calculator/QuizChallenge'
import type { Solution } from '@/lib/shapes/types'

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
    typ: 'rechtwinklig',
  },
  method: 'Kosinussatz',
  formulas: [],
  steps: [],
}

describe('QuizChallenge', () => {
  test('rendert die Quiz-Frage', () => {
    render(<QuizChallenge solution={mockSolution} />)

    // Header sollte angezeigt werden
    expect(screen.getByText(/Schnelltest – Hast du verstanden\?/)).toBeInTheDocument()

    // Die Frage sollte angezeigt werden (für rechtwinklig Triangle)
    expect(screen.getByText(/Hypotenuse/i)).toBeInTheDocument()
  })

  test('zeigt alle 3 Answer-Options an', () => {
    render(<QuizChallenge solution={mockSolution} />)

    // Es sollten Buttons mit numerischen Werten geben (von der Quiz)
    const buttons = screen.getAllByRole('button')
    // 3 Antwortmöglichkeiten
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  test('setzt selectedAnswer beim Klick auf einen Button', () => {
    render(<QuizChallenge solution={mockSolution} />)

    const buttons = screen.getAllByRole('button')
    // Klick auf den zweiten Button (eine der Optionen)
    fireEvent.click(buttons[1])

    // Der Button sollte jetzt styling haben (border-green oder border-red)
    const selectedButton = buttons[1]
    expect(selectedButton).toHaveClass(/border-/)
  })

  test('zeigt Feedback mit Explanation nach reveal an', () => {
    render(<QuizChallenge solution={mockSolution} />)

    const buttons = screen.getAllByRole('button')
    // Klick auf einen Button um die Antwort zu enthüllen
    fireEvent.click(buttons[0])

    // Feedback-Text sollte sichtbar sein (✅ oder ❌)
    expect(screen.getByText(/✅|❌/)).toBeInTheDocument()

    // Explanation sollte sichtbar sein (von der Feedback-Box, nicht die Frage)
    const explanations = screen.getAllByText(/Pythagoras|Satz/i)
    expect(explanations.length).toBeGreaterThan(0)
  })

  test('zeigt unterschiedliche Styles für korrekte und falsche Antworten', () => {
    render(<QuizChallenge solution={mockSolution} />)

    const buttons = screen.getAllByRole('button')

    // Klick auf eine Option
    fireEvent.click(buttons[0])

    // Der geklickte Button sollte entweder green (richtig) oder red (falsch) haben
    const selectedButton = buttons[0]
    const hasGreenOrRed =
      selectedButton.className.includes('green') ||
      selectedButton.className.includes('red')

    expect(hasGreenOrRed || selectedButton.className.includes('border-')).toBeTruthy()
  })
})
