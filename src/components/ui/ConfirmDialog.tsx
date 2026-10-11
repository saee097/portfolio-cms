'use client'

import { Fragment } from 'react'
import { AlertTriangle, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  variant?: 'danger' | 'warning' | 'info'
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'danger',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null

  const variants = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      confirmColor: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      confirmColor: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const { icon: Icon, iconColor, bgColor, confirmColor } = variants[variant]

  return (
    <Fragment>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-800 animate-in fade-in-0 zoom-in-95">
          <div className={cn('p-6', bgColor)}>
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', bgColor)}>
                <Icon className={cn('h-5 w-5', iconColor)} />
              </div>
              <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-600 dark:text-slate-100">
                {title}
              </h2>
            </div>
          </div>
          
          {description && (
            <div className="px-6 pb-4">
              <p id="confirm-dialog-description" className="text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              {cancelLabel}
            </Button>
            <Button
              variant="default"
              className={cn(confirmColor)}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              disabled={loading}
            >
              {loading && <Check className="h-4 w-4 mr-2 animate-spin" />}
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}