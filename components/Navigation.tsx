'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { shapeList } from '@/lib/shapes'
import { PEILUNGS_ROUTEN } from '@/lib/navigation/routen'
import { pfadFuerForm, istAktiverPfad } from '@/lib/navigation/pfade'

const SHAPES_2D = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
const SHAPES_3D = ['wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide']

export function Navigation() {
  const pathname = usePathname()
  const shapes2d = shapeList.filter(s => SHAPES_2D.includes(s.id))
  const shapes3d = shapeList.filter(s => SHAPES_3D.includes(s.id))
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 60) { setVisible(true); lastY.current = y; return }
      setVisible(y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Jede Rubrik hat ihre eigene Akzentfarbe: 2D indigo, 3D amber, Navigation teal.
  const AKTIV_KLASSEN = {
    indigo: 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400/20',
    amber: 'bg-amber-100 text-amber-700 ring-2 ring-amber-400/20',
    teal: 'bg-teal-100 text-teal-700 ring-2 ring-teal-400/20',
  } as const

  const linkClass = (id: string, farbe: keyof typeof AKTIV_KLASSEN) =>
    `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
      istAktiverPfad(pathname, id)
        ? AKTIV_KLASSEN[farbe]
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <nav className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              G
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              Geo<span className="text-indigo-600">Rechner</span>
            </span>
          </Link>
          <div className="hidden sm:flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Mathe macht Spaß!</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {/* 2D-Formen */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
              2D
            </span>
            <div className="flex gap-1">
              {shapes2d.map(shape => (
                <Link key={shape.id} href={pfadFuerForm(shape.id)} className={linkClass(shape.id, 'indigo')}>
                  {shape.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 3D-Körper */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-50 px-2 py-1 rounded">
              3D
            </span>
            <div className="flex gap-1">
              {shapes3d.map(shape => (
                <Link key={shape.id} href={pfadFuerForm(shape.id)} className={linkClass(shape.id, 'amber')}>
                  {shape.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation auf dem Wasser – Dreiecksmathematik in der Seefahrt */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 bg-teal-50 px-2 py-1 rounded">
              See
            </span>
            <div className="flex gap-1">
              {PEILUNGS_ROUTEN.map(route => (
                <Link key={route.id} href={`/${route.id}`} className={linkClass(route.id, 'teal')}>
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
