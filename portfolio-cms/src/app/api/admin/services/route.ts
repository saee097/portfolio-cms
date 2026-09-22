import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { serviceSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    let query = supabase.from('services').select('*', { count: 'exact' })

    if (status === 'published') query = query.eq('published', true)
    else if (status === 'draft') query = query.eq('published', false)

    if (search) {
      query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order('order_index', { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (error) {
    console.error('GET /api/admin/services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = serviceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const dataToInsert = {
      ...validation.data,
      features: validation.data.features 
        ? validation.data.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        : [],
    }

    const { data, error } = await supabase
      .from('services')
      .insert(dataToInsert)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/services error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}