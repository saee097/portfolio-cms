import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FolderGit2, PenTool, MessageSquare, Eye, TrendingUp, Users, Clock, CheckCircle, AlertCircle, Code, Image } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createServerClientSupabase } from '@/supabase/server'
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview.',
}

async function getStats() {
  const supabase = createServerClientSupabase()
  
  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalPosts },
    { count: publishedPosts },
    { count: totalMessages },
    { count: newMessages },
    { count: totalViews },
    { data: recentProjects },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'page_view'),
    supabase.from('projects').select('id, title, published, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('id, name, email, subject, status, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    totalProjects: totalProjects || 0,
    publishedProjects: publishedProjects || 0,
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    totalMessages: totalMessages || 0,
    newMessages: newMessages || 0,
    totalViews: totalViews || 0,
    recentProjects: recentProjects || [],
    recentMessages: recentMessages || [],
  }
}

const statCards = [
  { name: 'Total Projects', value: 'totalProjects', icon: FolderGit2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', href: '/admin/projects' },
  { name: 'Published', value: 'publishedProjects', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', href: '/admin/projects?status=published' },
  { name: 'Blog Posts', value: 'totalPosts', icon: PenTool, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', href: '/admin/blog' },
  { name: 'Published Posts', value: 'publishedPosts', icon: Eye, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', href: '/admin/blog?status=published' },
  { name: 'Messages', value: 'totalMessages', icon: MessageSquare, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', href: '/admin/messages' },
  { name: 'New Messages', value: 'newMessages', icon: AlertCircle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', href: '/admin/messages?status=new' },
  { name: 'Total Views', value: 'totalViews', icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', href: '/admin/analytics' },
]

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Overview of your portfolio content and activity.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/projects/create">
            <Button>
              <FolderGit2 className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
          <Link href="/admin/blog/create">
            <Button variant="outline">
              <PenTool className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="card hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {stats[stat.value as keyof typeof stats]?.toLocaleString() || 0}
                </p>
              </div>
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">View details</span>
              <ArrowRight className={cn('h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1')} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-primary-700 hover:underline dark:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProjects.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <FolderGit2 className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p>No projects yet</p>
                <Link href="/admin/projects/create" className="mt-2 inline-block text-primary-700 hover:underline dark:text-primary-300">
                  Create your first project
                </Link>
              </div>
            ) : (
              stats.recentProjects.map((project) => (
                <Link key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <FolderGit2 className="h-5 w-5 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{project.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatRelativeTime(project.updated_at)}</p>
                    </div>
                  </div>
                  <Badge variant={project.published ? 'success' : 'secondary'} className="text-xs">
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm text-primary-700 hover:underline dark:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p>No messages yet</p>
              </div>
            ) : (
              stats.recentMessages.map((message) => (
                <Link key={message.id} href={`/admin/messages/${message.id}`} className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <MessageSquare className="h-5 w-5 text-green-700 dark:text-green-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{message.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{message.subject}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatRelativeTime(message.created_at)}</p>
                    </div>
                  </div>
                  <Badge variant={
                    message.status === 'new' ? 'default' :
                    message.status === 'read' ? 'secondary' :
                    message.status === 'replied' ? 'success' : 'outline'
                  } className="text-xs">
                    {message.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/projects/create" className="card hover:shadow-lg transition-shadow text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 mx-auto mb-3">
              <FolderGit2 className="h-7 w-7 text-primary-700 dark:text-primary-300" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">New Project</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add a portfolio project</p>
          </Link>
          <Link href="/admin/blog/create" className="card hover:shadow-lg transition-shadow text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 mx-auto mb-3">
              <PenTool className="h-7 w-7 text-purple-700 dark:text-purple-300" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">New Blog Post</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Write an article</p>
          </Link>
          <Link href="/admin/skills" className="card hover:shadow-lg transition-shadow text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 mx-auto mb-3">
              <Code className="h-7 w-7 text-green-700 dark:text-green-300" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">Manage Skills</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update tech stack</p>
          </Link>
          <Link href="/admin/media" className="card hover:shadow-lg transition-shadow text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 mx-auto mb-3">
              <Image className="h-7 w-7 text-orange-700 dark:text-orange-300" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">Media Library</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload & manage files</p>
          </Link>
        </div>
      </Card>
    </div>
  )
}