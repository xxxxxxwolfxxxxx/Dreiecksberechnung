import { getErrorExplanation } from '../../utils/errorExplanations'

describe('getErrorExplanation', () => {
  describe('Triangle Inequality Error', () => {
    it('should explain triangle inequality violation with values', () => {
      const result = getErrorExplanation(
        'Dreiecksungleichung verletzt',
        { a: 2, b: 3, c: 6 }
      )

      expect(result.message).toContain('a=2')
      expect(result.message).toContain('b=3')
      expect(result.message).toContain('c=6')
    })

    it('should include suggestion with inequality constraint', () => {
      const result = getErrorExplanation(
        'Dreiecksungleichung verletzt',
        { a: 2, b: 3, c: 6 }
      )

      expect(result.suggestion).toBeDefined()
      expect(result.suggestion).toContain('c ≤')
    })

    it('should have emoji in result', () => {
      const result = getErrorExplanation(
        'Dreiecksungleichung verletzt',
        { a: 2, b: 3, c: 6 }
      )

      expect(result.emoji).toBeDefined()
    })
  })

  describe('Negative Values Error', () => {
    it('should explain negative values with field names', () => {
      const result = getErrorExplanation(
        'Alle Seiten müssen positiv sein',
        { a: -5, b: 3, c: 4 }
      )

      expect(result.message).toContain('negativ')
      expect(result.message).toContain('a')
    })

    it('should mention specific negative field', () => {
      const result = getErrorExplanation(
        'Alle Seiten müssen positiv sein',
        { b: -2, c: 4 }
      )

      expect(result.message).toContain('b')
    })

    it('should have suggestion for negative values', () => {
      const result = getErrorExplanation(
        'Alle Seiten müssen positiv sein',
        { a: -5, b: 3, c: 4 }
      )

      expect(result.suggestion).toBeDefined()
    })
  })

  describe('Unknown Error', () => {
    it('should provide fallback for unknown errors', () => {
      const result = getErrorExplanation(
        'Ein unbekannter Fehler ist aufgetreten',
        {}
      )

      expect(result.message).toBeDefined()
      expect(result.message.length > 0).toBe(true)
    })

    it('should still have emoji for fallback', () => {
      const result = getErrorExplanation(
        'Ein völlig unbekannter Fehler',
        {}
      )

      expect(result.emoji).toBeDefined()
    })
  })

  describe('Interface compliance', () => {
    it('should return ErrorExplanation interface', () => {
      const result = getErrorExplanation(
        'Dreiecksungleichung verletzt',
        { a: 1, b: 2, c: 3 }
      )

      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('emoji')
      expect(typeof result.message).toBe('string')
      expect(typeof result.emoji).toBe('string')
    })
  })
})
