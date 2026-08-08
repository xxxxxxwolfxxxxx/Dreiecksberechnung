import type { Metadata } from 'next'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { KreuzpeilungRechner } from '@/components/navigation/KreuzpeilungRechner'
import { PeilungInfo } from '@/components/navigation/PeilungInfo'
import { PEILUNG_INHALTE } from '@/lib/navigation/peilung-inhalte'
import { SITE_URL } from '@/lib/site'

const inhalt = PEILUNG_INHALTE.kreuzpeilung

export const metadata: Metadata = {
  title: inhalt.metaTitel,
  description: inhalt.metaBeschreibung,
}

export default function KreuzpeilungPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MathSolver',
            name: 'Kreuzpeilung berechnen',
            description: inhalt.metaBeschreibung,
            url: `${SITE_URL}/kreuzpeilung`,
            educationalLevel: 'secondary',
            inLanguage: 'de',
            applicationCategory: 'EducationalApplication',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: inhalt.faq.map(eintrag => ({
              '@type': 'Question',
              name: eintrag.frage,
              acceptedAnswer: { '@type': 'Answer', text: eintrag.antwort },
            })),
          }),
        }}
      />
      <AdSlot slot="1508045799" format="horizontal" className="mb-6" minHeight={90} />
      <KreuzpeilungRechner />
      <PeilungInfo id="kreuzpeilung" />
      <MoreShapes currentId="kreuzpeilung" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
