'use client'

import { Fragment, ReactNode, useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface DropdownProps {
  trigger: ReactNode
  content: ReactNode
  align?: 'start' | 'end' | 'center'
  sideOffset?: number
}

export function Dropdown({ trigger, content, align = 'end', sideOffset = 4 }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block">
      <div ref={triggerRef}>{trigger}</div>
      {open && (
        <Fragment>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            ref={contentRef}
            className={cn(
              'fixed z-50 min-w-[160px] max-w-[320px] rounded-md border border-slate-200 bg-white p-1 shadow-lg',
              'dark:border-slate-700 dark:bg-slate-800',
              'animate-in fade-in-0 zoom-in-95',
              align === 'end' && 'right-0',
              align === 'start' && 'left-0',
              align === 'center' && 'left-1/2 -translate-x-1/2'
            )}
            style={{ marginTop: sideOffset }}
          >
            {content}
          </div>
        </Fragment>
      )}
    </div>
  )
}

interface DropdownMenuProps {
  children: ReactNode
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  return (
    <div className={cn('py-1', className)} role="menu">
      {children}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  icon?: ReactNode
  className?: string
}

export function DropdownItem({ children, onClick, disabled, destructive, icon, className }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-sm rounded',
        'hover:bg-slate-100 dark:hover:bg-slate-700/50',
        'focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700/50',
        disabled && 'opacity-50 pointer-events-none',
        destructive && 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
        className
      )}
    >
      {icon && <span className="flex h-4 w-4">{icon}</span>}
      {children}
    </button>
  )
}

interface DropdownTriggerProps {
  children: ReactNode
  className?: string
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  return (
    <Button variant="ghost" size="sm" className={cn('gap-1', className)}>
      {children}
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
}