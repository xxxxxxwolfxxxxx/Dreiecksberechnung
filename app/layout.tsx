import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { SITE_URL } from '@/lib/site'
import { RELATED_PROJECTS } from '@/lib/relatedProjects'
import './globals.css'

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-plex-sans' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono' })

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
    <html lang="de" className={`${plexSans.variable} ${plexMono.variable}`}>
      <head>
        {/* Google Funding Choices (IAB TCF 2.2 CMP) — vor AdSense laden */}
        <Script
          src={`https://fundingchoicesmessages.google.com/i/${process.env.NEXT_PUBLIC_FUNDING_CHOICES_ID}?ers=1`}
          strategy="afterInteractive"
        />
        <Script id="fc-init" strategy="afterInteractive">{`
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
          strategy="lazyOnload"
          crossOrigin="anonymous"
          data-overlays="bottom"
        />
      </head>
      <body className="font-sans min-h-screen antialiased">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 sm:px-5 py-7 sm:py-10 flex flex-col gap-5">
          {children}
        </main>
        <footer className="border-t border-line bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-5 py-7 flex flex-col gap-5">
            <section aria-labelledby="weitere-projekte" className="flex flex-col gap-3">
              <h2 id="weitere-projekte" className="font-mono text-[11.5px] font-medium tracking-[0.08em] uppercase text-ink-3">
                Weitere Projekte
              </h2>
              <ul className="grid gap-4 sm:grid-cols-3">
                {RELATED_PROJECTS.map((project) => (
                  <li key={project.url}>
                    <a href={project.url} title={project.title} rel="noopener"
                      className="text-sm font-semibold !text-ink hover:underline">
                      {project.name}
                    </a>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{project.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <div className="flex flex-wrap justify-between gap-3 border-t border-line-soft pt-4 text-[13px] text-ink-3">
              <span className="flex gap-4">
                <Link href="/impressum" className="!text-ink-2 hover:underline">Impressum</Link>
                <Link href="/datenschutz" className="!text-ink-2 hover:underline">Datenschutz</Link>
              </span>
              <span>dreieck-berechnen.de</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
