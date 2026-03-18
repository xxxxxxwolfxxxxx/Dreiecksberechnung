export interface InputDefinition {
  key: string           // z.B. 'a', 'alpha', 'flaeche'
  label: string         // z.B. 'Seite a', 'Winkel α'
  unit: 'length' | 'angle' | 'area' | 'none'
  optional?: boolean
}

export interface Solution {
  values: Record<string, number | string>
  method: string        // z.B. 'Kosinussatz (SSS)'
  formulas: string[]    // Klartext-Beschreibung der verwendeten Formeln
  steps: string[]       // Schritt-für-Schritt-Lösungsweg
}

export interface SolveResult {
  solutions: Solution[]
  error?: string
}

export interface SVGData {
  points: Array<{ x: number; y: number; label: string }>
  lines: Array<{ from: number; to: number; label?: string }>
  width: number
  height: number
}

export interface Shape {
  id: string
  label: string
  inputs: InputDefinition[]
  minRequired: number
  defaultValues: Record<string, number>  // Platzhalter-Werte für Preview-Zeichnung
  solve(known: Partial<Record<string, number>>): SolveResult
  toSVG(values: Record<string, number>, size: number): SVGData
}
