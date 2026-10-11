'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId()
    setToasts(prev => [...prev, { ...toast, id }])
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((toast: Omit<Toast, 'id'>) => addToast(toast), [addToast])
  const success = useCallback((title: string, description?: string) => addToast({ type: 'success', title, description }), [addToast])
  const error = useCallback((title: string, description?: string) => addToast({ type: 'error', title, description }), [addToast])
  const warning = useCallback((title: string, description?: string) => addToast({ type: 'warning', title, description }), [addToast])
  const info = useCallback((title: string, description?: string) => addToast({ type: 'info', title, description }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}