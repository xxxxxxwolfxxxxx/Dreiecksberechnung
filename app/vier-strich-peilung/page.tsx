import type { Metadata } from 'next'
import { AdSlot } from '@/components/AdSlot'
import { MoreShapes } from '@/components/MoreShapes'
import { RechnerSchema } from '@/components/RechnerSchema'
import { PeilungInfo } from '@/components/navigation/PeilungInfo'
import { VersegelungRechner } from '@/components/navigation/VersegelungRechner'
import { PEILUNG_INHALTE } from '@/lib/navigation/peilung-inhalte'

const inhalt = PEILUNG_INHALTE['vier-strich-peilung']

export const metadata: Metadata = {
  title: inhalt.metaTitel,
  description: inhalt.metaBeschreibung,
}

export default function VierStrichPeilungPage() {
  return (
    <>
      <RechnerSchema
        name="Vier-Strich-Peilung berechnen"
        description={inhalt.metaBeschreibung}
        path="/vier-strich-peilung"
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
      <VersegelungRechner />
      <PeilungInfo id="vier-strich-peilung" />
      <MoreShapes currentId="vier-strich-peilung" />
      <AdSlot slot="4403201248" format="horizontal" className="mt-6" minHeight={90} />
    </>
  )
}
