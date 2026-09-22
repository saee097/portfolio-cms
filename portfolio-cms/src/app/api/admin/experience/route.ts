import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { experienceSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''

    let query = supabase.from('experiences').select('*', { count: 'exact' })

    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`)
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
    console.error('GET /api/admin/experience error:', error)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = experienceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const dataToInsert = {
      ...validation.data,
      technologies: validation.data.technologies 
        ? validation.data.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [],
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert(dataToInsert)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/experience error:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}