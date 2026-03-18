'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { shapeList } from '@/lib/shapes'

export function Navigation() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-blue-100">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
        <span className="mr-4 text-lg font-extrabold text-blue-600 whitespace-nowrap tracking-tight">
          Geo-Rechner
        </span>
        {shapeList.map((shape) => (
          <Link
            key={shape.id}
            href={`/${shape.id}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all
              ${pathname === `/${shape.id}`
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
          >
            {shape.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
