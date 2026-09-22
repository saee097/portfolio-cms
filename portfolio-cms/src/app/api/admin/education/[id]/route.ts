import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { educationSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { data: edu, error } = await supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !edu) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    return NextResponse.json(edu)
  } catch (error) {
    console.error('GET /api/admin/education/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await request.json()
    
    const validation = educationSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('education')
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/admin/education/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/education/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
}