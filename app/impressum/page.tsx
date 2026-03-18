import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Impressum' }

export default function Impressum() {
  return (
    <article className="prose dark:prose-invert max-w-2xl">
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      <p><strong>Name:</strong> Matthias Dührkop</p>
      <p><strong>Anschrift:</strong> [Bitte Adresse eintragen]</p>
      <p><strong>E-Mail:</strong> Kontakt über <a href="https://github.com/xxxxxxwolfxxxxx" target="_blank" rel="noopener">github.com/xxxxxxwolfxxxxx</a></p>
      <h2>Haftungsausschluss</h2>
      <p>Die Berechnungen auf dieser Website dienen nur zur Orientierung. Für die Richtigkeit der Ergebnisse wird keine Gewähr übernommen.</p>
    </article>
  )
}
