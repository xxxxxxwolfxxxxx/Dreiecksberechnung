import { getRelatedTriangles, RelatedTriangle } from '../../utils/relatedTriangles'

describe('getRelatedTriangles', () => {
  test('should return 4 triangles for rechtwinklig type', () => {
    const triangles = getRelatedTriangles('rechtwinklig')
    expect(triangles).toHaveLength(4)
  })

  test('all triangles should have required properties: label, a, b, c', () => {
    const triangles = getRelatedTriangles('rechtwinklig')
    triangles.forEach((triangle) => {
      expect(triangle).toHaveProperty('label')
      expect(triangle).toHaveProperty('a')
      expect(triangle).toHaveProperty('b')
      expect(triangle).toHaveProperty('c')
      expect(typeof triangle.label).toBe('string')
      expect(typeof triangle.a).toBe('number')
      expect(typeof triangle.b).toBe('number')
      expect(typeof triangle.c).toBe('number')
    })
  })

  test('should return different sets for different triangle types', () => {
    const rechtwinklig = getRelatedTriangles('rechtwinklig')
    const gleichseitig = getRelatedTriangles('gleichseitig')
    const gleichschenklig = getRelatedTriangles('gleichschenklig')

    expect(rechtwinklig).not.toEqual(gleichseitig)
    expect(gleichseitig).not.toEqual(gleichschenklig)
    expect(rechtwinklig).not.toEqual(gleichschenklig)
  })

  test('should contain 3-4-5 triangle in rechtwinklig set', () => {
    const triangles = getRelatedTriangles('rechtwinklig')
    const triangle345 = triangles.find(
      (t) => t.a === 3 && t.b === 4 && t.c === 5,
    )
    expect(triangle345).toBeDefined()
    expect(triangle345?.label).toContain('3-4-5')
  })

  test('should contain 45-45-90 triangle in rechtwinklig set', () => {
    const triangles = getRelatedTriangles('rechtwinklig')
    const triangle4545 = triangles.find(
      (t) => t.a === 5 && t.b === 5 && t.c > 7 && t.c < 7.2,
    )
    expect(triangle4545).toBeDefined()
    expect(triangle4545?.label).toContain('45-45-90')
  })

  test('should return fallback triangles for unknown type', () => {
    const triangles = getRelatedTriangles('unknown-type')
    expect(triangles.length).toBeGreaterThan(0)
    expect(triangles[0]).toHaveProperty('label')
  })

  test('should return 2 triangles for gleichseitig type', () => {
    const triangles = getRelatedTriangles('gleichseitig')
    expect(triangles).toHaveLength(2)
  })

  test('should return 2 triangles for gleichschenklig type', () => {
    const triangles = getRelatedTriangles('gleichschenklig')
    expect(triangles).toHaveLength(2)
  })

  test('gleichseitig triangles should have a === b === c', () => {
    const triangles = getRelatedTriangles('gleichseitig')
    triangles.forEach((triangle) => {
      expect(triangle.a).toBe(triangle.b)
      expect(triangle.b).toBe(triangle.c)
    })
  })

  test('should have optional description property', () => {
    const triangles = getRelatedTriangles('rechtwinklig')
    triangles.forEach((triangle) => {
      if (triangle.description) {
        expect(typeof triangle.description).toBe('string')
      }
    })
  })
})
