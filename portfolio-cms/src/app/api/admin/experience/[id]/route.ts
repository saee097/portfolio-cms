import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { experienceSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { data: exp, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !exp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(exp)
  } catch (error) {
    console.error('GET /api/admin/experience/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
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
    
    const validation = experienceSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const dataToUpdate = {
      ...validation.data,
      technologies: validation.data.technologies ?? [],
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('experiences')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/admin/experience/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
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
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/experience/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}