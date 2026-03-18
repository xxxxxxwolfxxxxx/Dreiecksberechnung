import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Datenschutzerklärung' }

export default function Datenschutz() {
  return (
    <article className="prose dark:prose-invert max-w-2xl">
      <h1>Datenschutzerklärung</h1>
      <h2>1. Verantwortlicher</h2>
      <p>Matthias Dührkop<br />Rhedewiesen 1, 19258 Boizenburg<br />E-Mail: <a href="mailto:xxxxwolfxxxx@me.com">xxxxwolfxxxx@me.com</a></p>
      <h2>2. Werbung &amp; Consent</h2>
      <p>Diese Website nutzt Google AdSense zur Schaltung von Werbeanzeigen. Die Einwilligungsverwaltung erfolgt über Google Funding Choices gemäß IAB TCF 2.2. Ohne Einwilligung werden ausschließlich nicht-personalisierte Anzeigen ausgespielt.</p>
      <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Datenschutzrichtlinie</a></p>
      <h2>3. Hosting</h2>
      <p>Diese Website wird über Netlify gehostet (Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA). Beim Aufruf der Website werden technisch bedingt IP-Adresse und Zugriffszeiten erfasst. Weitere Informationen: <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener">Netlify Privacy Policy</a></p>
      <h2>4. Keine weiteren Datenerhebungen</h2>
      <p>Es werden keine Nutzerkonten angelegt. Es werden keine persönlichen Daten außer den durch Google AdSense und Netlify technisch bedingten Daten verarbeitet.</p>
    </article>
  )
}
