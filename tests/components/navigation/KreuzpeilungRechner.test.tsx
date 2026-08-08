import { fireEvent, render, screen } from '@testing-library/react'
import { KreuzpeilungRechner } from '@/components/navigation/KreuzpeilungRechner'

describe('KreuzpeilungRechner', () => {
  test('startet mit dem Beispiel und zeigt Ergebnis samt Skizze', () => {
    render(<KreuzpeilungRechner />)

    expect(screen.getByLabelText('Peilung zu Objekt A')).toHaveValue(315)
    expect(screen.getByLabelText('Basisrichtung A → B')).toHaveValue(90)
    expect(screen.getByText('Abstand zur Basislinie')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Skizze|Basislinie/ })).toBeInTheDocument()
  })

  test('leeres Feld blendet Ergebnis und Skizze aus', () => {
    render(<KreuzpeilungRechner />)

    fireEvent.change(screen.getByLabelText('Abstand A – B (Basis b)'), { target: { value: '' } })

    expect(screen.queryByText('Abstand zur Basislinie')).not.toBeInTheDocument()
    expect(screen.getByText(/dann erscheint hier das Peildreieck/)).toBeInTheDocument()
  })

  test('widersprüchliche Richtungen ergeben eine Fehlermeldung', () => {
    render(<KreuzpeilungRechner />)

    fireEvent.change(screen.getByLabelText('Peilung zu Objekt B'), { target: { value: '200' } })

    expect(screen.getByText(/kein Standort bestimmen/)).toBeInTheDocument()
    expect(screen.queryByText('Abstand zur Basislinie')).not.toBeInTheDocument()
  })

  test('schleifender Schnitt wird als Warnung neben dem Ergebnis gezeigt', () => {
    render(<KreuzpeilungRechner />)

    fireEvent.change(screen.getByLabelText('Peilung zu Objekt B'), { target: { value: '320' } })

    expect(screen.getByText(/Schleifender Schnitt/)).toBeInTheDocument()
    expect(screen.getByText('Abstand zur Basislinie')).toBeInTheDocument()
  })

  test('Beispielwerte laden stellt die Ausgangslage wieder her', () => {
    render(<KreuzpeilungRechner />)

    fireEvent.change(screen.getByLabelText('Peilung zu Objekt A'), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Beispielwerte laden' }))

    expect(screen.getByLabelText('Peilung zu Objekt A')).toHaveValue(315)
    expect(screen.getByText('Abstand zur Basislinie')).toBeInTheDocument()
  })
})
