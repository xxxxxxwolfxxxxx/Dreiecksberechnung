'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { shapeList } from '@/lib/shapes'

const SHAPES_2D = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
const SHAPES_3D = ['wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide']

export function Navigation() {
  const pathname = usePathname()
  const shapes2d = shapeList.filter(s => SHAPES_2D.includes(s.id))
  const shapes3d = shapeList.filter(s => SHAPES_3D.includes(s.id))

  const linkClass = (id: string) =>
    `whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold transition-all ${
      pathname === `/${id}`
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
    }`

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-2">
        {/* Logo-Zeile */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg font-extrabold text-blue-600 tracking-tight whitespace-nowrap">
            Geo-Rechner
          </span>
          <span className="h-px flex-1 bg-blue-100" />
        </div>

        {/* 2D-Formen */}
        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mr-1 w-5 text-center">
            2D
          </span>
          {shapes2d.map(shape => (
            <Link key={shape.id} href={`/${shape.id}`} className={linkClass(shape.id)}>
              {shape.label}
            </Link>
          ))}
        </div>

        {/* 3D-Körper */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mr-1 w-5 text-center">
            3D
          </span>
          {shapes3d.map(shape => (
            <Link key={shape.id} href={`/${shape.id}`} className={linkClass(shape.id)}>
              {shape.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
