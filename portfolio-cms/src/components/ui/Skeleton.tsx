import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={cn('animate-pulse rounded-full bg-slate-200 dark:bg-slate-700', className)}
        style={{ width, height }}
      />
    )
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn('animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700', className)}
        style={{ width, height }}
      />
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded',
            i === lines - 1 && 'w-3/4'
          )}
          style={{ width: i === lines - 1 ? width : '100%' }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <Skeleton variant="rectangular" height="24" width="40%" />
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="rectangular" height="12" width="60%" />
    </div>
  )
}

export function TableSkeleton(rows = 5, columns = 4) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" height="12" width={i === 0 ? '80px' : '100px'} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} variant="text" height="16" width={j === 0 ? '100px' : '120px'} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}