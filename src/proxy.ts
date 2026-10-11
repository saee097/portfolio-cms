import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for admin session cookie
  const adminSession = request.cookies.get('admin_session')?.value === 'true'

  // Protected Admin Routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login'

    // If user is NOT logged in and trying to access any admin page other than /admin/login
    if (!adminSession && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If user IS logged in and tries to go to /admin/login, redirect to /admin dashboard
    if (adminSession && isLoginPage) {
      const dashboardUrl = new URL('/admin', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Protect Admin API endpoints except login
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')) {
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
