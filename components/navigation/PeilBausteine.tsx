'use client'
import { formatNumber } from '@/lib/format'

interface FeldProps {
  id: string
  label: string
  /** Einheit rechts im Feld, z.B. '°' oder 'sm'. */
  einheit: string
  wert: number | undefined
  onChange: (wert: number | undefined) => void
  /** Kurzer Hinweis unter dem Feld. */
  hinweis?: string
  schritt?: string
}

/** Zahleneingabe im Stil der übrigen Rechner, aber mit maritimem Akzent. */
export function PeilFeld({ id, label, einheit, wert, onChange, hinweis, schritt = 'any' }: FeldProps) {
  const gefuellt = wert !== undefined && Number.isFinite(wert)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 ${
          gefuellt
            ? 'border-teal-400 bg-teal-50/60 shadow-inner shadow-teal-100/50'
            : 'border-slate-100 bg-slate-50 focus-within:border-teal-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-teal-100/50 focus-within:-translate-y-0.5'
        }`}
      >
        <input
          id={id}
          type="number"
          step={schritt}
          inputMode="decimal"
          placeholder="0"
          value={wert ?? ''}
          onChange={e => onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
          className="w-full bg-transparent px-4 py-4 pr-12 text-base font-black text-slate-800 placeholder-slate-300 focus:outline-none"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
          {einheit}
        </span>
      </div>
      {hinweis && <span className="text-[11px] text-slate-400 leading-snug ml-1">{hinweis}</span>}
    </div>
  )
}

interface KachelProps {
  label: string
  wert: number
  einheit: string
  /** Hervorgehobene Kachel für die Kernergebnisse. */
  gross?: boolean
  erklaerung?: string
}

/** Ergebniskachel — groß für die Kernwerte, klein für die Zwischenwerte. */
export function ErgebnisKachel({ label, wert, einheit, gross = false, erklaerung }: KachelProps) {
  if (gross) {
    return (
      <div className="rounded-2xl bg-white border border-teal-100 p-5 shadow-sm">
        <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-teal-700">
          {formatNumber(wert)} <span className="text-base text-teal-500">{einheit}</span>
        </div>
        {erklaerung && <p className="mt-2 text-xs text-slate-500 leading-snug">{erklaerung}</p>}
      </div>
    )
  }
  return (
    <div className="p-1">
      <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</dt>
      <dd className="font-black text-slate-700 text-base">
        {formatNumber(wert)} {einheit}
      </dd>
    </div>
  )
}

interface MeldungProps {
  art: 'fehler' | 'warnung' | 'hinweis'
  titel: string
  texte: string[]
}

const MELDUNG_STIL = {
  fehler: {
    rahmen: 'bg-rose-50 border-rose-200',
    titel: 'text-rose-900',
    text: 'text-rose-800',
    symbol: '⚠️',
  },
  warnung: {
    rahmen: 'bg-amber-50 border-amber-200',
    titel: 'text-amber-900',
    text: 'text-amber-800',
    symbol: '📐',
  },
  hinweis: {
    rahmen: 'bg-slate-50 border-slate-200',
    titel: 'text-slate-700',
    text: 'text-slate-600',
    symbol: 'ℹ️',
  },
} as const

/** Fehler-, Warn- und Hinweisbox mit gleichem Aufbau. */
export function MeldungsBox({ art, titel, texte }: MeldungProps) {
  if (texte.length === 0) return null
  const stil = MELDUNG_STIL[art]

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${stil.rahmen}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg" aria-hidden="true">
          {stil.symbol}
        </span>
        <div className="flex-1">
          <p className={`font-black mb-2 ${stil.titel}`}>{titel}</p>
          <div className={`space-y-2 text-sm leading-relaxed ${stil.text}`}>
            {texte.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface KopfProps {
  titel: string
  untertitel: string
  einheit: string
  einheiten: readonly string[]
  onEinheit: (einheit: string) => void
}

/** Seitenkopf der Peilungs-Rechner mit Einheitenwahl. */
export function PeilKopf({ titel, untertitel, einheit, einheiten, onEinheit }: KopfProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-800 p-6 sm:p-8 text-white shadow-xl shadow-teal-100">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{titel}</h1>
        <label className="sr-only" htmlFor="einheit">
          Längeneinheit
        </label>
        <select
          id="einheit"
          value={einheit}
          onChange={e => onEinheit(e.target.value)}
          className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer"
        >
          {einheiten.map(e => (
            <option key={e} value={e} className="text-slate-900">
              {e}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-sm sm:text-base text-teal-50/90 font-medium">{untertitel}</p>
    </div>
  )
}

/** Karte mit kleiner Rubrik-Marke, wie auf den Formen-Seiten. */
export function PeilKarte({ marke, children }: { marke: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
          {marke}
        </span>
      </div>
      {children}
    </div>
  )
}
