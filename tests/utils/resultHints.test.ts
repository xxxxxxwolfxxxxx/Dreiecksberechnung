import { getResultHint, getComparison, getContextForKey } from '../../utils/resultHints'

describe('getResultHint', () => {
  it('provides hint for area', () => {
    const hint = getResultHint('flaeche')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('fläche')
  })

  it('provides hint for perimeter', () => {
    const hint = getResultHint('umfang')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('umfang')
  })

  it('provides hint for height a', () => {
    const hint = getResultHint('h_a')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('höhe')
  })

  it('provides hint for height b', () => {
    const hint = getResultHint('h_b')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('höhe')
  })

  it('provides hint for height c', () => {
    const hint = getResultHint('h_c')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('höhe')
  })

  it('provides hint for inkreis', () => {
    const hint = getResultHint('inkreis')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('kreis')
  })

  it('provides hint for umkreis', () => {
    const hint = getResultHint('umkreis')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('kreis')
  })

  it('provides hint for type', () => {
    const hint = getResultHint('typ')
    expect(hint.length).toBeGreaterThan(0)
    expect(hint.toLowerCase()).toContain('dreieck')
  })

  it('returns empty string for unknown keys', () => {
    expect(getResultHint('unknown_key')).toBe('')
    expect(getResultHint('xyz123')).toBe('')
  })
})

describe('getComparison', () => {
  it('returns comparison for very small areas', () => {
    const comparison = getComparison(0.5)
    expect(comparison.length).toBeGreaterThan(0)
    expect(comparison.toLowerCase()).toContain('klein')
  })

  it('returns comparison for small areas (around 2 cm²)', () => {
    const comparison = getComparison(2)
    expect(comparison.length).toBeGreaterThan(0)
    // Should reference something very small like fingernail
  })

  it('returns comparison for medium-small areas (around 50 cm²)', () => {
    const comparison = getComparison(50)
    expect(comparison.length).toBeGreaterThan(0)
  })

  it('returns comparison for medium areas (around 500 cm²)', () => {
    const comparison = getComparison(500)
    expect(comparison.length).toBeGreaterThan(0)
  })

  it('returns comparison for large areas (around 5000 cm²)', () => {
    const comparison = getComparison(5000)
    expect(comparison.length).toBeGreaterThan(0)
  })

  it('returns comparison for very large areas (around 50000 cm²)', () => {
    const comparison = getComparison(50000)
    expect(comparison.length).toBeGreaterThan(0)
  })

  it('returns comparison for extremely large areas', () => {
    const comparison = getComparison(150000)
    expect(comparison.length).toBeGreaterThan(0)
  })

  it('returns non-empty string for edge case (0)', () => {
    const comparison = getComparison(0)
    expect(comparison.length).toBeGreaterThan(0)
  })
})

describe('getContextForKey', () => {
  it('provides context for area', () => {
    const context = getContextForKey('flaeche')
    expect(context.length).toBeGreaterThan(0)
    expect(context.toLowerCase()).toContain('brauchst')
  })

  it('provides context for perimeter', () => {
    const context = getContextForKey('umfang')
    expect(context.length).toBeGreaterThan(0)
    expect(context.toLowerCase()).toContain('brauchst')
  })

  it('provides context for height a', () => {
    const context = getContextForKey('h_a')
    expect(context.length).toBeGreaterThan(0)
    expect(context.toLowerCase()).toContain('brauchst')
  })

  it('provides context for inkreis', () => {
    const context = getContextForKey('inkreis')
    expect(context.length).toBeGreaterThan(0)
    expect(context.toLowerCase()).toContain('brauchst')
  })

  it('returns empty string for unknown keys', () => {
    expect(getContextForKey('unknown_key')).toBe('')
    expect(getContextForKey('xyz123')).toBe('')
  })
})
