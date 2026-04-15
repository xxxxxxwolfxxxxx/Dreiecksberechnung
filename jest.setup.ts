import '@testing-library/jest-dom'

// Polyfill for Node.js environment (jsPDF needs TextEncoder)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}
