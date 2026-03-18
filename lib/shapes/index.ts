import { dreieck } from './dreieck'
import { kreis } from './kreis'
import { rechteck } from './rechteck'
import { trapez } from './trapez'
import { parallelogramm } from './parallelogramm'
import { raute } from './raute'
import { wuerfel } from './wuerfel'
import { quader } from './quader'
import { kugel } from './kugel'
import { zylinder } from './zylinder'
import { kegel } from './kegel'
import { pyramide } from './pyramide'
import type { Shape } from './types'

export const shapes: Record<string, Shape> = {
  dreieck,
  kreis,
  rechteck,
  trapez,
  parallelogramm,
  raute,
  wuerfel,
  quader,
  kugel,
  zylinder,
  kegel,
  pyramide,
}

export const shapeList = Object.values(shapes)
