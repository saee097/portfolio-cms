import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { skillCategorySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    let query = supabase.from('skill_categories').select('*', { count: 'exact' })

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
    console.error('GET /api/admin/skill-categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch skill categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = skillCategorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('skill_categories')
      .insert(validation.data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/skill-categories error:', error)
    return NextResponse.json({ error: 'Failed to create skill category' }, { status: 500 })
  }
}