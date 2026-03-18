'use client'
import { useState, useEffect } from 'react'
import { shapes } from '@/lib/shapes'
import { InputPanel } from './InputPanel'
import { ShapeDrawing } from './ShapeDrawing'
import { ResultsPanel } from './ResultsPanel'
import { FormulaExplainer } from './FormulaExplainer'
import type { SolveResult } from '@/lib/shapes/types'

const UNITS = ['mm', 'cm', 'm', 'km']

interface Props {
  shapeId: string
}

export function ShapeCalculator({ shapeId }: Props) {
  const shape = shapes[shapeId]
  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [unit, setUnit] = useState('cm')
  const [result, setResult] = useState<SolveResult | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    setValues({})
    setResult(null)
    setActiveIdx(0)
  }, [shapeId])

  useEffect(() => {
    const filled = Object.values(values).filter(v => v !== undefined && !isNaN(v)).length
    if (filled >= shape.minRequired) {
      setResult(shape.solve(values))
      setActiveIdx(0)
    } else {
      setResult(null)
    }
  }, [values, shape])

  const handleChange = (key: string, value: number | undefined) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const activeSolution = result?.solutions[activeIdx]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{shape.label} berechnen</h1>
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          {UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>

      <InputPanel shape={shape} values={values} onChange={handleChange} unit={unit} />

      {result?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20">
          {result.error}
        </div>
      )}

      {result && result.solutions.length > 1 && (
        <div className="flex gap-2">
          {result.solutions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                i === activeIdx ? 'bg-blue-600 text-white' : 'border border-gray-300'
              }`}
            >
              Lösung {i + 1}
            </button>
          ))}
        </div>
      )}

      {activeSolution && (
        <ShapeDrawing data={shape.toSVG(activeSolution.values as Record<string, number>, 280)} />
      )}

      {activeSolution && (
        <ResultsPanel solution={activeSolution} unit={unit} />
      )}

      {activeSolution && (
        <FormulaExplainer formulas={activeSolution.formulas} method={activeSolution.method} />
      )}
    </div>
  )
}
