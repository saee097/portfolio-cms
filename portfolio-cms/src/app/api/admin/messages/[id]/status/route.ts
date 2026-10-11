import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('POST /api/admin/messages/[id]/status error:', error)
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 })
  }
}