'use client'

interface Props {
  onSelect: (modeId: string) => void
}

interface Mode {
  id: string
  title: string
  description: string
  hint: string
}

const MODES: Mode[] = [
  {
    id: 'sss',
    title: 'Alle 3 Seiten',
    description: 'Du kennst die Längen aller drei Seiten deines Dreiecks.',
    hint: 'SSS',
  },
  {
    id: 'sws',
    title: '2 Seiten + 1 Winkel',
    description: 'Du kennst zwei Seitenlängen und den Winkel zwischen ihnen.',
    hint: 'SWS',
  },
  {
    id: 'wsw',
    title: '1 Seite + 2 Winkel',
    description: 'Du kennst eine Seitenlänge und zwei angrenzende Winkel.',
    hint: 'WSW',
  },
  {
    id: 'www',
    title: 'Weiß nicht / Alle Felder',
    description: 'Du möchtest alle Felder selbst ausfüllen oder weißt nicht, welche Informationen du hast.',
    hint: 'WWW',
  },
]

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-3">
        <h2 className="font-bold text-white text-sm uppercase tracking-wide">
          Was kennst du von deinem Dreieck?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className="group rounded-xl border-2 border-gray-200 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
          >
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
              {mode.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700">
              {mode.description}
            </p>
            <div className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 group-hover:bg-blue-200 group-hover:text-blue-700">
              {mode.hint}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
