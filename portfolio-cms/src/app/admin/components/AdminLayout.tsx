'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LayoutDashboard, FolderGit2, Code, Briefcase, GraduationCap, Settings, BarChart2, Image, MessageSquare, Users, PenTool, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
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

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

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
            {!sidebarCollapsed && <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin</span>}
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
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
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
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">John Developer</p>
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
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
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