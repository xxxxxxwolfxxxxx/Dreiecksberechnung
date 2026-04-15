import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpickzettelExport } from '../../../components/calculator/SpickzettelExport'
import * as pdfGenerator from '../../../utils/pdfGenerator'

// Mock the PDF generator
jest.mock('../../../utils/pdfGenerator', () => ({
  generateSpickzettel: jest.fn(),
  downloadPDF: jest.fn()
}))

const mockSolution = {
  values: {
    a: 3,
    b: 4,
    c: 5,
    alpha: 36.87,
    beta: 53.13,
    gamma: 90,
    flaeche: 6,
    umfang: 12,
    typ: 'rechtwinklig'
  },
  method: 'Kosinussatz',
  formulas: ['a² + b² = c²'],
  steps: ['Schritt 1', 'Schritt 2']
}

describe('SpickzettelExport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders export button', () => {
    render(<SpickzettelExport solution={mockSolution} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/Spickzettel/)
  })

  it('shows download icon in button', () => {
    const { container } = render(<SpickzettelExport solution={mockSolution} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('calls generateSpickzettel and downloadPDF on button click', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(<SpickzettelExport solution={mockSolution} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(pdfGenerator.generateSpickzettel).toHaveBeenCalledWith(mockSolution, 'cm')
      expect(pdfGenerator.downloadPDF).toHaveBeenCalledWith(
        mockBlob,
        expect.stringMatching(/^dreieck-spickzettel-\d+\.pdf$/)
      )
    })
  })

  it('shows loading state while generating PDF', async () => {
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )

    render(<SpickzettelExport solution={mockSolution} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    // Button should show loading text immediately
    expect(screen.getByText(/Wird erstellt/)).toBeInTheDocument()

    // After PDF generation, should revert to normal text
    await waitFor(() => {
      expect(screen.getByText(/Spickzettel herunterladen/)).toBeInTheDocument()
    })
  })

  it('calls onExport callback after successful download', async () => {
    const onExport = jest.fn()
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(<SpickzettelExport solution={mockSolution} onExport={onExport} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(onExport).toHaveBeenCalled()
    })
  })

  it('handles PDF generation errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockRejectedValue(
      new Error('PDF generation failed')
    )

    render(<SpickzettelExport solution={mockSolution} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'PDF generation failed:',
        expect.any(Error)
      )
      // Button should be re-enabled after error
      expect(button).not.toBeDisabled()
    })

    consoleSpy.mockRestore()
  })

  it('disables button while loading', async () => {
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )

    render(<SpickzettelExport solution={mockSolution} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})
