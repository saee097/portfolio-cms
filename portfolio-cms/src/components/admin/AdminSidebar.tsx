'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LayoutDashboard, FolderGit2, PenTool, Code, Briefcase, GraduationCap, Settings, BarChart2, Image, MessageSquare, Users, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
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

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside
      className={cn(
        'fixed lg:relative z-50 flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800', collapsed && 'justify-center')}>
        <Link href="/admin" className="flex items-center gap-2" aria-label="Go to dashboard">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
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
                    collapsed && 'justify-center px-2'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.name}</span>}
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
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">John Developer</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Super Admin</p>
            </div>
          )}
          {!collapsed && (
            <Link href="/admin/profile" className="text-xs text-primary-700 hover:underline dark:text-primary-300">
              Profile
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}