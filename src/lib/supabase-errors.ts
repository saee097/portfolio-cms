/**
 * Supabase/PostgREST failures arrive as plain objects, not `Error` instances.
 * Throwing one straight out of a server component makes React dump `{ code, details,
 * hint, message }` into the browser instead of rendering the error boundary, so every
 * failure is converted into a real `Error` before it leaves the server.
 */

const MISSING_RELATION_CODES = new Set(['PGRST205', 'PGRST204', '42P01'])

const FRIENDLY_MESSAGES: Record<string, string> = {
  PGRST205: 'A required database table does not exist yet.',
  PGRST204: 'A required database column does not exist yet.',
  '42P01': 'A required database table does not exist yet.',
  '23505': 'That record already exists.',
  '23503': 'That record is still referenced by other data.',
  '23502': 'A required field was missing.',
  PGRST116: 'That record no longer exists.',
}

interface SupabaseErrorLike {
  code?: unknown
  message?: unknown
  details?: unknown
  hint?: unknown
}

export function isMissingRelationError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = (error as SupabaseErrorLike).code
  return typeof code === 'string' && MISSING_RELATION_CODES.has(code)
}

export function describeSupabaseError(error: unknown): string {
  if (!error) return 'Unknown database error'
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (typeof error !== 'object') return String(error)

  const candidate = error as SupabaseErrorLike
  const code = typeof candidate.code === 'string' ? candidate.code : undefined
  const message = typeof candidate.message === 'string' ? candidate.message : undefined

  if (isMissingRelationError(error)) {
    const table = message?.match(/'public\.([a-z_]+)'/i)?.[1]
    return table
      ? `Database table "${table}" is missing. Apply supabase/schema.sql to your Supabase project.`
      : FRIENDLY_MESSAGES[code as string]
  }

  if (code && message) return `${FRIENDLY_MESSAGES[code] ? `${FRIENDLY_MESSAGES[code]} ` : ''}${message}`
  return message || code || 'Unknown database error'
}

/** Converts any thrown value into a real `Error` with a message safe to render. */
export function normalizeDatabaseError(error: unknown, context?: string): Error {
  const detail = describeSupabaseError(error)
  const normalized = new Error(context ? `${context}: ${detail}` : detail)
  normalized.name = isMissingRelationError(error) ? 'DatabaseNotInitializedError' : 'DatabaseError'

  // Kept for server-side logging only; never rendered.
  Object.defineProperty(normalized, 'cause', { value: error, enumerable: false })

  console.error(`[database] ${normalized.name}:`, detail, error)
  return normalized
}