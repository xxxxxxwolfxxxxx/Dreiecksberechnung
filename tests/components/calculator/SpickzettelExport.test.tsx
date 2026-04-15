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
  method: 'Pythagoras',
  formulas: ['a² + b² = c²'],
  steps: []
}

describe('SpickzettelExport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders export button', () => {
    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/Spickzettel/)
  })

  it('accepts shapeId prop for different shapes', () => {
    render(<SpickzettelExport solution={mockSolution} shapeId="kreis" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('passes shapeId to generateSpickzettel', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(<SpickzettelExport solution={mockSolution} shapeId="rechteck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(pdfGenerator.generateSpickzettel).toHaveBeenCalledWith(
        mockSolution,
        'cm',
        'rechteck',
        undefined
      )
    })
  })

  it('passes svgElement to generateSpickzettel when provided', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(
      <SpickzettelExport solution={mockSolution} shapeId="kreis" svgElement={mockSvg} />
    )
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(pdfGenerator.generateSpickzettel).toHaveBeenCalledWith(
        mockSolution,
        'cm',
        'kreis',
        mockSvg
      )
    })
  })

  it('generates filename with correct shape label', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(<SpickzettelExport solution={mockSolution} shapeId="trapez" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(pdfGenerator.downloadPDF).toHaveBeenCalledWith(
        mockBlob,
        expect.stringMatching(/^trapez-spickzettel-\d+\.pdf$/)
      )
    })
  })

  it('shows download icon in button', () => {
    const { container } = render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('calls generateSpickzettel and downloadPDF on button click', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockResolvedValue(mockBlob)

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(pdfGenerator.generateSpickzettel).toHaveBeenCalledWith(mockSolution, 'cm', 'dreieck', undefined)
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

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
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

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" onExport={onExport} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(onExport).toHaveBeenCalled()
    })
  })

  it('handles PDF generation errors gracefully and shows error message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockRejectedValue(
      new Error('PDF generation failed')
    )

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'PDF generation failed:',
        expect.any(Error)
      )
      // Button should be re-enabled after error
      expect(button).not.toBeDisabled()
      // Error message should be displayed
      expect(screen.getByText(/PDF generation failed/)).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('disables button while loading', async () => {
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('has accessibility attributes for screenreaders', () => {
    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('aria-label', 'PDF Spickzettel herunterladen')
    expect(button).toHaveAttribute('aria-busy', 'false')
  })

  it('sets aria-busy to true during loading', async () => {
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    // aria-busy should be true while loading
    expect(button).toHaveAttribute('aria-busy', 'true')

    await waitFor(() => {
      // aria-busy should be false after loading
      expect(button).toHaveAttribute('aria-busy', 'false')
    })
  })

  it('hides SVG from screenreaders', () => {
    const { container } = render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('clears error message when retrying after failure', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    ;(pdfGenerator.generateSpickzettel as jest.Mock)
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce(mockBlob)

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    // First attempt fails
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/First attempt failed/)).toBeInTheDocument()
    })

    // Retry succeeds
    fireEvent.click(button)

    await waitFor(() => {
      // Error message should be cleared
      expect(screen.queryByText(/First attempt failed/)).not.toBeInTheDocument()
      // Download should have been called
      expect(pdfGenerator.downloadPDF).toHaveBeenCalled()
    })
  })

  it('shows generic error message for non-Error exceptions', async () => {
    ;(pdfGenerator.generateSpickzettel as jest.Mock).mockRejectedValue('Unknown error')

    render(<SpickzettelExport solution={mockSolution} shapeId="dreieck" />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/PDF konnte nicht erstellt werden/)).toBeInTheDocument()
    })
  })
})
