export interface RelatedTriangle {
  label: string
  a: number
  b: number
  c: number
  description?: string
}

export function getRelatedTriangles(triangleType: string): RelatedTriangle[] {
  switch (triangleType.toLowerCase()) {
    case 'rechtwinklig':
      return getRightTriangles()
    case 'gleichseitig':
      return getEquilateralTriangles()
    case 'gleichschenklig':
      return getIsoscelesTriangles()
    default:
      return getFallbackTriangles()
  }
}

function getRightTriangles(): RelatedTriangle[] {
  return [
    {
      label: '3-4-5 Dreieck',
      a: 3,
      b: 4,
      c: 5,
      description: 'Klassiker – Das ursprüngliche Pythagoras-Beispiel',
    },
    {
      label: '5-12-13 Dreieck',
      a: 5,
      b: 12,
      c: 13,
      description: 'Nächstes pythagoräisches Triple',
    },
    {
      label: '45-45-90 Dreieck',
      a: 5,
      b: 5,
      c: 7.07,
      description: 'Quadrat-Diagonale – beide Katheten gleich',
    },
    {
      label: '30-60-90 Dreieck',
      a: 5,
      b: 8.66,
      c: 10,
      description: 'Halbes gleichseitiges Dreieck',
    },
  ]
}

function getEquilateralTriangles(): RelatedTriangle[] {
  return [
    {
      label: 'Seitenlänge 5',
      a: 5,
      b: 5,
      c: 5,
      description: 'Alle Seiten gleich – perfekte Symmetrie',
    },
    {
      label: 'Seitenlänge 10',
      a: 10,
      b: 10,
      c: 10,
      description: 'Doppelte Größe',
    },
  ]
}

function getIsoscelesTriangles(): RelatedTriangle[] {
  return [
    {
      label: 'Isosceles 5-5-6',
      a: 5,
      b: 5,
      c: 6,
      description: 'Zwei gleiche Schenkel',
    },
    {
      label: 'Isosceles 5-5-8',
      a: 5,
      b: 5,
      c: 8,
      description: 'Andere Proportionen',
    },
  ]
}

function getFallbackTriangles(): RelatedTriangle[] {
  return [
    {
      label: '3-4-5 Dreieck',
      a: 3,
      b: 4,
      c: 5,
      description: 'Klassiker',
    },
    {
      label: '5-12-13 Dreieck',
      a: 5,
      b: 12,
      c: 13,
      description: 'Pythagoräisches Triple',
    },
    {
      label: 'Gleichseitiges Dreieck',
      a: 5,
      b: 5,
      c: 5,
      description: 'Perfekt symmetrisch',
    },
  ]
}
