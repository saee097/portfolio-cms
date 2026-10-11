import { Metadata } from 'next'
import { BarChart3, Users, Eye, TrendingUp, Calendar, Globe, MousePointer, FileText, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'View website analytics.',
}

async function getAnalytics() {
  const supabase = createServerClientSupabase()
  
  // Get total views
  const { count: totalViews } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true })
  
  // Get unique visitors (approximate by distinct page_urls)
  const { data: pageUrls } = await supabase.from('analytics_events').select('page_url').not('page_url', 'is', null)
  const uniqueVisitors = new Set(pageUrls?.map(p => p.page_url) || []).size
  
  // Get today's views
  const today = new Date().toISOString().split('T')[0]
  const { count: todayViews } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', today)
  
  // Get top pages
  const { data: topPages } = await supabase
    .from('analytics_events')
    .select('page_url')
    .not('page_url', 'is', null)
    .limit(1000)
  
  const pageCounts: Record<string, number> = {}
  topPages?.forEach(p => {
    pageCounts[p.page_url] = (pageCounts[p.page_url] || 0) + 1
  })
  const topPagesSorted = Object.entries(pageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
  
  // Get daily views for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { data: dailyData } = await supabase
    .from('analytics_events')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })
  
  const dailyCounts: Record<string, number> = {}
  dailyData?.forEach(d => {
    const date = d.created_at.split('T')[0]
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })
  
  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return {
    totalViews: totalViews || 0,
    uniqueVisitors,
    todayViews: todayViews || 0,
    topPages: topPagesSorted,
    dailyViews: dailyCounts,
    recentActivity: recentActivity || [],
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Website traffic and visitor insights.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-600 dark:text-slate-100">{analytics.totalViews.toLocaleString()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Page Views</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-600 dark:text-slate-100">{analytics.uniqueVisitors.toLocaleString()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Unique Visitors</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-600 dark:text-slate-100">{analytics.todayViews.toLocaleString()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Today&apos;s Views</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-600 dark:text-slate-100">
            {analytics.uniqueVisitors > 0 ? ((analytics.totalViews / analytics.uniqueVisitors).toFixed(1)) : '0'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pages per Visit</p>
        </Card>
      </div>

      {/* Top Pages & Daily Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Top Pages
            </h2>
          </div>
          <div className="space-y-3">
            {analytics.topPages.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">No data available</p>
            ) : (
              analytics.topPages.map(([path, count], index) => (
                <div key={path} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-slate-300 dark:text-slate-600 w-8 text-right">{index + 1}</span>
                    <div>
                      <p className="font-medium text-slate-600 dark:text-slate-100 truncate max-w-md">{path === '/' ? 'Home' : path}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{count} views</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-primary-100 dark:bg-primary-900 rounded-full flex-1 max-w-32 overflow-hidden">
                      <div 
                        className="h-full bg-primary-600" 
                        style={{ width: `${(count / analytics.topPages[0][1]) * 100}%` }} 
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-100 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Daily Views Chart (simplified) */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Views (Last 30 Days)
            </h2>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 px-2 pb-4">
            {Object.entries(analytics.dailyViews).slice(-30).map(([date, count]) => (
              <div key={date} className="flex-1 flex flex-col items-center" title={`${date}: ${count} views`}>
                <div 
                  className="bg-primary-600 rounded-t w-full max-h-full transition-all hover:bg-primary-700 cursor-pointer"
                  style={{ height: `${Math.max(4, (count / Math.max(...Object.values(analytics.dailyViews), 1)) * 100)}%` }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 transform -rotate-45 origin-bottom w-16 text-center">{date.split('-').slice(1).join('-')}</span>
              </div>
            ))}
            {Object.keys(analytics.dailyViews).length === 0 && (
              <p className="text-slate-500 dark:text-slate-400 text-center w-full">No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Referrers & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrers */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Referrers
          </h2>
          <div className="space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">Referrer tracking requires additional setup</p>
          </div>
        </Card>

        {/* Devices */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Device Types
          </h2>
          <div className="space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">Device tracking requires additional setup</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Page</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Referrer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Device</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Country</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No recent activity</td>
                </tr>
              ) : (
                analytics.recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(activity.created_at)}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-100">{activity.path || '—'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{activity.referrer || 'Direct'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{activity.device_type || '—'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{activity.country || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}