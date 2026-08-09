import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DreieckThemaSeite } from '@/components/DreieckThemaSeite'
import { themaAusId } from '@/lib/dreieck-themen'

const THEMA = themaAusId('dreieck-seiten')

export const metadata: Metadata = {
  title: THEMA?.titel,
  description: THEMA?.beschreibung,
}

export default function DreieckSeitenPage() {
  if (!THEMA) notFound()
  return <DreieckThemaSeite thema={THEMA} />
}
