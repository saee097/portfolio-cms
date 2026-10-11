import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { contactMessageStatusSchema } from '@/lib/validations'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Malformed request body' }, { status: 400 })
    }

    const validation = contactMessageStatusSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'status must be one of: new, read, replied, archived' },
        { status: 422 }
      )
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status: validation.data.status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('POST /api/admin/messages/[id]/status error:', error)
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 })
  }
}