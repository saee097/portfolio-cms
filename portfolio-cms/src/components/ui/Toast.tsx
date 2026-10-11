'use client'

import { useToast } from '@/hooks/useToast'
import { Button } from './Button'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      {children}
    </Toaster>
  )
}

function Toaster({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="region" aria-label="Notifications">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={dismiss} />
        ))}
      </div>
    </>
  )
}

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose: (id: string) => void
}

function Toast({ id, type, title, description, action, onClose }: ToastProps) {
  const types = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500',
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg text-white animate-in slide-in-from-right
        ${types[type]}
      `}
      role="alert"
    >
      <span className="flex-shrink-0 text-xl">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
        {action && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-white hover:bg-white/20"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
      <button
        className="flex-shrink-0 opacity-70 hover:opacity-100"
        onClick={() => onClose(id)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}