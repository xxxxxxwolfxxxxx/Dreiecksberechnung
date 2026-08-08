'use client'
import { useMemo, useState } from 'react'
import { FormulaExplainer } from '@/components/calculator/FormulaExplainer'
import { formatNumber } from '@/lib/format'
import {
  VOREINSTELLUNG_PEILUNG_1,
  VOREINSTELLUNG_PEILUNG_2,
  berechneVersegelungspeilung,
  distanzAusFahrt,
} from '@/lib/navigation/versegelungspeilung'
import { cosGrad, gradInStrich, sinGrad } from '@/lib/navigation/winkel'
import { ErgebnisKachel, MeldungsBox, PeilFeld, PeilKarte, PeilKopf } from './PeilBausteine'
import { PeilSkizze, streckenLabel, type SkizzeLinie, type SkizzePunkt } from './PeilSkizze'

const EINHEITEN = ['sm', 'km', 'm'] as const

/** Gängige Peilpaare aus der Küstennavigation. */
const VORLAGEN = [
  { label: '4 Strich → querab', peilung1: VOREINSTELLUNG_PEILUNG_1, peilung2: VOREINSTELLUNG_PEILUNG_2 },
  { label: '2 Strich → 4 Strich', peilung1: 22.5, peilung2: 45 },
  { label: '30° → 60°', peilung1: 30, peilung2: 60 },
  { label: '3 Strich → 6 Strich', peilung1: 33.75, peilung2: 67.5 },
] as const

type Quelle = 'distanz' | 'fahrtzeit'

function strichHinweis(grad: number | undefined): string {
  if (grad === undefined || !Number.isFinite(grad)) return 'Vom Kurs aus gemessen: 0° voraus, 90° querab'
  return `entspricht ${formatNumber(gradInStrich(grad))} Strich`
}

export function VersegelungRechner() {
  const [peilung1, setPeilung1] = useState<number | undefined>(VOREINSTELLUNG_PEILUNG_1)
  const [peilung2, setPeilung2] = useState<number | undefined>(VOREINSTELLUNG_PEILUNG_2)
  const [distanz, setDistanz] = useState<number | undefined>(2)
  const [fahrt, setFahrt] = useState<number | undefined>(6)
  const [dauer, setDauer] = useState<number | undefined>(20)
  const [quelle, setQuelle] = useState<Quelle>('distanz')
  const [einheit, setEinheit] = useState<string>('sm')

  const distanzAusFahrtZeit = useMemo(
    () => distanzAusFahrt(fahrt ?? NaN, dauer ?? NaN),
    [fahrt, dauer],
  )
  // Fahrt in Knoten ergibt immer Seemeilen — bei km oder m wird die Distanz direkt eingetragen.
  const quelleEffektiv: Quelle = einheit === 'sm' ? quelle : 'distanz'
  const gefahreneDistanz = quelleEffektiv === 'distanz' ? distanz : distanzAusFahrtZeit

  const ausgabe = useMemo(() => {
    if (peilung1 === undefined || peilung2 === undefined || gefahreneDistanz === undefined) return undefined
    return berechneVersegelungspeilung({ peilung1, peilung2, distanz: gefahreneDistanz })
  }, [peilung1, peilung2, gefahreneDistanz])

  const ergebnis = ausgabe?.ok ? ausgabe.ergebnis : undefined

  // Skizze: Kurslinie waagerecht von der ersten zur zweiten Peilung, Objekt darüber.
  const skizze = useMemo(() => {
    if (!ergebnis || gefahreneDistanz === undefined || peilung1 === undefined) return undefined
    const objekt = {
      x: ergebnis.entfernung1 * cosGrad(peilung1),
      y: -ergebnis.entfernung1 * sinGrad(peilung1),
    }
    const punkte: SkizzePunkt[] = [
      { x: 0, y: 0, label: '1. Peilung', art: 'boot' },
      { x: gefahreneDistanz, y: 0, label: '2. Peilung', art: 'boot' },
      { x: objekt.x, y: objekt.y, label: 'Objekt', art: 'objekt' },
      { x: objekt.x, y: 0, label: '', art: 'hilfspunkt' },
    ]
    const linien: SkizzeLinie[] = [
      { von: 0, bis: 1, label: `s = ${streckenLabel(gefahreneDistanz, einheit)}` },
      { von: 0, bis: 2, label: streckenLabel(ergebnis.entfernung1, einheit) },
      { von: 1, bis: 2, label: streckenLabel(ergebnis.entfernung2, einheit) },
      { von: 2, bis: 3, label: `q = ${streckenLabel(ergebnis.querabstand, einheit)}`, gestrichelt: true },
    ]
    if (Math.abs(ergebnis.restweg) > 0.01 * gefahreneDistanz) {
      linien.push({ von: 1, bis: 3, gestrichelt: true })
    }
    return { punkte, linien }
  }, [ergebnis, gefahreneDistanz, peilung1, einheit])

  const quelleKnopf = (wert: Quelle, text: string) => (
    <button
      type="button"
      onClick={() => setQuelle(wert)}
      aria-pressed={quelleEffektiv === wert}
      className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
        quelleEffektiv === wert
          ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
      }`}
    >
      {text}
    </button>
  )

  return (
    <div className="space-y-6">
      <PeilKopf
        titel="Vier-Strich-Peilung berechnen"
        untertitel="Versegelungspeilung mit frei wählbaren Seitenpeilungen — 45° und querab sind voreingestellt."
        einheit={einheit}
        einheiten={EINHEITEN}
        onEinheit={setEinheit}
      />

      <PeilKarte marke="Peildreieck">
        {skizze ? (
          <PeilSkizze
            punkte={skizze.punkte}
            linien={skizze.linien}
            einheit={einheit}
            legende="Kurslinie waagerecht, Winkel und Längenverhältnisse maßstäblich"
          />
        ) : (
          <p className="text-sm text-slate-400 text-center py-10">
            Trage beide Seitenpeilungen und die gefahrene Distanz ein — dann erscheint hier das Peildreieck.
          </p>
        )}
      </PeilKarte>

      <PeilKarte marke="Werte eingeben">
        <div className="grid gap-5 sm:grid-cols-2">
          <PeilFeld
            id="peilung1"
            label="1. Seitenpeilung"
            einheit="°"
            wert={peilung1}
            onChange={setPeilung1}
            hinweis={strichHinweis(peilung1)}
          />
          <PeilFeld
            id="peilung2"
            label="2. Seitenpeilung"
            einheit="°"
            wert={peilung2}
            onChange={setPeilung2}
            hinweis={strichHinweis(peilung2)}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {VORLAGEN.map(vorlage => (
            <button
              key={vorlage.label}
              type="button"
              onClick={() => {
                setPeilung1(vorlage.peilung1)
                setPeilung2(vorlage.peilung2)
              }}
              className="rounded-full border border-teal-100 bg-teal-50/60 px-4 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors"
            >
              {vorlage.label}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">
              Gefahrene Distanz
            </span>
            {quelleKnopf('distanz', 'direkt eingeben')}
            {einheit === 'sm' ? (
              quelleKnopf('fahrtzeit', 'aus Fahrt & Zeit')
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                Fahrt &amp; Zeit rechnet in Seemeilen — dafür oben auf sm umstellen.
              </span>
            )}
          </div>

          {quelleEffektiv === 'distanz' ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <PeilFeld
                id="distanz"
                label="Distanz zwischen den Peilungen"
                einheit={einheit}
                wert={distanz}
                onChange={setDistanz}
                hinweis="Distanz über Grund, aus Log oder GPS"
              />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <PeilFeld
                id="fahrt"
                label="Fahrt über Grund"
                einheit="kn"
                wert={fahrt}
                onChange={setFahrt}
                hinweis="1 kn = 1 sm pro Stunde"
              />
              <PeilFeld
                id="dauer"
                label="Zeit zwischen den Peilungen"
                einheit="min"
                wert={dauer}
                onChange={setDauer}
                hinweis={
                  distanzAusFahrtZeit === undefined
                    ? 'Fahrt und Zeit müssen größer als 0 sein'
                    : `ergibt ${formatNumber(distanzAusFahrtZeit)} sm`
                }
              />
            </div>
          )}
        </div>
      </PeilKarte>

      {ausgabe && !ausgabe.ok && (
        <MeldungsBox art="fehler" titel="Damit lässt sich keine Entfernung bestimmen" texte={[ausgabe.fehler]} />
      )}

      {ergebnis && ergebnis.warnungen.length > 0 && (
        <MeldungsBox art="warnung" titel="Achtung: unsichere Ausgangswerte" texte={ergebnis.warnungen} />
      )}

      {ergebnis && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-4">
            <h2 className="font-black text-white text-xs uppercase tracking-[0.2em]">Ergebnis</h2>
          </div>

          <div className="grid gap-4 p-6 border-b border-slate-100 bg-slate-50/30 sm:grid-cols-3">
            <ErgebnisKachel
              gross
              label="Querabstand"
              wert={ergebnis.querabstand}
              einheit={einheit}
              erklaerung="Abstand, mit dem du das Objekt passierst"
            />
            <ErgebnisKachel gross label="Entfernung bei 2. Peilung" wert={ergebnis.entfernung2} einheit={einheit} />
            <ErgebnisKachel gross label="Entfernung bei 1. Peilung" wert={ergebnis.entfernung1} einheit={einheit} />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 sm:grid-cols-3">
            <ErgebnisKachel label="Winkel am Objekt δ" wert={ergebnis.winkelObjekt} einheit="°" />
            <ErgebnisKachel label="Restweg bis querab" wert={ergebnis.restweg} einheit={einheit} />
            <ErgebnisKachel label="Gerechnete Distanz s" wert={gefahreneDistanz ?? 0} einheit={einheit} />
          </dl>
        </div>
      )}

      {ergebnis && ergebnis.hinweise.length > 0 && (
        <MeldungsBox art="hinweis" titel="Gut zu wissen" texte={ergebnis.hinweise} />
      )}

      {ergebnis && (
        <FormulaExplainer steps={ergebnis.schritte} formulas={ergebnis.formeln} method={ergebnis.methode} />
      )}
    </div>
  )
}
