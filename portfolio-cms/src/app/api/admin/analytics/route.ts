import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total views
    const { count: totalViews } = await supabase.from('analytics').select('*', { count: 'exact', head: true })

    // Unique visitors (approximate by distinct sessions)
    const { data: sessions } = await supabase.from('analytics').select('session_id').not('session_id', 'is', null)
    const uniqueVisitors = new Set(sessions?.map(s => s.session_id) || []).size

    // Today's views
    const today = new Date().toISOString().split('T')[0]
    const { count: todayViews } = await supabase.from('analytics').select('*', { count: 'exact', head: true }).gte('created_at', today)

    // Top pages
    const { data: topPages } = await supabase
      .from('analytics')
      .select('path')
      .not('path', 'is', null)
      .gte('created_at', startDate.toISOString())
      .limit(1000)

    const pageCounts: Record<string, number> = {}
    topPages?.forEach(p => {
      pageCounts[p.path] = (pageCounts[p.path] || 0) + 1
    })
    const topPagesSorted = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // Daily views
    const { data: dailyData } = await supabase
      .from('analytics')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    const dailyCounts: Record<string, number> = {}
    dailyData?.forEach(d => {
      const date = d.created_at.split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    // Recent activity
    const { data: recentActivity } = await supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      totalViews: totalViews || 0,
      uniqueVisitors,
      todayViews: todayViews || 0,
      topPages: topPagesSorted,
      dailyViews: dailyCounts,
      recentActivity: recentActivity || [],
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}