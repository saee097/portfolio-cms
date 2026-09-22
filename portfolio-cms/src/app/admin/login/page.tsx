import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard.',
}

export default async function AdminLoginPage() {
  const supabase = createServerClientSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (profile && ['super_admin', 'admin', 'editor'].includes(profile.role)) {
      redirect('/admin')
    }
  }

  return <AdminLoginForm />
}

function AdminLoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700">
              <LayoutDashboard className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Sign in</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Enter your credentials to access the dashboard</p>
        </div>

        <form id="login-form" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div id="error-message" className="mt-4 text-center text-sm text-red-600 dark:text-red-400 hidden" role="alert"></div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <a href="/" className="text-primary-700 hover:underline dark:text-primary-300">
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  )
}