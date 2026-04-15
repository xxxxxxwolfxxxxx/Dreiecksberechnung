'use client'

import { getRelatedTriangles } from '@/utils/relatedTriangles'

interface Props {
  typ: string
  onSelect: (values: { a: number; b: number; c: number }) => void
}

export function RelatedTriangles({ typ, onSelect }: Props) {
  const related = getRelatedTriangles(typ)

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-5">
      <h2 className="font-bold text-gray-800 text-sm">🔺 Ähnliche Dreiecke erkunden</h2>
      <p className="text-xs text-gray-600 mt-1">
        Probiere diese Varianten aus und vergleiche die Ergebnisse:
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mt-4">
        {related.map((tri) => (
          <button
            key={tri.label}
            onClick={() => onSelect({ a: tri.a, b: tri.b, c: tri.c })}
            className="border-2 border-purple-300 bg-white hover:border-purple-500 hover:bg-purple-50 rounded-lg p-3 text-left transition-all active:scale-95"
          >
            <div className="font-bold text-sm text-gray-800">{tri.label}</div>
            {tri.description && (
              <div className="text-xs text-gray-600 mt-1">{tri.description}</div>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        💡 Klick auf ein Dreieck → Werte werden eingegeben → Neue Berechnung
      </p>
    </div>
  )
}
