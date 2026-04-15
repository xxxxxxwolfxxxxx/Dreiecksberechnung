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
    title: 'Alle 3 Seiten (SSS)',
    description: 'Du kennst alle drei Seitenlängen – das reicht vollkommen!',
    hint: 'Die einfachste Methode',
  },
  {
    id: 'sws',
    title: '2 Seiten + 1 Winkel (SWS)',
    description: 'Du kennst zwei Seiten und den Winkel dazwischen',
    hint: 'Der Klassiker in der Schule',
  },
  {
    id: 'wsw',
    title: '1 Seite + 2 Winkel (WSW)',
    description: 'Du kennst eine Seite und zwei anliegende Winkel',
    hint: 'Für spezielle Aufgaben',
  },
  {
    id: 'www',
    title: 'Weiß nicht / Alle Felder',
    description: 'Gib einfach Werte ein – wir zeigen dir, was möglich ist',
    hint: 'Einfach ausprobieren!',
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
