'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { describeSupabaseError } from '@/lib/supabase-errors'

export default function AdminError({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | unknown
  reset: () => void
}) {
  // PostgREST failures arrive as plain objects; without this React dumps
  // `{ code, details, hint, message }` instead of rendering the boundary.
  const raw = error as { message?: unknown; digest?: unknown } | null | undefined
  const message =
    error instanceof Error
      ? error.message
      : describeSupabaseError(raw)
  const digest = typeof raw?.digest === 'string' ? raw.digest : undefined
  const isSchemaError = error instanceof Error && error.name === 'DatabaseNotInitializedError'

  useEffect(() => {
    console.error('[admin] render error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-600 dark:text-slate-100 mb-2">
          {isSchemaError ? 'Database is not initialised' : 'Something went wrong'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {isSchemaError
            ? message
            : 'We encountered an unexpected error. Please try again or contact support if the problem persists.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/admin">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left text-sm">
            <summary className="cursor-pointer text-slate-500">Error Details</summary>
            <pre className="mt-2 p-4 rounded bg-slate-100 dark:bg-slate-800 overflow-auto max-h-64 whitespace-pre-wrap break-words">
              {message}
              {digest && <> {'\n'}Digest: {digest} </>}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}