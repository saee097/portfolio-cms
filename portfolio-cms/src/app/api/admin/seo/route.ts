import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'
import { z } from 'zod'

const seoSettingsSchema = z.object({
  site_name: z.string().min(1).max(100),
  default_title: z.string().min(1).max(100),
  default_description: z.string().min(1).max(300),
  default_og_image: z.string().url().optional().or(z.literal('')),
  twitter_handle: z.string().max(50).optional().or(z.literal('')),
  google_analytics_id: z.string().max(50).optional().or(z.literal('')),
  google_site_verification: z.string().max(100).optional().or(z.literal('')),
  structured_data: z.string().optional().or(z.literal('')),
})

export async function GET() {
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

    const { data, error } = await supabase.from('seo_settings').select('*').single()
    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validated = seoSettingsSchema.parse(body)

    const { data, error } = await supabase
      .from('seo_settings')
      .upsert({ ...validated, updated_by: user.id }, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error saving SEO settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}