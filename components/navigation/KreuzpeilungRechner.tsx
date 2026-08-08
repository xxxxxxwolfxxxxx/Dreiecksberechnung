'use client'
import { useMemo, useState } from 'react'
import { FormulaExplainer } from '@/components/calculator/FormulaExplainer'
import { berechneKreuzpeilung, type KreuzpeilungEingabe } from '@/lib/navigation/kreuzpeilung'
import { cosGrad, sinGrad } from '@/lib/navigation/winkel'
import { ErgebnisKachel, MeldungsBox, PeilFeld, PeilKarte, PeilKopf } from './PeilBausteine'
import { PeilSkizze, streckenLabel, type SkizzeLinie, type SkizzePunkt } from './PeilSkizze'

const EINHEITEN = ['sm', 'km', 'm'] as const

/** Beispiel aus dem Erklärtext: zwei Feuer 4 sm auseinander, Schnittwinkel 90°. */
const BEISPIEL: KreuzpeilungEingabe = {
  peilungA: 315,
  peilungB: 45,
  basisrichtung: 90,
  basislaenge: 4,
}

type Eingabefelder = { [K in keyof KreuzpeilungEingabe]: number | undefined }

export function KreuzpeilungRechner() {
  const [felder, setFelder] = useState<Eingabefelder>({ ...BEISPIEL })
  const [einheit, setEinheit] = useState<string>('sm')

  const ausgabe = useMemo(() => {
    const { peilungA, peilungB, basisrichtung, basislaenge } = felder
    if ([peilungA, peilungB, basisrichtung, basislaenge].some(w => w === undefined)) return undefined
    return berechneKreuzpeilung({
      peilungA: peilungA as number,
      peilungB: peilungB as number,
      basisrichtung: basisrichtung as number,
      basislaenge: basislaenge as number,
    })
  }, [felder])

  const ergebnis = ausgabe?.ok ? ausgabe.ergebnis : undefined
  const setzeFeld = (schluessel: keyof Eingabefelder) => (wert: number | undefined) =>
    setFelder(vorher => ({ ...vorher, [schluessel]: wert }))

  // Skizze: Basislinie waagerecht (A links, B rechts), Boot darunter.
  const skizze = useMemo(() => {
    if (!ergebnis || !felder.basislaenge) return undefined
    const boot = {
      x: ergebnis.entfernungA * cosGrad(ergebnis.winkelA),
      y: ergebnis.entfernungA * sinGrad(ergebnis.winkelA),
    }
    const punkte: SkizzePunkt[] = [
      { x: 0, y: 0, label: 'Objekt A', art: 'objekt' },
      { x: felder.basislaenge, y: 0, label: 'Objekt B', art: 'objekt' },
      { x: boot.x, y: boot.y, label: 'Boot', art: 'boot' },
      { x: boot.x, y: 0, label: '', art: 'hilfspunkt' },
    ]
    const linien: SkizzeLinie[] = [
      { von: 0, bis: 1, label: `b = ${streckenLabel(felder.basislaenge, einheit)}` },
      { von: 2, bis: 0, label: streckenLabel(ergebnis.entfernungA, einheit) },
      { von: 2, bis: 1, label: streckenLabel(ergebnis.entfernungB, einheit) },
      { von: 2, bis: 3, label: streckenLabel(ergebnis.abstandBasislinie, einheit), gestrichelt: true },
    ]
    return { punkte, linien }
  }, [ergebnis, felder.basislaenge, einheit])

  return (
    <div className="space-y-6">
      <PeilKopf
        titel="Kreuzpeilung berechnen"
        untertitel="Zwei rechtweisende Peilungen auf zwei Landmarken mit bekanntem Abstand — daraus Entfernungen und Abstand zur Basislinie."
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
            legende="Basislinie waagerecht gedreht, Winkel und Längenverhältnisse maßstäblich"
          />
        ) : (
          <p className="text-sm text-slate-400 text-center py-10">
            Trage beide Peilungen, die Basisrichtung und den Abstand der Objekte ein — dann erscheint hier das
            Peildreieck.
          </p>
        )}
      </PeilKarte>

      <PeilKarte marke="Werte eingeben">
        <div className="grid gap-5 sm:grid-cols-2">
          <PeilFeld
            id="peilungA"
            label="Peilung zu Objekt A"
            einheit="°"
            wert={felder.peilungA}
            onChange={setzeFeld('peilungA')}
            hinweis="Rechtweisend, vom Boot aus gemessen"
          />
          <PeilFeld
            id="peilungB"
            label="Peilung zu Objekt B"
            einheit="°"
            wert={felder.peilungB}
            onChange={setzeFeld('peilungB')}
            hinweis="Rechtweisend, möglichst gleichzeitig gepeilt"
          />
          <PeilFeld
            id="basisrichtung"
            label="Basisrichtung A → B"
            einheit="°"
            wert={felder.basisrichtung}
            onChange={setzeFeld('basisrichtung')}
            hinweis="Richtung von A nach B, aus der Karte abgegriffen"
          />
          <PeilFeld
            id="basislaenge"
            label="Abstand A – B (Basis b)"
            einheit={einheit}
            wert={felder.basislaenge}
            onChange={setzeFeld('basislaenge')}
            hinweis="Kartenabstand der beiden Objekte"
          />
        </div>
        <button
          type="button"
          onClick={() => setFelder({ ...BEISPIEL })}
          className="mt-6 rounded-xl bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          Beispielwerte laden
        </button>
      </PeilKarte>

      {ausgabe && !ausgabe.ok && (
        <MeldungsBox art="fehler" titel="Damit lässt sich kein Standort bestimmen" texte={[ausgabe.fehler]} />
      )}

      {ergebnis && ergebnis.warnungen.length > 0 && (
        <MeldungsBox art="warnung" titel="Achtung: Schnittwinkel" texte={ergebnis.warnungen} />
      )}

      {ergebnis && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-4">
            <h2 className="font-black text-white text-xs uppercase tracking-[0.2em]">Ergebnis</h2>
          </div>

          <div className="grid gap-4 p-6 border-b border-slate-100 bg-slate-50/30 sm:grid-cols-3">
            <ErgebnisKachel gross label="Entfernung zu A" wert={ergebnis.entfernungA} einheit={einheit} />
            <ErgebnisKachel gross label="Entfernung zu B" wert={ergebnis.entfernungB} einheit={einheit} />
            <ErgebnisKachel
              gross
              label="Abstand zur Basislinie"
              wert={ergebnis.abstandBasislinie}
              einheit={einheit}
              erklaerung="Senkrechter Abstand von der Verbindungslinie A–B"
            />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 sm:grid-cols-4">
            <ErgebnisKachel label="Schnittwinkel γ" wert={ergebnis.schnittwinkel} einheit="°" />
            <ErgebnisKachel label="Winkel bei A" wert={ergebnis.winkelA} einheit="°" />
            <ErgebnisKachel label="Winkel bei B" wert={ergebnis.winkelB} einheit="°" />
            <ErgebnisKachel label="Streuung bei ±2° Peilfehler" wert={ergebnis.unsicherheit} einheit={einheit} />
          </dl>
        </div>
      )}

      {ergebnis && (
        <FormulaExplainer
          steps={ergebnis.schritte}
          formulas={ergebnis.formeln}
          method={ergebnis.methode}
        />
      )}
    </div>
  )
}
