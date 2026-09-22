import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'

const SOCIAL_FIELDS = ['github', 'linkedin', 'twitter']

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const updates: Record<string, string> = {}
    for (const field of SOCIAL_FIELDS) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No social fields provided' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('POST /api/admin/profile/social error:', error)
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 })
  }
}