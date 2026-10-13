'use client'

import { getRelatedTriangles } from '@/utils/relatedTriangles'

interface Props {
  typ: string
  onSelect: (values: { a: number; b: number; c: number }) => void
}

export function RelatedTriangles({ typ, onSelect }: Props) {
  const related = getRelatedTriangles(typ)

  return (
    <section className="flex flex-col gap-3.5 rounded-[22px] border border-line bg-white px-5 sm:px-7 py-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold tracking-tight">Noch mehr ausprobieren?</h3>
        <p className="text-sm text-ink-2">
          Vergleiche dein Dreieck mit klassischen Beispielen – ein Klick setzt die Werte ein.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {related.map((tri) => (
          <button
            key={tri.label}
            onClick={() => onSelect({ a: tri.a, b: tri.b, c: tri.c })}
            className="flex flex-col gap-1 rounded-[14px] border-[1.5px] border-line bg-white px-3.5 py-3 text-left transition-colors hover:border-brand-600 hover:bg-brand-50 active:scale-[0.98]"
          >
            <span className="font-mono text-[15px] font-semibold text-ink">{tri.label}</span>
            {tri.description && (
              <span className="text-[12.5px] leading-snug text-ink-3">{tri.description}</span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
