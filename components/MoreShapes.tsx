import Link from 'next/link'
import { shapeList } from '@/lib/shapes'
import { PEILUNGS_ROUTEN } from '@/lib/navigation/routen'
import { pfadFuerForm } from '@/lib/navigation/pfade'

const SHAPES_2D = ['dreieck', 'kreis', 'rechteck', 'trapez', 'parallelogramm', 'raute']
const SHAPES_3D = ['wuerfel', 'quader', 'kugel', 'zylinder', 'kegel', 'pyramide']

interface Props {
  currentId: string
}

const chip = 'whitespace-nowrap rounded-full border border-line px-3 py-1 text-[13.5px] !text-ink-2 !no-underline transition-colors'

export function MoreShapes({ currentId }: Props) {
  const shapes2d = shapeList.filter(s => SHAPES_2D.includes(s.id) && s.id !== currentId)
  const shapes3d = shapeList.filter(s => SHAPES_3D.includes(s.id) && s.id !== currentId)
  const peilungen = PEILUNGS_ROUTEN.filter(r => r.id !== currentId)

  return (
    <section className="rounded-[22px] bg-white border border-line px-6 sm:px-7 py-5 flex flex-col gap-2.5">
      <h2 className="font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-ink-3">Weitere Rechner</h2>

      {shapes2d.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[30px] font-mono text-[11px] font-semibold text-brand-600">2D</span>
          {shapes2d.map(s => (
            <Link key={s.id} href={pfadFuerForm(s.id)} className={`${chip} hover:border-brand-600 hover:!text-brand-700`}>
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {shapes3d.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[30px] font-mono text-[11px] font-semibold text-[#955800]">3D</span>
          {shapes3d.map(s => (
            <Link key={s.id} href={pfadFuerForm(s.id)} className={`${chip} hover:border-[#e59a1c] hover:!text-[#8a5200]`}>
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {peilungen.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[30px] font-mono text-[11px] font-semibold text-[#0d7f74]">See</span>
          {peilungen.map(r => (
            <Link key={r.id} href={`/${r.id}`} className={`${chip} hover:border-[#14a394] hover:!text-[#0d6b62]`}>
              {r.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
