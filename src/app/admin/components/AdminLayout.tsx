'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, LayoutDashboard, FolderGit2, Code, Briefcase, GraduationCap, Settings, BarChart2, Image, MessageSquare, Users, PenTool, LogOut, Menu, X, Sun, Moon, Database, ExternalLink, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTheme } from 'next-themes'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Blog', href: '/admin/blog', icon: PenTool },
  { name: 'Skills', href: '/admin/skills', icon: Code },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'SEO', href: '/admin/seo', icon: Settings },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

/**
 * Shown instead of the dashboard when the Supabase schema has not been applied.
 * Without this, every page throws a raw PostgREST error and the dashboard is unusable
 * with no indication of what is actually wrong.
 */
function DatabaseSetupNotice({ sqlEditorUrl }: { sqlEditorUrl: string | null }) {
  const router = useRouter()

  const steps = [
    'Open your Supabase project → SQL Editor',
    'Run the contents of supabase/schema.sql',
    'Run supabase/migrations/20261004_contact_messages_enrichment.sql',
    'Return here and reload',
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <div className="w-full max-w-2xl rounded-2xl border border-amber-200 bg-white p-8 shadow-sm dark:border-amber-900/60 dark:bg-slate-800">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
            <Database className="h-6 w-6 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-600 dark:text-slate-100">
              Database is not initialised
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              The dashboard could not find its tables. Supabase reported{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-900">PGRST205</code> —
              no schema has been applied to this project yet.
            </p>
          </div>
        </div>

        <ol className="mb-6 space-y-2.5">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <p className="mb-6 rounded-lg bg-slate-50 px-4 py-3 font-mono text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          Public pages stay online — they fall back to sample content — but nothing you
          save will be stored until the schema exists.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.refresh()}>
            <RefreshCw className="h-4 w-4" />
            Check again
          </Button>
          {sqlEditorUrl && (
            <a href={sqlEditorUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
                Open SQL Editor
              </Button>
            </a>
          )}
          <Link href="/admin/logout">
            <Button variant="ghost">Sign out</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface AdminLayoutProps {
  children: ReactNode
  databaseReady: boolean
  sqlEditorUrl: string | null
}

export function AdminLayout({ children, databaseReady, sqlEditorUrl }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  if (pathname === '/admin/login' || pathname === '/admin/logout') {
    return <>{children}</>
  }

  if (!databaseReady) {
    return <DatabaseSetupNotice sqlEditorUrl={sqlEditorUrl} />
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-50 flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className={cn('flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800', sidebarCollapsed && 'justify-center')}>
          <Link href="/admin" className="flex items-center gap-2" aria-label="Go to dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-semibold text-slate-600 dark:text-slate-100">Admin</span>}
          </Link>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation">
          <ul className="space-y-1" role="list">
            {navigation.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Users className="h-4 w-4 text-primary-700 dark:text-primary-300" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-100 truncate">John Developer</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Super Admin</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <Link href="/admin/profile" className="text-xs text-primary-700 hover:underline dark:text-primary-300">
                Profile
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Link href="/admin/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Users className="h-4 w-4 text-primary-700 dark:text-primary-300" />
              </div>
              <span className="hidden sm:block">John Developer</span>
            </Link>

            <Link href="/admin/logout">
              <Button variant="ghost" size="icon" aria-label="Sign out">
                <LogOut className="h-5 w-5 text-slate-500 hover:text-red-600" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}