'use client'
import { useEffect, useRef } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

// Platz reservieren (min-height), aber nicht beschneiden: Google setzt an den
// Eltern-Elementen "height: auto !important" und liefert mobil Anzeigen bis
// ~390px. Die Anzeigen stehen unter dem Rechner, ausserhalb des ersten
// Viewports; ein Nachwachsen dort zaehlt nicht als sichtbarer Layout-Shift.
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
    <div className={`min-h-[280px] sm:min-h-[120px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8687929894744033"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
