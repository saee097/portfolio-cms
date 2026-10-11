import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

/**
 * Signs the administrator out.
 *
 * This must be a route handler: `cookies().delete()` is only permitted in a Server
 * Action or Route Handler, so doing it from a page render throws and leaves the
 * session intact — the previous implementation silently failed to log anyone out.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options, maxAge: 0 })
          },
        },
      })
      await supabase.auth.signOut()
    } catch (error) {
      // The local session is cleared regardless of the Supabase result.
      console.warn('[logout] Supabase sign-out failed:', error)
    }
  }

  for (const name of ['admin_session', 'admin_email']) {
    response.cookies.set({ name, value: '', path: '/', httpOnly: true, sameSite: 'lax', maxAge: 0 })
  }

  return response
}