/**
 * Converts an SVG element to a PNG data URL using Canvas
 * @param svgElement The SVG DOM element to convert
 * @param width Target image width in pixels
 * @param height Target image height in pixels
 * @returns Promise resolving to data URL string (data:image/png;...)
 */
export async function svgElementToImageData(
  svgElement: SVGElement,
  width: number,
  height: number
): Promise<string> {
  if (!svgElement) {
    throw new Error('SVG element is required')
  }

  // Clone the SVG so we don't modify the original
  const svgClone = svgElement.cloneNode(true) as SVGElement

  // Serialize SVG to string
  const svgString = new XMLSerializer().serializeToString(svgClone)

  // Create data URL directly from SVG string
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`

  return new Promise((resolve, reject) => {
    const img = new Image()
    let timeoutId: NodeJS.Timeout | null = null

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId)
    }

    img.onload = () => {
      cleanup()
      try {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)

        // Set font to support Unicode characters
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/png')
        resolve(dataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      cleanup()
      reject(new Error('Failed to load SVG as image'))
    }

    // Set a timeout to catch cases where onload never fires
    timeoutId = setTimeout(() => {
      reject(new Error('SVG image loading timeout'))
    }, 5000)

    img.src = svgDataUrl
  })
}
