import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Datenschutzerklärung' }

export default function Datenschutz() {
  return (
    <article className="prose dark:prose-invert max-w-2xl">
      <h1>Datenschutzerklärung</h1>
      <h2>1. Verantwortlicher</h2>
      <p>Matthias Dührkop – Kontakt über <a href="https://github.com/xxxxxxwolfxxxxx" target="_blank" rel="noopener">github.com/xxxxxxwolfxxxxx</a></p>
      <h2>2. Werbung &amp; Consent</h2>
      <p>Diese Website nutzt Google AdSense zur Schaltung von Werbeanzeigen. Die Einwilligungsverwaltung erfolgt über Google Funding Choices gemäß IAB TCF 2.2. Ohne Einwilligung werden ausschließlich nicht-personalisierte Anzeigen ausgespielt.</p>
      <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Datenschutzrichtlinie</a></p>
      <h2>3. Hosting</h2>
      <p>Diese Website wird auf Vercel gehostet. Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Vercel Privacy Policy</a></p>
      <h2>4. Keine weiteren Datenerhebungen</h2>
      <p>Es werden keine Nutzerkonten angelegt. Es werden keine persönlichen Daten außer den durch AdSense und Vercel technisch bedingten Daten verarbeitet.</p>
    </article>
  )
}
