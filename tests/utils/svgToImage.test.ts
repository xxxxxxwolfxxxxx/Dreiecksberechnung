import { svgElementToImageData } from '@/utils/svgToImage'

describe('svgToImage', () => {
  it('converts SVG element to image data URL', async () => {
    // Create a simple SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 100 100')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', '50')
    circle.setAttribute('cy', '50')
    circle.setAttribute('r', '40')
    circle.setAttribute('fill', 'blue')
    svg.appendChild(circle)

    const imageData = await svgElementToImageData(svg, 200, 200)

    expect(imageData).toMatch(/^data:image\/png/)
    expect(imageData.length).toBeGreaterThan(0)
  })

  it('handles large SVG elements with proper dimensions', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 500 500')

    const imageData = await svgElementToImageData(svg, 400, 400)

    expect(imageData).toMatch(/^data:image\/png/)
  })

  it('throws error if SVG element is null', async () => {
    await expect(svgElementToImageData(null as any, 200, 200))
      .rejects.toThrow('SVG element is required')
  })
})
