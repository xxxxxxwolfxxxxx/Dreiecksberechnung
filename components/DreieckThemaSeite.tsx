import Link from 'next/link'
import { ShapeCalculator } from '@/components/calculator/ShapeCalculator'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { DREIECK_THEMEN, type DreieckThema } from '@/lib/dreieck-themen'

interface Props {
  thema: DreieckThema
}

/**
 * Rendert eine Dreieck-Themenseite: eigener Erklaertext, eigener Rechenweg,
 * darunter der gemeinsame Dreieck-Rechner. Die H1 kommt aus dem Thema, nicht
 * aus dem Rechner – deshalb laeuft ShapeCalculator hier mit
 * `ueberschriftEbene="h2"`, damit es genau eine H1 pro Seite gibt.
 */
export function DreieckThemaSeite({ thema }: Props) {
  const andereThemen = DREIECK_THEMEN.filter(t => t.id !== thema.id)

  return (
    <>
      <RechnerSchema
        name={thema.h1}
        description={thema.beschreibung}
        path={`/${thema.id}`}
        matheThemen={thema.matheThemen}
      />

      <header className="rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{thema.h1}</h1>
        <p className="mt-3 text-sm sm:text-base text-indigo-100 font-medium">{thema.einleitung}</p>
      </header>

      <section aria-labelledby="braucht-heading" className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
        <h2 id="braucht-heading" className="text-lg font-black text-slate-800 mb-3 tracking-tight">
          Was du dafür kennen musst
        </h2>
        <ul className="space-y-2 text-slate-600">
          {thema.brauchtWerte.map(wert => (
            <li key={wert} className="flex gap-2">
              <span aria-hidden="true" className="text-indigo-400 font-black">·</span>
              <span>{wert}</span>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot slot="1508045799" format="horizontal" className="my-6" minHeight={90} />

      <ShapeCalculator shapeId="dreieck" ueberschriftEbene="h2" />

      <section aria-labelledby="formeln-heading" className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
        <h2 id="formeln-heading" className="text-lg font-black text-slate-800 mb-4 tracking-tight">
          Die Formeln im Überblick
        </h2>
        <dl className="space-y-4">
          {thema.formeln.map(block => (
            <div key={block.formel}>
              <dt className="font-mono text-sm sm:text-base font-bold text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2">
                {block.formel}
              </dt>
              <dd className="mt-2 text-slate-600 text-sm sm:text-base">{block.erklaerung}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="rechenweg-heading" className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
        <h2 id="rechenweg-heading" className="text-lg font-black text-slate-800 mb-2 tracking-tight">
          Beispiel mit Rechenweg
        </h2>
        <p className="text-slate-600 mb-4 text-sm sm:text-base">{thema.rechenweg.aufgabe}</p>
        <ol className="space-y-2">
          {thema.rechenweg.schritte.map((schritt, i) => (
            <li key={schritt} className="flex gap-3 text-slate-600 text-sm sm:text-base">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">
                {i + 1}
              </span>
              <span>{schritt}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="fehler-heading" className="rounded-2xl bg-amber-50 border border-amber-200 shadow-sm p-5">
        <h2 id="fehler-heading" className="text-lg font-black text-amber-900 mb-3 tracking-tight">
          Typische Fehler
        </h2>
        <ul className="space-y-3">
          {thema.haeufigeFehler.map(fehler => (
            <li key={fehler} className="flex gap-2 text-amber-900/80 text-sm sm:text-base">
              <span aria-hidden="true" className="font-black">!</span>
              <span>{fehler}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-labelledby="weitere-heading" className="rounded-2xl bg-white border border-indigo-100 shadow-sm p-5">
        <h2 id="weitere-heading" className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
          Weitere Dreieck-Themen
        </h2>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
              <span className="font-bold text-slate-800">Dreieck komplett berechnen</span>
              <span className="block text-sm text-slate-500">Alle Größen auf einmal: Seiten, Winkel, Höhen, Fläche und Umfang</span>
            </Link>
          </li>
          {andereThemen.map(t => (
            <li key={t.id}>
              <Link href={`/${t.id}`} className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
                <span className="font-bold text-slate-800">{t.h1}</span>
                <span className="block text-sm text-slate-500">{t.linkBeschreibung}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MoreShapes currentId="dreieck" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
