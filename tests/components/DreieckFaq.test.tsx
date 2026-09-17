import { render, screen } from '@testing-library/react'
import { DreieckFaq, DREIECK_FAQ } from '@/components/DreieckFaq'

describe('DreieckFaq', () => {
  it('zeigt jede Frage als eigene Überschrift', () => {
    render(<DreieckFaq />)

    for (const eintrag of DREIECK_FAQ) {
      expect(screen.getByRole('heading', { level: 3, name: eintrag.frage })).toBeInTheDocument()
    }
  })

  it('beantwortet die Fragen aus Googles "Ähnliche Fragen" für "dreieck berechnen"', () => {
    const fragen = DREIECK_FAQ.map(e => e.frage)

    expect(fragen).toContain('Wie rechne ich ein Dreieck aus?')
    expect(fragen).toContain('Wie berechnet man die fehlende Seite eines Dreiecks?')
    expect(fragen).toContain('Wie berechne ich die Fläche eines Dreiecks?')
  })

  it('nennt die Dreiecksberechnung im Abschnittstitel', () => {
    render(<DreieckFaq />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Dreiecksberechnung/)
  })
})
