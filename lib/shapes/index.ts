import { dreieck } from './dreieck'
import { kreis } from './kreis'
import { rechteck } from './rechteck'
import { trapez } from './trapez'
import { parallelogramm } from './parallelogramm'
import { raute } from './raute'
import type { Shape } from './types'

export const shapes: Record<string, Shape> = {
  dreieck,
  kreis,
  rechteck,
  trapez,
  parallelogramm,
  raute,
}

export const shapeList = Object.values(shapes)
