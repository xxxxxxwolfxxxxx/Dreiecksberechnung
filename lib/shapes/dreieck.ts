import { Shape, SolveResult, SVGData, Solution, InputDefinition } from './types'
import { formatNumber } from '../format'

const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

const EPS = 1e-9
const fmt = formatNumber

function computeDerivedValues(a: number, b: number, c: number): Record<string, number | string> {
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
    typ,
  }
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
  const alpha = vals.alpha as number
  const beta = vals.beta as number
  const gamma = vals.gamma as number
  const umfang = vals.umfang as number
  const s = umfang / 2
  const flaeche = vals.flaeche as number

  const cosAlpha = (b * b + c * c - a * a) / (2 * b * c)

  const steps = [
    `Gegeben sind drei Seiten: a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}.`,
    `Winkel \u03B1 berechnen (Kosinussatz):\ncos(\u03B1) = (b\u00B2 + c\u00B2 \u2212 a\u00B2) / (2\u00B7b\u00B7c)\ncos(\u03B1) = (${fmt(b)}\u00B2 + ${fmt(c)}\u00B2 \u2212 ${fmt(a)}\u00B2) / (2\u00B7${fmt(b)}\u00B7${fmt(c)}) = ${fmt(cosAlpha)}\n\u03B1 = ${fmt(alpha)}\u00B0`,
    `Winkel \u03B2 berechnen (Kosinussatz):\ncos(\u03B2) = (a\u00B2 + c\u00B2 \u2212 b\u00B2) / (2\u00B7a\u00B7c)\n\u03B2 = ${fmt(beta)}\u00B0`,
    `Winkel \u03B3 aus der Winkelsumme:\n\u03B3 = 180\u00B0 \u2212 \u03B1 \u2212 \u03B2 = 180\u00B0 \u2212 ${fmt(alpha)}\u00B0 \u2212 ${fmt(beta)}\u00B0 = ${fmt(gamma)}\u00B0`,
    `Fl\u00E4che berechnen (Heron\u2019sche Formel):\ns = (a+b+c)/2 = ${fmt(s)}\nA = \u221A(s\u00B7(s\u2212a)\u00B7(s\u2212b)\u00B7(s\u2212c))\nA = \u221A(${fmt(s)}\u00B7${fmt(s - a)}\u00B7${fmt(s - b)}\u00B7${fmt(s - c)}) = ${fmt(flaeche)}`,
    `Umfang:\nU = a + b + c = ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(umfang)}`,
  ]

  const sol: Solution = {
    values: vals,
    method: 'Kosinussatz (SSS)',
    formulas: [
      `\u03B1 = arccos((b\u00B2+c\u00B2-a\u00B2)/(2bc))`,
      `\u03B2 = arccos((a\u00B2+c\u00B2-b\u00B2)/(2ac))`,
      `\u03B3 = arccos((a\u00B2+b\u00B2-c\u00B2)/(2ab))`,
    ],
    steps,
  }
  return { solutions: [sol] }
}

function solveSWS(known: Partial<Record<string, number>>): SolveResult {
  // Need 2 sides + 1 angle. Identify the included angle.
  // Supported combos: a,b,gamma | a,c,beta | b,c,alpha
  let a: number, b: number, c: number
  let givenDesc: string
  let computedSide: string

  if (known.a !== undefined && known.b !== undefined && known.gamma !== undefined) {
    a = known.a; b = known.b
    const gammaRad = toRad(known.gamma)
    c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gammaRad))
    givenDesc = `a = ${fmt(a)}, b = ${fmt(b)}, \u03B3 = ${fmt(known.gamma)}\u00B0`
    computedSide = `c = \u221A(a\u00B2 + b\u00B2 \u2212 2\u00B7a\u00B7b\u00B7cos(\u03B3))\nc = \u221A(${fmt(a)}\u00B2 + ${fmt(b)}\u00B2 \u2212 2\u00B7${fmt(a)}\u00B7${fmt(b)}\u00B7cos(${fmt(known.gamma)}\u00B0)) = ${fmt(c)}`
  } else if (known.a !== undefined && known.c !== undefined && known.beta !== undefined) {
    a = known.a; c = known.c
    const betaRad = toRad(known.beta)
    b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(betaRad))
    givenDesc = `a = ${fmt(a)}, c = ${fmt(c)}, \u03B2 = ${fmt(known.beta)}\u00B0`
    computedSide = `b = \u221A(a\u00B2 + c\u00B2 \u2212 2\u00B7a\u00B7c\u00B7cos(\u03B2)) = ${fmt(b)}`
  } else if (known.b !== undefined && known.c !== undefined && known.alpha !== undefined) {
    b = known.b; c = known.c
    const alphaRad = toRad(known.alpha)
    a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(alphaRad))
    givenDesc = `b = ${fmt(b)}, c = ${fmt(c)}, \u03B1 = ${fmt(known.alpha)}\u00B0`
    computedSide = `a = \u221A(b\u00B2 + c\u00B2 \u2212 2\u00B7b\u00B7c\u00B7cos(\u03B1)) = ${fmt(a)}`
  } else {
    return { solutions: [], error: 'Ung\u00FCltige SWS-Kombination.' }
  }

  const err = validateSides(a, b, c)
  if (err) return { solutions: [], error: err }

  const vals = computeDerivedValues(a, b, c)
  const alpha = vals.alpha as number
  const beta = vals.beta as number
  const gamma = vals.gamma as number
  const flaeche = vals.flaeche as number
  const umfang = vals.umfang as number

  const steps = [
    `Gegeben: ${givenDesc}`,
    `Fehlende Seite mit dem Kosinussatz berechnen:\n${computedSide}`,
    `Restliche Winkel mit dem Kosinussatz:\n\u03B1 = ${fmt(alpha)}\u00B0, \u03B2 = ${fmt(beta)}\u00B0, \u03B3 = ${fmt(gamma)}\u00B0`,
    `Fl\u00E4che (Heron):\nA = ${fmt(flaeche)}`,
    `Umfang:\nU = ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(umfang)}`,
  ]

  const sol: Solution = {
    values: vals,
    method: 'Kosinussatz (SWS)',
    formulas: [`c = \u221A(a\u00B2+b\u00B2-2ab\u00B7cos(\u03B3))`],
    steps,
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
    return { solutions: [], error: 'Ung\u00FCltige Winkel: Summe muss 180\u00B0 ergeben.' }
  }

  // Find the known side and compute all sides via sine rule: a/sin(α) = b/sin(β) = c/sin(γ)
  let a: number, b: number, c: number
  let knownSideDesc: string

  if (known.a !== undefined) {
    a = known.a
    b = a * Math.sin(toRad(beta))  / Math.sin(toRad(alpha))
    c = a * Math.sin(toRad(gamma)) / Math.sin(toRad(alpha))
    knownSideDesc = `a = ${fmt(a)}`
  } else if (known.b !== undefined) {
    b = known.b
    a = b * Math.sin(toRad(alpha)) / Math.sin(toRad(beta))
    c = b * Math.sin(toRad(gamma)) / Math.sin(toRad(beta))
    knownSideDesc = `b = ${fmt(b)}`
  } else if (known.c !== undefined) {
    c = known.c
    a = c * Math.sin(toRad(alpha)) / Math.sin(toRad(gamma))
    b = c * Math.sin(toRad(beta))  / Math.sin(toRad(gamma))
    knownSideDesc = `c = ${fmt(c)}`
  } else {
    return { solutions: [], error: 'Keine bekannte Seite f\u00FCr WSW/WWS.' }
  }

  const err = validateSides(a, b, c)
  if (err) return { solutions: [], error: err }

  const vals = computeDerivedValues(a, b, c)
  // Override computed angles with exact input values (avoids rounding drift)
  vals.alpha = alpha
  vals.beta  = beta
  vals.gamma = gamma

  const flaeche = vals.flaeche as number
  const umfang = vals.umfang as number

  const givenAngles = []
  if (known.alpha !== undefined) givenAngles.push(`\u03B1 = ${fmt(known.alpha)}\u00B0`)
  if (known.beta !== undefined) givenAngles.push(`\u03B2 = ${fmt(known.beta)}\u00B0`)
  if (known.gamma !== undefined) givenAngles.push(`\u03B3 = ${fmt(known.gamma)}\u00B0`)

  const steps = [
    `Gegeben: ${givenAngles.join(', ')} und ${knownSideDesc}`,
    `Fehlenden Winkel aus der Winkelsumme:\n\u03B1 + \u03B2 + \u03B3 = 180\u00B0\n\u03B1 = ${fmt(alpha)}\u00B0, \u03B2 = ${fmt(beta)}\u00B0, \u03B3 = ${fmt(gamma)}\u00B0`,
    `Seiten mit dem Sinussatz berechnen:\na/sin(\u03B1) = b/sin(\u03B2) = c/sin(\u03B3)\na = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`,
    `Fl\u00E4che (Heron):\nA = ${fmt(flaeche)}`,
    `Umfang:\nU = ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(umfang)}`,
  ]

  const method = known.gamma !== undefined || known.beta !== undefined || known.alpha !== undefined
    ? 'Sinussatz (WWS/WSW)'
    : 'Sinussatz (WSW)'

  const sol: Solution = {
    values: vals,
    method,
    formulas: [
      `\u03B3 = 180\u00B0 - \u03B1 - \u03B2`,
      `a/sin(\u03B1) = b/sin(\u03B2) = c/sin(\u03B3)`,
    ],
    steps,
  }
  return { solutions: [sol] }
}

function solveSSW(known: Partial<Record<string, number>>): SolveResult {
  // Ambiguous case: 2 sides + non-included angle
  let a: number, b: number, alphaKnown: number
  let swapType: string = 'none'
  let givenDesc: string

  if (known.a !== undefined && known.b !== undefined && known.alpha !== undefined) {
    a = known.a; b = known.b; alphaKnown = known.alpha
    swapType = 'none'
    givenDesc = `a = ${fmt(known.a)}, b = ${fmt(known.b)}, \u03B1 = ${fmt(known.alpha)}\u00B0`
  } else if (known.a !== undefined && known.b !== undefined && known.beta !== undefined) {
    a = known.b; b = known.a; alphaKnown = known.beta
    swapType = 'ab-beta'
    givenDesc = `a = ${fmt(known.a)}, b = ${fmt(known.b)}, \u03B2 = ${fmt(known.beta)}\u00B0`
  } else if (known.a !== undefined && known.c !== undefined && known.alpha !== undefined) {
    a = known.a; b = known.c; alphaKnown = known.alpha
    swapType = 'ac-alpha'
    givenDesc = `a = ${fmt(known.a)}, c = ${fmt(known.c)}, \u03B1 = ${fmt(known.alpha)}\u00B0`
  } else if (known.b !== undefined && known.c !== undefined && known.beta !== undefined) {
    a = known.b; b = known.c; alphaKnown = known.beta
    swapType = 'bc-beta'
    givenDesc = `b = ${fmt(known.b)}, c = ${fmt(known.c)}, \u03B2 = ${fmt(known.beta)}\u00B0`
  } else if (known.b !== undefined && known.c !== undefined && known.gamma !== undefined) {
    a = known.c; b = known.b; alphaKnown = known.gamma
    swapType = 'bc-gamma'
    givenDesc = `b = ${fmt(known.b)}, c = ${fmt(known.c)}, \u03B3 = ${fmt(known.gamma)}\u00B0`
  } else if (known.a !== undefined && known.c !== undefined && known.gamma !== undefined) {
    a = known.c; b = known.a; alphaKnown = known.gamma
    swapType = 'ac-gamma'
    givenDesc = `a = ${fmt(known.a)}, c = ${fmt(known.c)}, \u03B3 = ${fmt(known.gamma)}\u00B0`
  } else {
    return { solutions: [], error: 'Ung\u00FCltige SSW-Kombination.' }
  }

  if (a <= 0 || b <= 0) return { solutions: [], error: 'Seiten m\u00FCssen positiv sein.' }
  if (alphaKnown <= 0 || alphaKnown >= 180) return { solutions: [], error: 'Winkel muss zwischen 0\u00B0 und 180\u00B0 liegen.' }

  const alphaRad = toRad(alphaKnown)
  const sinBeta = (b * Math.sin(alphaRad)) / a

  if (sinBeta > 1 + EPS) {
    return { solutions: [], error: 'Kein Dreieck m\u00F6glich (sin(\u03B2) > 1).' }
  }

  function remapSides(a_can: number, b_can: number, computed: number): [number, number, number] {
    switch (swapType) {
      case 'none':     return [a_can, b_can, computed]
      case 'ab-beta':  return [b_can, a_can, computed]
      case 'ac-alpha': return [a_can, computed, b_can]
      case 'bc-beta':  return [computed, a_can, b_can]
      case 'bc-gamma': return [computed, b_can, a_can]
      case 'ac-gamma': return [b_can, computed, a_can]
      default:         return [a_can, b_can, computed]
    }
  }

  const solutions: Solution[] = []

  // First solution
  const beta1Rad = Math.asin(Math.min(sinBeta, 1))
  const beta1 = toDeg(beta1Rad)
  const gamma1 = 180 - alphaKnown - beta1

  if (gamma1 > EPS) {
    const c1 = a * Math.sin(toRad(gamma1)) / Math.sin(alphaRad)
    const [finalA, finalB, finalC] = remapSides(a, b, c1)
    const err1 = validateSides(finalA, finalB, finalC)
    if (!err1) {
      const vals1 = computeDerivedValues(finalA, finalB, finalC)
      const v1alpha = vals1.alpha as number
      const v1beta = vals1.beta as number
      const v1gamma = vals1.gamma as number
      const v1flaeche = vals1.flaeche as number
      const v1umfang = vals1.umfang as number

      const steps1 = [
        `Gegeben: ${givenDesc}`,
        `Sinussatz anwenden:\nsin(\u03B2) / b = sin(\u03B1) / a\nsin(\u03B2) = ${fmt(b)} \u00B7 sin(${fmt(alphaKnown)}\u00B0) / ${fmt(a)} = ${fmt(sinBeta)}`,
        `\u03B2 = arcsin(${fmt(sinBeta)}) = ${fmt(beta1)}\u00B0`,
        `Fehlenden Winkel berechnen:\n\u03B3 = 180\u00B0 \u2212 ${fmt(alphaKnown)}\u00B0 \u2212 ${fmt(beta1)}\u00B0 = ${fmt(gamma1)}\u00B0`,
        `Fehlende Seite mit dem Sinussatz:\nc = a \u00B7 sin(\u03B3) / sin(\u03B1) = ${fmt(c1)}`,
        `Ergebnis: a = ${fmt(finalA)}, b = ${fmt(finalB)}, c = ${fmt(finalC)}\n\u03B1 = ${fmt(v1alpha)}\u00B0, \u03B2 = ${fmt(v1beta)}\u00B0, \u03B3 = ${fmt(v1gamma)}\u00B0\nA = ${fmt(v1flaeche)}, U = ${fmt(v1umfang)}`,
      ]

      solutions.push({
        values: vals1,
        method: 'Sinussatz (SSW) \u2013 L\u00F6sung 1',
        formulas: [`sin(\u03B2)/b = sin(\u03B1)/a`, `\u03B3 = 180\u00B0 - \u03B1 - \u03B2`, `c = a\u00B7sin(\u03B3)/sin(\u03B1)`],
        steps: steps1,
      })
    }
  }

  // Second solution (only if alpha < 90° and beta1 !== 90° and not degenerate)
  const beta2 = 180 - beta1
  const gamma2 = 180 - alphaKnown - beta2

  if (gamma2 > EPS && Math.abs(beta1 - beta2) > EPS) {
    const c2 = a * Math.sin(toRad(gamma2)) / Math.sin(alphaRad)
    const [finalA, finalB, finalC] = remapSides(a, b, c2)
    const err2 = validateSides(finalA, finalB, finalC)
    if (!err2) {
      const vals2 = computeDerivedValues(finalA, finalB, finalC)
      const v2alpha = vals2.alpha as number
      const v2beta = vals2.beta as number
      const v2gamma = vals2.gamma as number
      const v2flaeche = vals2.flaeche as number
      const v2umfang = vals2.umfang as number

      const steps2 = [
        `Gegeben: ${givenDesc}`,
        `Mehrdeutiger Fall (SSW): sin(\u03B2) = ${fmt(sinBeta)} hat zwei m\u00F6gliche Winkel.`,
        `Zweite L\u00F6sung: \u03B2' = 180\u00B0 \u2212 ${fmt(beta1)}\u00B0 = ${fmt(beta2)}\u00B0`,
        `\u03B3' = 180\u00B0 \u2212 ${fmt(alphaKnown)}\u00B0 \u2212 ${fmt(beta2)}\u00B0 = ${fmt(gamma2)}\u00B0`,
        `c' = a \u00B7 sin(\u03B3') / sin(\u03B1) = ${fmt(c2)}`,
        `Ergebnis: a = ${fmt(finalA)}, b = ${fmt(finalB)}, c = ${fmt(finalC)}\n\u03B1 = ${fmt(v2alpha)}\u00B0, \u03B2 = ${fmt(v2beta)}\u00B0, \u03B3 = ${fmt(v2gamma)}\u00B0\nA = ${fmt(v2flaeche)}, U = ${fmt(v2umfang)}`,
      ]

      solutions.push({
        values: vals2,
        method: 'Sinussatz (SSW) \u2013 L\u00F6sung 2',
        formulas: [`sin(\u03B2)/b = sin(\u03B1)/a`, `\u03B3 = 180\u00B0 - \u03B1 - \u03B2'`, `c = a\u00B7sin(\u03B3)/sin(\u03B1)`],
        steps: steps2,
      })
    }
  }

  if (solutions.length === 0) {
    return { solutions: [], error: 'Kein g\u00FCltiges Dreieck gefunden.' }
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
      return { solutions: [], error: `Wert f\u00FCr ${key} muss positiv sein.` }
    }
  }

  // Höhen in Seiten umrechnen: h_a = 2*A/a → brauchen eine weitere Größe
  // Einfacher Fall: h_a + eine Seite → A bekannt, dann SSS oder SWS möglich
  // h_a = 2*A/a, h_b = 2*A/b, h_c = 2*A/c
  // Mit zwei Seiten und einer Höhe: A = h_a * a / 2, dann dritte Seite via Heron
  // Für jetzt: h + Seite → andere Seiten berechnen wenn zwei Seiten bekannt
  const derived = { ...known }
  // h_a bekannt + a bekannt → Fläche bekannt
  if (derived.h_a && derived.a && !derived.h_b && !derived.h_c) {
    const A = derived.h_a * derived.a / 2
    // Mit A und a: wenn b bekannt → c via Heron; wenn c bekannt → b via Heron
    if (derived.b && !derived.c) {
      // A = sqrt(s(s-a)(s-b)(s-c)), lösen nach c numerisch – zu komplex
      // Einfacher: h_a + a + b = bekannt → Winkel gamma via A = (1/2)*a*b*sin(gamma)
      const sinGamma = (2 * A) / (derived.a * derived.b)
      if (sinGamma <= 1) {
        derived.gamma = toDeg(Math.asin(sinGamma))
        delete derived.h_a
        return solve(derived) // SWS
      }
    }
    if (derived.c && !derived.b) {
      const sinBeta = (2 * A) / (derived.a * derived.c)
      if (sinBeta <= 1) {
        derived.beta = toDeg(Math.asin(sinBeta))
        delete derived.h_a
        return solve(derived)
      }
    }
  }
  if (derived.h_b && derived.b && !derived.h_a && !derived.h_c) {
    const A = derived.h_b * derived.b / 2
    if (derived.a && !derived.c) {
      const sinGamma = (2 * A) / (derived.a * derived.b)
      if (sinGamma <= 1) { derived.gamma = toDeg(Math.asin(sinGamma)); delete derived.h_b; return solve(derived) }
    }
    if (derived.c && !derived.a) {
      const sinAlpha = (2 * A) / (derived.b * derived.c)
      if (sinAlpha <= 1) { derived.alpha = toDeg(Math.asin(sinAlpha)); delete derived.h_b; return solve(derived) }
    }
  }
  if (derived.h_c && derived.c && !derived.h_a && !derived.h_b) {
    const A = derived.h_c * derived.c / 2
    if (derived.a && !derived.b) {
      const sinBeta = (2 * A) / (derived.a * derived.c)
      if (sinBeta <= 1) { derived.beta = toDeg(Math.asin(sinBeta)); delete derived.h_c; return solve(derived) }
    }
    if (derived.b && !derived.a) {
      const sinAlpha = (2 * A) / (derived.b * derived.c)
      if (sinAlpha <= 1) { derived.alpha = toDeg(Math.asin(sinAlpha)); delete derived.h_c; return solve(derived) }
    }
  }

  // Winkelfelder prüfen
  const angleKeys = ['alpha', 'beta', 'gamma']
  for (const key of angleKeys) {
    if (derived[key] !== undefined) {
      if (derived[key]! >= 180) {
        return { solutions: [], error: 'Winkel muss kleiner als 180\u00B0 sein' }
      }
    }
  }

  const type = classifyInputs(derived)
  known = derived

  switch (type) {
    case 'SSS':       return solveSSS(known)
    case 'SWS':       return solveSWS(known)
    case 'WSW_WWS':   return solveWSW_WWS(known)
    case 'SSW':       return solveSSW(known)
    case 'WWW':       return { solutions: [], error: 'Mit nur Winkeln kann kein Dreieck eindeutig bestimmt werden.' }
    default:          return { solutions: [], error: 'Ung\u00FCltige oder unvollst\u00E4ndige Eingabe. Tipp: Gib mind. 3 Werte ein (Seiten und/oder Winkel).' }
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

  const fmtSvg = (n: number) => Math.round(n * 100) / 100

  // Winkel-Labels: leicht ins Innere verschoben
  const cx = (pA.x + pB.x + pC.x) / 3
  const cy = (pA.y + pB.y + pC.y) / 3
  const off = 18
  const angleLabel = (p: {x:number,y:number}, text: string) => ({
    x: p.x + (cx - p.x) / Math.hypot(cx - p.x, cy - p.y) * off,
    y: p.y + (cy - p.y) / Math.hypot(cx - p.x, cy - p.y) * off,
    text,
  })

  const alpha = values.alpha
  const beta  = values.beta
  const gamma = values.gamma

  return {
    points: [
      { ...pA, label: 'A' },
      { ...pB, label: 'B' },
      { ...pC, label: 'C' },
    ],
    lines: [
      { from: 0, to: 1, label: `c = ${fmtSvg(c)}` }, // A-B
      { from: 1, to: 2, label: `a = ${fmtSvg(a)}` }, // B-C
      { from: 2, to: 0, label: `b = ${fmtSvg(b)}` }, // C-A
    ],
    labels: [
      alpha !== undefined ? angleLabel(pA, `\u03B1=${fmtSvg(alpha)}\u00B0`) : angleLabel(pA, '\u03B1'),
      beta  !== undefined ? angleLabel(pB, `\u03B2=${fmtSvg(beta)}\u00B0`)  : angleLabel(pB, '\u03B2'),
      gamma !== undefined ? angleLabel(pC, `\u03B3=${fmtSvg(gamma)}\u00B0`) : angleLabel(pC, '\u03B3'),
    ],
    width: size,
    height: size,
  }
}

const inputs: InputDefinition[] = [
  { key: 'a',     label: 'Seite a',      unit: 'length' },
  { key: 'b',     label: 'Seite b',      unit: 'length' },
  { key: 'c',     label: 'Seite c',      unit: 'length' },
  { key: 'alpha', label: 'Winkel \u03B1', unit: 'angle',  optional: true },
  { key: 'beta',  label: 'Winkel \u03B2', unit: 'angle',  optional: true },
  { key: 'gamma', label: 'Winkel \u03B3', unit: 'angle',  optional: true },
  { key: 'h_a',   label: 'H\u00F6he h\u2090', unit: 'length', optional: true },
  { key: 'h_b',   label: 'H\u00F6he h\u2095', unit: 'length', optional: true },
  { key: 'h_c',   label: 'H\u00F6he h\u1D9C', unit: 'length', optional: true },
]

export const dreieck: Shape = {
  id: 'dreieck',
  label: 'Dreieck',
  inputs,
  minRequired: 3,
  defaultValues: { a: 3, b: 4, c: 5, alpha: 36.87, beta: 53.13, gamma: 90, flaeche: 6, umfang: 12, h_a: 4, h_b: 3, h_c: 2.4, inkreis: 1, umkreis: 2.5 },
  solve,
  toSVG,
}
