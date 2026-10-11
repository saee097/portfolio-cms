import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Strict validation: Only admin with email admin123@gmail.com and password admin123
    if (email !== 'admin123@gmail.com' || password !== 'admin123') {
      return NextResponse.json(
        { error: 'Invalid credentials. Only authorized admin can access the dashboard.' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true, email })

    // Set secure HTTP cookies for session persistence
    response.cookies.set({
      name: 'admin_session',
      value: 'true',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400 * 7, // 7 days
    })

    response.cookies.set({
      name: 'admin_email',
      value: 'admin123@gmail.com',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400 * 7,
    })

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
              response.cookies.set({ name, value: '', ...options })
            },
          },
        })
        await supabase.auth.signInWithPassword({ email, password })
      } catch (err) {
        // Silently ignore Supabase error to allow standalone admin login
      }
    }

    return response
  } catch (err) {
    return NextResponse.json({ error: 'Server error processing request' }, { status: 500 })
  }
}