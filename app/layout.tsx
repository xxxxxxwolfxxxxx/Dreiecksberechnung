import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Navigation } from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s | Geometrie-Rechner', default: 'Geometrie-Rechner' },
  description: 'Geometrische Formen online berechnen – Dreieck, Kreis, Rechteck und mehr.',
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
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-700">
          <a href="/impressum" className="hover:underline mr-4">Impressum</a>
          <a href="/datenschutz" className="hover:underline">Datenschutz</a>
        </footer>
      </body>
    </html>
  )
}
