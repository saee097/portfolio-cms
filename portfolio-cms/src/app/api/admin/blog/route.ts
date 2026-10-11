import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { blogPostSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'published_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    let query = supabase.from('blog_posts').select(`
      *,
      category:blog_categories(id, name, slug),
      author:profiles(full_name)
    `, { count: 'exact' })

    if (status === 'published') query = query.eq('status', 'published')
    else if (status === 'draft') query = query.eq('status', 'draft')

    if (category) query = query.eq('category_id', category)

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    // Fetch tags for each post
    const postsWithTags = await Promise.all(
      (data || []).map(async (post) => {
        const { data: tags } = await supabase
          .from('blog_post_tags')
          .select('tag_id')
          .eq('post_id', post.id)
        
        const tagIds = tags?.map(t => t.tag_id) || []
        let tagData: Array<Record<string, unknown>> = []
        if (tagIds.length > 0) {
          const { data } = await supabase.from('blog_tags').select('*').in('id', tagIds)
          tagData = data || []
        }
        return { ...post, tags: tagData }
      })
    )

    return NextResponse.json({
      data: postsWithTags,
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (error) {
    console.error('GET /api/admin/blog error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const validation = blogPostSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { tag_ids, ...postData } = validation.data

    // Calculate reading time
    const readingTime = postData.content ? Math.ceil(postData.content.split(/\s+/).length / 200) : 0

    const insertData = {
      ...postData,
      reading_time: readingTime,
      views: 0,
      author_id: user?.id || null,
      published_at: postData.status === 'published' && !postData.published_at ? new Date().toISOString() : postData.published_at,
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    // Handle tags
    if (tag_ids && tag_ids.length > 0) {
      const { error: tagsError } = await supabase
        .from('blog_post_tags')
        .insert(tag_ids.map((tag_id: string) => ({ post_id: data.id, tag_id })))
      
      if (tagsError) throw tagsError
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/blog error:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}