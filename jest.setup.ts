import '@testing-library/jest-dom'

// Polyfill for Node.js environment (jsPDF needs TextEncoder)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Polyfill for URL.createObjectURL and URL.revokeObjectURL in jsdom
if (!URL.createObjectURL) {
  let objectUrlCounter = 0
  const objectUrls = new Map<string, Blob>()

  URL.createObjectURL = (blob: Blob) => {
    const url = `blob:mock://${++objectUrlCounter}`
    objectUrls.set(url, blob)
    return url
  }

  URL.revokeObjectURL = (url: string) => {
    objectUrls.delete(url)
  }
}

// Mock Canvas API for jsdom tests
const canvasProto = HTMLCanvasElement.prototype

// Replace getContext with a working mock
Object.defineProperty(canvasProto, 'getContext', {
  value: function (contextId: string, options?: any) {
    if (contextId === '2d') {
      return {
        fillStyle: 'white',
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        getImageData: jest.fn(() => ({
          data: new Uint8ClampedArray(),
        })),
      } as any
    }
    return null
  },
  writable: true,
})

// Replace toDataURL with a working mock
Object.defineProperty(canvasProto, 'toDataURL', {
  value: function (type?: string) {
    // Return a valid PNG data URL
    return `data:${type || 'image/png'};base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
  },
  writable: true,
})

// Mock HTMLImageElement for test environment
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ''

  get src(): string {
    return this._src
  }

  set src(value: string) {
    this._src = value
    // Trigger onload for data URLs (SVG) after timeout
    if (value.startsWith('data:')) {
      setTimeout(() => {
        try {
          if (this.onload) {
            this.onload()
          }
        } catch (error) {
          if (this.onerror) {
            this.onerror()
          }
        }
      }, 0)
    }
  }
}

// Only override in test environment (jsdom)
if (typeof window !== 'undefined' && !window.Image.toString().includes('[native code]')) {
  ;(window as any).Image = MockImage as any
}
