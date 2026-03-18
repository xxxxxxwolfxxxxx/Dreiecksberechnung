import Link from 'next/link'
import { shapeList } from '@/lib/shapes'

const SHAPES_2D = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
const SHAPES_3D = ['wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide']

interface Props {
  currentId: string
}

export function MoreShapes({ currentId }: Props) {
  const shapes2d = shapeList.filter(s => SHAPES_2D.includes(s.id) && s.id !== currentId)
  const shapes3d = shapeList.filter(s => SHAPES_3D.includes(s.id) && s.id !== currentId)

  return (
    <section className="mt-8 rounded-2xl bg-white border border-blue-100 shadow-sm p-4">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Weitere Formen berechnen</h2>

      {shapes2d.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-1.5 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mr-0.5">2D</span>
          {shapes2d.map(s => (
            <Link key={s.id} href={`/${s.id}`}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {shapes3d.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mr-0.5">3D</span>
          {shapes3d.map(s => (
            <Link key={s.id} href={`/${s.id}`}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
