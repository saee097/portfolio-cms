import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { educationSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''

    let query = supabase.from('education').select('*', { count: 'exact' })

    if (search) {
      query = query.or(`degree.ilike.%${search}%,institution.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order('start_date', { ascending: false })
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
    console.error('GET /api/admin/education error:', error)
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = educationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('education')
      .insert(validation.data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/education error:', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}