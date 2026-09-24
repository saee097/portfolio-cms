import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClientSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.then(cs => cs.get(name)?.value)
        },
        set(name: string, value: string, options: CookieOptions) {
          return cookieStore.then(cs => {
            try {
              cs.set({ name, value, ...options })
            } catch {
              // The `set` method was called from a Server Component.
            }
          })
        },
        remove(name: string, options: CookieOptions) {
          return cookieStore.then(cs => {
            try {
              cs.set({ name, value: '', ...options })
            } catch {
              // The `delete` method was called from a Server Component.
            }
          })
        },
      },
    }
  )
}