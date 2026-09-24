'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Switch = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-ring-0:0:0:0 shadow-ring-0:0:0:1 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
})
Switch.displayName = 'Switch'

export { Switch }