'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { shapeList } from '@/lib/shapes'
import { PEILUNGS_ROUTEN } from '@/lib/navigation/routen'
import { pfadFuerForm, istAktiverPfad } from '@/lib/navigation/pfade'

const SHAPES_2D = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
const SHAPES_3D = ['wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide']

// Jede Rubrik hat ihre eigene Akzentfarbe: 2D blau, 3D amber, See teal.
const RUBRIK = {
  blau: { label: 'text-brand-600', dot: 'bg-brand-600', aktiv: 'bg-brand-100 !text-brand-700 font-semibold' },
  amber: { label: 'text-[#b86e00]', dot: 'bg-[#e59a1c]', aktiv: 'bg-amber-50 !text-[#8a5200] font-semibold' },
  teal: { label: 'text-[#0d7f74]', dot: 'bg-[#14a394]', aktiv: 'bg-teal-50 !text-[#0d6b62] font-semibold' },
} as const

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

  const linkClass = (id: string, farbe: keyof typeof RUBRIK) =>
    `whitespace-nowrap rounded-lg px-2.5 py-1 text-[13.5px] !no-underline transition-colors ${
      istAktiverPfad(pathname, id)
        ? RUBRIK[farbe].aktiv
        : 'font-medium !text-ink-2 hover:bg-[#f2f4f7] hover:!text-ink'
    }`

  const Reihe = ({ titel, farbe, children }: { titel: string; farbe: keyof typeof RUBRIK; children: React.ReactNode }) => (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
      <span className={`flex w-[34px] flex-shrink-0 items-center gap-1.5 font-mono text-[11px] font-semibold ${RUBRIK[farbe].label}`}>
        <span className={`h-1.5 w-1.5 rounded-[2px] ${RUBRIK[farbe].dot}`} />
        {titel}
      </span>
      <div className="flex gap-0.5">{children}</div>
    </div>
  )

  return (
    <nav className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-line transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-5 pt-3 pb-2.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 !text-ink !no-underline">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-mono text-[15px] font-semibold text-white">
              G
            </span>
            <span className="text-lg font-bold tracking-tight">
              Geo<span className="text-brand-600">Rechner</span>
            </span>
          </Link>
          <span className="hidden sm:inline font-mono text-[11px] tracking-wide text-ink-3">Mathe macht Spaß!</span>
        </div>

        <div className="flex flex-col gap-1">
          <Reihe titel="2D" farbe="blau">
            {shapes2d.map(shape => (
              <Link key={shape.id} href={pfadFuerForm(shape.id)} className={linkClass(shape.id, 'blau')}>
                {shape.label}
              </Link>
            ))}
          </Reihe>
          <Reihe titel="3D" farbe="amber">
            {shapes3d.map(shape => (
              <Link key={shape.id} href={pfadFuerForm(shape.id)} className={linkClass(shape.id, 'amber')}>
                {shape.label}
              </Link>
            ))}
          </Reihe>
          {/* Navigation auf dem Wasser – Dreiecksmathematik in der Seefahrt */}
          <Reihe titel="See" farbe="teal">
            {PEILUNGS_ROUTEN.map(route => (
              <Link key={route.id} href={`/${route.id}`} className={linkClass(route.id, 'teal')}>
                {route.label}
              </Link>
            ))}
          </Reihe>
        </div>
      </div>
    </nav>
  )
}
