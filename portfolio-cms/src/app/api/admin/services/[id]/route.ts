import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { serviceSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('GET /api/admin/services/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
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
    
    const validation = serviceSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const dataToUpdate = {
      ...validation.data,
      features: validation.data.features 
        ? validation.data.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        : undefined,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('services')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/admin/services/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
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
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/services/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}