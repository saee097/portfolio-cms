import { createServerClientSupabase } from '@/supabase/server'
import { isMissingRelationError } from '@/lib/supabase-errors'

export interface DatabaseStatus {
  ready: boolean
  sqlEditorUrl: string | null
}

/** Derives the project SQL editor link from the configured Supabase URL. */
function getSqlEditorUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null

  try {
    const ref = new URL(url).hostname.split('.')[0]
    return ref ? `https://supabase.com/dashboard/project/${ref}/sql` : null
  } catch {
    return null
  }
}

/**
 * Reports whether the database schema has been applied.
 *
 * A plain `limit(1)` select is used rather than `head: true`: PostgREST answers a
 * missing table with a 404 whose body carries the `PGRST205` code, and a HEAD request
 * has no body, so the useful error would be discarded. RLS can legitimately return zero
 * rows to an anonymous caller, but a missing table is reported as an error, and that is
 * what tells the two states apart.
 */
export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  const sqlEditorUrl = getSqlEditorUrl()

  try {
    const supabase = createServerClientSupabase()
    const { error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      reportSchemaProblem(error.code, error.message, isMissingRelationError(error))
      return { ready: false, sqlEditorUrl }
    }

    return { ready: true, sqlEditorUrl }
  } catch (error) {
    // Next.js signals "this route must be dynamic" with this digest. Swallowing it here
    // would hide the reason the route cannot be prerendered, so it is re-thrown.
    if (isDynamicUsageError(error)) throw error

    reportSchemaProblem('UNKNOWN', error instanceof Error ? error.message : String(error), false)
    return { ready: false, sqlEditorUrl }
  }
}

let hasReported = false

/**
 * Reports a failed schema probe once per process.
 *
 * A missing schema is a handled state — the admin layout renders setup instructions for
 * it — so it is logged as info rather than error, which would otherwise surface in the
 * dev overlay on every admin request while the schema is still unapplied.
 */
function reportSchemaProblem(code: string | undefined, message: string | undefined, expected: boolean) {
  if (hasReported) return
  hasReported = true

  const detail = `[database] schema check failed: ${code ?? 'UNKNOWN'} ${message ?? ''}`.trim()

  if (expected) {
    console.info(`${detail} — serving the setup notice until supabase/schema.sql is applied.`)
  } else {
    console.error(`${detail} — unexpected database failure.`)
  }
}

function isDynamicUsageError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    (error as { digest?: unknown }).digest === 'DYNAMIC_SERVER_USAGE'
  )
}

export function isSchemaMissing(error: unknown): boolean {
  return isMissingRelationError(error)
}