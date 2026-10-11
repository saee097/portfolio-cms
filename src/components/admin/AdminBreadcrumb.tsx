'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function AdminBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const pathname = usePathname()

  const breadcrumbs = items.map((item, index) => {
    const isLast = index === items.length - 1
    const isActive = isLast || pathname.startsWith(item.href || '')
    
    return (
      <li key={item.label} className="flex items-center">
        {index > 0 && (
          <ChevronRight className="h-4 w-4 text-slate-400 mx-2 flex-shrink-0" aria-hidden="true" />
        )}
        {item.href && !isLast ? (
          <Link
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors',
              isActive
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {item.label}
          </Link>
        ) : (
          <span
            className={cn(
              'text-sm font-medium',
              isActive
                ? 'text-slate-600 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-400'
            )}
            aria-current={isLast ? 'page' : undefined}
          >
            {item.label}
          </span>
        )}
      </li>
    )
  })

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        </li>
        {breadcrumbs}
      </ol>
    </nav>
  )
}