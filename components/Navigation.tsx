'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { shapeList } from '@/lib/shapes'

export function Navigation() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        <span className="mr-3 font-bold text-blue-600 whitespace-nowrap">Geo-Rechner</span>
        {shapeList.map((shape) => (
          <Link
            key={shape.id}
            href={`/${shape.id}`}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
              ${pathname === `/${shape.id}`
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
          >
            {shape.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
