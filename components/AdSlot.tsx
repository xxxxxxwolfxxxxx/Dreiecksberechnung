'use client'
import { useEffect, useRef } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

// Feste Hoehe statt min-height: responsive Anzeigen liefern mobil bis ~280px.
// Waere der Platz nicht reserviert, schiebt die Anzeige beim Laden den Inhalt
// nach unten (Core Web Vitals: CLS). overflow-hidden verhindert, dass sie
// ueber den reservierten Rahmen hinauswaechst.
export function AdSlot({ slot, format = 'auto', className = '' }: Props) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div className={`h-[280px] overflow-hidden sm:h-[120px] ${className}`} style={{ contain: 'layout paint' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', height: '100%' }}
        data-ad-client="ca-pub-8687929894744033"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
