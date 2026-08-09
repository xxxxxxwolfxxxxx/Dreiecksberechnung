import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { SITE_URL } from '@/lib/site'
import { RELATED_PROJECTS } from '@/lib/relatedProjects'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Kein Marken-Suffix: die Seitentitel liegen schon bei ~50 Zeichen, ein
  // Zusatz wuerde im Suchergebnis abgeschnitten. Frueher stand hier
  // "| Geometrie-Rechner" – eine fremde Domain, die nicht zum Portfolio gehoert.
  title: { template: '%s', default: 'Dreieck berechnen – Fläche, Umfang & Winkel online' },
  description: 'Geometrische Formen online berechnen – Dreieck, Kreis, Rechteck, Quader und mehr. Mit Rechenweg, Skizze und allen Formeln.',
  // './' löst pro Route auf den eigenen Pfad auf → selbstreferenzierender Canonical
  alternates: { canonical: './' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Google Funding Choices (IAB TCF 2.2 CMP) — vor AdSense laden */}
        <Script
          src={`https://fundingchoicesmessages.google.com/i/${process.env.NEXT_PUBLIC_FUNDING_CHOICES_ID}?ers=1`}
          strategy="beforeInteractive"
        />
        <Script id="fc-init" strategy="beforeInteractive">{`
          (function() {
            function signalGooglefcPresent() {
              if (!window.frames['googlefcPresent']) {
                if (document.body) {
                  const iframe = document.createElement('iframe');
                  iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                  iframe.style.display = 'none';
                  iframe.name = 'googlefcPresent';
                  document.body.appendChild(iframe);
                } else {
                  setTimeout(signalGooglefcPresent, 0);
                }
              }
            }
            signalGooglefcPresent();
          })();
        `}</Script>
        {/* AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8687929894744033"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Navigation />
        <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-6 text-sm text-gray-500">
          <div className="mx-auto max-w-2xl px-4">
            <section aria-labelledby="weitere-projekte">
              <h2 id="weitere-projekte" className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Weitere Projekte
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {RELATED_PROJECTS.map((project) => (
                  <li key={project.url}>
                    <a href={project.url} title={project.title} rel="noopener"
                      className="font-semibold text-gray-600 hover:underline">
                      {project.name}
                    </a>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{project.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <p className="mt-6 text-center">
              <Link href="/impressum" className="hover:underline mr-4">Impressum</Link>
              <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
