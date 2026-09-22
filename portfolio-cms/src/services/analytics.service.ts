import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { AnalyticsEvent, SEOSetting, SiteSetting } from '@/types'

export async function trackEvent(
  eventName: string,
  metadata?: Record<string, unknown>,
  pageUrl?: string,
  referrer?: string
): Promise<void> {
  const supabase = createServerClientSupabase()
  
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined
  
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      event_name: eventName,
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
      metadata: metadata as any,
    })

  if (error) console.error('Analytics error:', error)
}

export async function getPageViews(pageUrl?: string, days = 30): Promise<number> {
  const supabase = createAdminClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  let query = supabase
    .from('analytics_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_name', 'page_view')
    .gte('created_at', startDate.toISOString())

  if (pageUrl) {
    query = query.eq('page_url', pageUrl)
  }

  const { count, error } = await query
  if (error) throw error
  return count || 0
}

export async function getAnalyticsOverview(days = 30): Promise<{
  totalViews: number
  uniquePages: number
  topPages: { page_url: string; count: number }[]
  eventsByDay: { date: string; count: number }[]
}> {
  const supabase = createAdminClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const [totalViews, topPages, eventsByDay] = await Promise.all([
    supabase
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', 'page_view')
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('analytics_events')
      .select('page_url')
      .eq('event_name', 'page_view')
      .gte('created_at', startDate.toISOString())
      .not('page_url', 'is', null),
    supabase
      .from('analytics_events')
      .select('created_at')
      .eq('event_name', 'page_view')
      .gte('created_at', startDate.toISOString()),
  ])

  const pageCounts: Record<string, number> = {}
  topPages.data?.forEach(event => {
    if (event.page_url) {
      pageCounts[event.page_url] = (pageCounts[event.page_url] || 0) + 1
    }
  })

  const topPagesArray = Object.entries(pageCounts)
    .map(([page_url, count]) => ({ page_url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const dayCounts: Record<string, number> = {}
  eventsByDay.data?.forEach(event => {
    const date = event.created_at.split('T')[0]
    dayCounts[date] = (dayCounts[date] || 0) + 1
  })

  const eventsByDayArray = Object.entries(dayCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalViews: totalViews.count || 0,
    uniquePages: Object.keys(pageCounts).length,
    topPages: topPagesArray,
    eventsByDay: eventsByDayArray,
  }
}

export async function getSEOSettings(page: string): Promise<SEOSetting | null> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .eq('page', page)
    .single()

  if (error) return null
  return data
}

export async function getAllSEOSettings(): Promise<SEOSetting[]> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .order('page', { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertSEOSettings(settings: Omit<SEOSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SEOSetting> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('seo_settings')
    .upsert({ ...settings, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error) throw error
  
  return (data || []).reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, unknown>)
}

export async function getSiteSetting(key: string): Promise<unknown> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) return null
  return data?.value
}

export async function upsertSiteSetting(setting: Omit<SiteSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSetting> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ ...setting, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data
}