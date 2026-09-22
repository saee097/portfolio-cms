import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { projectSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'order_index'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured') || ''

    let query = supabase.from('projects').select('*', { count: 'exact' })

    if (status === 'published') query = query.eq('published', true)
    else if (status === 'draft') query = query.eq('published', false)

    if (category) query = query.eq('category', category)
    if (featured === 'true') query = query.eq('featured', true)
    else if (featured === 'false') query = query.eq('featured', false)

    if (search) {
      query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
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
    console.error('GET /api/admin/projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = projectSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    const projectData = {
      ...validation.data,
      technologies: validation.data.technologies || [],
      created_by: user?.id || null,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/projects error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}