import { render, screen, fireEvent } from '@testing-library/react'
import { InputPanel } from '@/components/calculator/InputPanel'
import { dreieck } from '@/lib/shapes/dreieck'

test('rendert alle Input-Felder der Form', () => {
  render(<InputPanel shape={dreieck} values={{}} onChange={() => {}} unit="cm" />)
  expect(screen.getByLabelText(/Seite a/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Seite b/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Winkel α/i)).toBeInTheDocument()
})

test('ruft onChange mit korrektem Key auf', () => {
  const onChange = jest.fn()
  render(<InputPanel shape={dreieck} values={{}} onChange={onChange} unit="cm" />)
  fireEvent.change(screen.getByLabelText(/Seite a/i), { target: { value: '3' } })
  expect(onChange).toHaveBeenCalledWith('a', 3)
})

test('zeigt Fehler bei negativem Wert', () => {
  render(<InputPanel shape={dreieck} values={{ a: -1 }} onChange={() => {}} unit="cm" />)
  expect(screen.getByText(/positiv/i)).toBeInTheDocument()
})
