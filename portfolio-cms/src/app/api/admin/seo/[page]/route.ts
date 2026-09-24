import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'
import { z } from 'zod'

const seoPageSchema = z.object({
  path: z.string().min(1).max(255),
  title: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(300).optional().or(z.literal('')),
  og_image: z.string().url().optional().or(z.literal('')),
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false),
})

export async function GET() {
  try {
    const supabase = createServerClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
    if (!profile || !['super_admin', 'admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase.from('seo_pages').select('*').order('path')
    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching SEO pages:', error)
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

    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
    if (!profile || !['super_admin', 'admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = seoPageSchema.parse(body)

    const { data, error } = await supabase
      .from('seo_pages')
      .insert({ ...validated, updated_by: user.id })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating SEO page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}