import { Shape, SolveResult, SVGData, Solution, InputDefinition } from './types'

const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

const EPS = 1e-9

function computeDerivedValues(a: number, b: number, c: number): Record<string, number> & { typ: string } {
  // All angles via cosine rule
  const alpha = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)))
  const beta  = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)))
  const gamma = toDeg(Math.acos((a * a + b * b - c * c) / (2 * a * b)))

  const umfang = a + b + c
  const s = umfang / 2
  const flaeche = Math.sqrt(s * (s - a) * (s - b) * (s - c))

  const h_a = (2 * flaeche) / a
  const h_b = (2 * flaeche) / b
  const h_c = (2 * flaeche) / c

  const inkreis  = flaeche / s
  const umkreis  = (a * b * c) / (4 * flaeche)

  // Determine type
  const sameAB = Math.abs(a - b) < EPS * Math.max(a, b, 1)
  const sameBC = Math.abs(b - c) < EPS * Math.max(b, c, 1)
  const sameAC = Math.abs(a - c) < EPS * Math.max(a, c, 1)
  const isRight = Math.abs(alpha - 90) < 0.01 || Math.abs(beta - 90) < 0.01 || Math.abs(gamma - 90) < 0.01

  let typ: string
  if (sameAB && sameBC) {
    typ = 'gleichseitig'
  } else if (sameAB || sameBC || sameAC) {
    typ = 'gleichschenklig'
  } else if (isRight) {
    typ = 'rechtwinklig'
  } else {
    typ = 'allgemein'
  }

  return {
    a, b, c,
    alpha, beta, gamma,
    umfang, flaeche,
    h_a, h_b, h_c,
    inkreis, umkreis,
    typ: typ as unknown as number,
  } as Record<string, number> & { typ: string }
}

function validateSides(a: number, b: number, c: number): string | null {
  if (a <= 0 || b <= 0 || c <= 0) return 'Alle Seiten müssen positiv sein.'
  if (a + b <= c || a + c <= b || b + c <= a) return 'Dreiecksungleichung verletzt: kein Dreieck möglich.'
  return null
}

function solveSSS(known: Partial<Record<string, number>>): SolveResult {
  const { a, b, c } = known as { a: number; b: number; c: number }
  const err = validateSides(a, b, c)
  if (err) return { solutions: [], error: err }

  const vals = computeDerivedValues(a, b, c)
  const sol: Solution = {
    values: vals,
    method: 'Kosinussatz (SSS)',
    formulas: [
      `α = arccos((b²+c²-a²)/(2bc))`,
      `β = arccos((a²+c²-b²)/(2ac))`,
      `γ = arccos((a²+b²-c²)/(2ab))`,
    ],
  }
  return { solutions: [sol] }
}

function solveSWS(known: Partial<Record<string, number>>): SolveResult {
  // Need 2 sides + 1 angle. Identify the included angle.
  // Supported combos: a,b,gamma | a,c,beta | b,c,alpha
  let a: number, b: number, c: number

  if (known.a !== undefined && known.b !== undefined && known.gamma !== undefined) {
    a = known.a; b = known.b
    const gammaRad = toRad(known.gamma)
    c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gammaRad))
  } else if (known.a !== undefined && known.c !== undefined && known.beta !== undefined) {
    a = known.a; c = known.c
    const betaRad = toRad(known.beta)
    b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(betaRad))
  } else if (known.b !== undefined && known.c !== undefined && known.alpha !== undefined) {
    b = known.b; c = known.c
    const alphaRad = toRad(known.alpha)
    a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(alphaRad))
  } else {
    return { solutions: [], error: 'Ungültige SWS-Kombination.' }
  }

  const err = validateSides(a, b, c)
  if (err) return { solutions: [], error: err }

  const vals = computeDerivedValues(a, b, c)
  const sol: Solution = {
    values: vals,
    method: 'Kosinussatz (SWS)',
    formulas: [`c = √(a²+b²-2ab·cos(γ))`],
  }
  return { solutions: [sol] }
}

function solveWSW_WWS(known: Partial<Record<string, number>>): SolveResult {
  // We have 2 angles → derive third, then use sine rule for all sides
  let alpha = known.alpha
  let beta  = known.beta
  let gamma = known.gamma

  // Derive missing angle
  if (alpha !== undefined && beta !== undefined && gamma === undefined) {
    gamma = 180 - alpha - beta
  } else if (alpha !== undefined && gamma !== undefined && beta === undefined) {
    beta = 180 - alpha - gamma
  } else if (beta !== undefined && gamma !== undefined && alpha === undefined) {
    alpha = 180 - beta - gamma
  }

  if (alpha === undefined || beta === undefined || gamma === undefined) {
    return { solutions: [], error: 'Nicht genug Winkel.' }
  }

  if (alpha <= 0 || beta <= 0 || gamma <= 0 || alpha + beta + gamma > 180 + EPS) {
    return { solutions: [], error: 'Ungültige Winkel: Summe muss 180° ergeben.' }
  }

  // Find the known side and compute all sides via sine rule: a/sin(α) = b/sin(β) = c/sin(γ)
  let a: number, b: number, c: number

  if (known.a !== undefined) {
    a = known.a
    b = a * Math.sin(toRad(beta))  / Math.sin(toRad(alpha))
    c = a * Math.sin(toRad(gamma)) / Math.sin(toRad(alpha))
  } else if (known.b !== undefined) {
    b = known.b
    a = b * Math.sin(toRad(alpha)) / Math.sin(toRad(beta))
    c = b * Math.sin(toRad(gamma)) / Math.sin(toRad(beta))
  } else if (known.c !== undefined) {
    c = known.c
    a = c * Math.sin(toRad(alpha)) / Math.sin(toRad(gamma))
    b = c * Math.sin(toRad(beta))  / Math.sin(toRad(gamma))
  } else {
    return { solutions: [], error: 'Keine bekannte Seite für WSW/WWS.' }
  }

  const err = validateSides(a, b, c)
  if (err) return { solutions: [], error: err }

  const vals = computeDerivedValues(a, b, c)
  // Override computed angles with exact input values (avoids rounding drift)
  vals.alpha = alpha
  vals.beta  = beta
  vals.gamma = gamma

  const method = known.gamma !== undefined || known.beta !== undefined || known.alpha !== undefined
    ? 'Sinussatz (WWS/WSW)'
    : 'Sinussatz (WSW)'

  const sol: Solution = {
    values: vals,
    method,
    formulas: [
      `γ = 180° - α - β`,
      `a/sin(α) = b/sin(β) = c/sin(γ)`,
    ],
  }
  return { solutions: [sol] }
}

function solveSSW(known: Partial<Record<string, number>>): SolveResult {
  // Ambiguous case: 2 sides + non-included angle
  // Canonical form: sides a, b and angle alpha (opposite to a)
  // We normalise to always work with: known angle α opposite to side a, with b as the other side
  let a: number, b: number, alphaKnown: number, swapped = false

  if (known.a !== undefined && known.b !== undefined && known.alpha !== undefined) {
    a = known.a; b = known.b; alphaKnown = known.alpha
  } else if (known.a !== undefined && known.b !== undefined && known.beta !== undefined) {
    // Swap: beta is opposite b → rename so alpha is the known angle opposite a
    a = known.b; b = known.a; alphaKnown = known.beta; swapped = true
  } else if (known.a !== undefined && known.c !== undefined && known.alpha !== undefined) {
    a = known.a; b = known.c; alphaKnown = known.alpha
  } else if (known.b !== undefined && known.c !== undefined && known.beta !== undefined) {
    a = known.b; b = known.c; alphaKnown = known.beta
  } else if (known.b !== undefined && known.c !== undefined && known.gamma !== undefined) {
    a = known.c; b = known.b; alphaKnown = known.gamma; swapped = true
  } else if (known.a !== undefined && known.c !== undefined && known.gamma !== undefined) {
    a = known.c; b = known.a; alphaKnown = known.gamma; swapped = true
  } else {
    return { solutions: [], error: 'Ungültige SSW-Kombination.' }
  }

  if (a <= 0 || b <= 0) return { solutions: [], error: 'Seiten müssen positiv sein.' }
  if (alphaKnown <= 0 || alphaKnown >= 180) return { solutions: [], error: 'Winkel muss zwischen 0° und 180° liegen.' }

  const alphaRad = toRad(alphaKnown)
  const sinBeta = (b * Math.sin(alphaRad)) / a

  if (sinBeta > 1 + EPS) {
    return { solutions: [], error: 'Kein Dreieck möglich (sin(β) > 1).' }
  }

  const solutions: Solution[] = []

  // First solution
  const beta1Rad = Math.asin(Math.min(sinBeta, 1))
  const beta1 = toDeg(beta1Rad)
  const gamma1 = 180 - alphaKnown - beta1

  if (gamma1 > EPS) {
    // Sine rule to get side c
    const c1 = a * Math.sin(toRad(gamma1)) / Math.sin(alphaRad)
    // Reconstruct original sides mapping
    let finalA: number, finalB: number, finalC: number
    if (!swapped) {
      // original: known.a, known.b (or known.c), alpha
      // a=known.a, beta1 opposite b
      finalA = a; finalB = b; finalC = c1
    } else {
      finalA = c1; finalB = a; finalC = b
    }
    const err1 = validateSides(finalA, finalB, finalC)
    if (!err1) {
      const vals1 = computeDerivedValues(finalA, finalB, finalC)
      solutions.push({
        values: vals1,
        method: 'Sinussatz (SSW) – Lösung 1',
        formulas: [`sin(β)/b = sin(α)/a`, `γ = 180° - α - β`, `c = a·sin(γ)/sin(α)`],
      })
    }
  }

  // Second solution (only if alpha < 90° and beta1 !== 90° and not degenerate)
  const beta2 = 180 - beta1
  const gamma2 = 180 - alphaKnown - beta2

  if (gamma2 > EPS && Math.abs(beta1 - beta2) > EPS) {
    const c2 = a * Math.sin(toRad(gamma2)) / Math.sin(alphaRad)
    let finalA: number, finalB: number, finalC: number
    if (!swapped) {
      finalA = a; finalB = b; finalC = c2
    } else {
      finalA = c2; finalB = a; finalC = b
    }
    const err2 = validateSides(finalA, finalB, finalC)
    if (!err2) {
      const vals2 = computeDerivedValues(finalA, finalB, finalC)
      solutions.push({
        values: vals2,
        method: 'Sinussatz (SSW) – Lösung 2',
        formulas: [`sin(β)/b = sin(α)/a`, `γ = 180° - α - β'`, `c = a·sin(γ)/sin(α)`],
      })
    }
  }

  if (solutions.length === 0) {
    return { solutions: [], error: 'Kein gültiges Dreieck gefunden.' }
  }

  return { solutions }
}

function classifyInputs(known: Partial<Record<string, number>>): string {
  const keys = Object.keys(known).filter(k => known[k] !== undefined)
  const sides  = keys.filter(k => ['a', 'b', 'c'].includes(k))
  const angles = keys.filter(k => ['alpha', 'beta', 'gamma'].includes(k))

  const nSides  = sides.length
  const nAngles = angles.length

  if (nSides === 3 && nAngles === 0) return 'SSS'
  if (nSides === 2 && nAngles === 1) {
    // Determine if it's SWS (included angle) or SSW (non-included)
    const hasSideA = known.a !== undefined
    const hasSideB = known.b !== undefined
    const hasSideC = known.c !== undefined

    // SWS: angle is included between the two sides
    // a opposite alpha, b opposite beta, c opposite gamma
    // Included combos: a+b+gamma, a+c+beta, b+c+alpha
    if (hasSideA && hasSideB && known.gamma !== undefined) return 'SWS'
    if (hasSideA && hasSideC && known.beta  !== undefined) return 'SWS'
    if (hasSideB && hasSideC && known.alpha !== undefined) return 'SWS'
    return 'SSW'
  }
  if (nSides === 1 && nAngles === 2) return 'WSW_WWS'
  if (nSides === 0 && nAngles === 3) return 'WWW' // underdetermined
  return 'UNKNOWN'
}

function solve(known: Partial<Record<string, number>>): SolveResult {
  // Validate no negative values
  for (const [key, val] of Object.entries(known)) {
    if (val !== undefined && val <= 0) {
      return { solutions: [], error: `Wert für ${key} muss positiv sein.` }
    }
  }

  const type = classifyInputs(known)

  switch (type) {
    case 'SSS':       return solveSSS(known)
    case 'SWS':       return solveSWS(known)
    case 'WSW_WWS':   return solveWSW_WWS(known)
    case 'SSW':       return solveSSW(known)
    case 'WWW':       return { solutions: [], error: 'Mit nur Winkeln kann kein Dreieck eindeutig bestimmt werden.' }
    default:          return { solutions: [], error: 'Ungültige oder unvollständige Eingabe.' }
  }
}

function toSVG(values: Record<string, number>, size: number): SVGData {
  const { a, b, c } = values
  if (!a || !b || !c) {
    return { points: [], lines: [], width: size, height: size }
  }

  const padding = size * 0.15

  // Place triangle: A at origin, B along x-axis
  const axA = 0, ayA = 0
  const axB = c, ayB = 0

  // C via cosine rule
  const cosA = (b * b + c * c - a * a) / (2 * b * c)
  const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA))
  const axC = b * cosA
  const ayC = b * sinA // positive = upward in math coords

  // Bounding box
  const xs = [axA, axB, axC]
  const ys = [ayA, ayB, ayC]
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)

  const drawW = size - 2 * padding
  const drawH = size - 2 * padding

  const scaleX = drawW / (maxX - minX || 1)
  const scaleY = drawH / (maxY - minY || 1)
  const scale  = Math.min(scaleX, scaleY)

  const offsetX = padding + (drawW - (maxX - minX) * scale) / 2
  const offsetY = padding + (drawH - (maxY - minY) * scale) / 2

  const proj = (x: number, y: number) => ({
    x: offsetX + (x - minX) * scale,
    // Flip Y: SVG y increases downward, math y increases upward
    y: size - (offsetY + (y - minY) * scale),
  })

  const pA = proj(axA, ayA)
  const pB = proj(axB, ayB)
  const pC = proj(axC, ayC)

  const fmt = (n: number) => Math.round(n * 100) / 100

  return {
    points: [
      { ...pA, label: 'A' },
      { ...pB, label: 'B' },
      { ...pC, label: 'C' },
    ],
    lines: [
      { from: 0, to: 1, label: `c = ${fmt(c)}` }, // A-B
      { from: 1, to: 2, label: `a = ${fmt(a)}` }, // B-C
      { from: 2, to: 0, label: `b = ${fmt(b)}` }, // C-A
    ],
    width: size,
    height: size,
  }
}

const inputs: InputDefinition[] = [
  { key: 'a',     label: 'Seite a',   unit: 'length' },
  { key: 'b',     label: 'Seite b',   unit: 'length' },
  { key: 'c',     label: 'Seite c',   unit: 'length' },
  { key: 'alpha', label: 'Winkel α',  unit: 'angle',  optional: true },
  { key: 'beta',  label: 'Winkel β',  unit: 'angle',  optional: true },
  { key: 'gamma', label: 'Winkel γ',  unit: 'angle',  optional: true },
]

export const dreieck: Shape = {
  id: 'dreieck',
  label: 'Dreieck',
  inputs,
  minRequired: 3,
  solve,
  toSVG,
}
