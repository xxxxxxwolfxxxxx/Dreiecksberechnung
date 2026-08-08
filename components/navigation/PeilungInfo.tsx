import { PEILUNG_INHALTE } from '@/lib/navigation/peilung-inhalte'

interface Props {
  /** Schlüssel aus PEILUNG_INHALTE, gleichzeitig die Route. */
  id: string
}

/** Erklärtext, Formeln, Beispielrechnung und FAQ eines Peilungs-Rechners. */
export function PeilungInfo({ id }: Props) {
  const inhalt = PEILUNG_INHALTE[id]
  if (!inhalt) return null

  return (
    <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
      <section className="p-6 sm:p-8">
        <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{inhalt.titel}</h2>
        <p className="text-slate-600 leading-relaxed text-lg">{inhalt.einleitung}</p>
      </section>

      <section className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
        {inhalt.abschnitte.map(abschnitt => (
          <div key={abschnitt.titel}>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-teal-500 flex-shrink-0" aria-hidden="true" />
              {abschnitt.titel}
            </h3>
            <p className="text-slate-600 leading-relaxed">{abschnitt.text}</p>
          </div>
        ))}
      </section>

      <section className="p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xl">
            📐
          </span>
          Die Formeln dahinter
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {inhalt.formeln.map(eintrag => (
            <div key={eintrag.formel} className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100">
              <div className="font-mono text-base font-black text-teal-800 mb-2 p-3 bg-white rounded-xl border border-teal-100 shadow-sm">
                {eintrag.formel}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{eintrag.erklaerung}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-8 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
            📝
          </span>
          Beispielrechnung
        </h3>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-700 font-medium mb-6 leading-relaxed">{inhalt.beispiel.setup}</p>
          <ol className="space-y-3">
            {inhalt.beispiel.schritte.map((schritt, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                  {i + 1}
                </span>
                <p className="flex-1 text-slate-700 text-sm leading-relaxed pt-1">{schritt}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl">
            ⚓
          </span>
          {inhalt.praxis.titel}
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {inhalt.praxis.vorText}
          <a
            href={inhalt.praxis.linkUrl}
            target="_blank"
            rel="noopener"
            className="font-bold text-teal-700 underline decoration-teal-300 decoration-2 underline-offset-2 hover:text-teal-900"
          >
            {inhalt.praxis.linkText}
          </a>
          {inhalt.praxis.nachText}
        </p>
      </section>

      <section className="p-6 sm:p-8 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xl">
            💬
          </span>
          Häufige Fragen
        </h3>
        <div className="space-y-4">
          {inhalt.faq.map(eintrag => (
            <div key={eintrag.frage} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="font-black text-slate-800 mb-2">{eintrag.frage}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{eintrag.antwort}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
