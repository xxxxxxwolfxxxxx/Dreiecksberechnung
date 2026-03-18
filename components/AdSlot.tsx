'use client'
import { useEffect, useRef } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
  minHeight?: number
}

export function AdSlot({ slot, format = 'auto', className = '', minHeight = 90 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded.current) {
        loaded.current = true
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch {}
        observer.disconnect()
      }
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
