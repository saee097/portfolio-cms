import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { blogPostSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(full_name)
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Fetch tags
    const { data: tags } = await supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('post_id', id)
    
    const tagIds = tags?.map(t => t.tag_id) || []
    let tagData: Array<Record<string, unknown>> = []
    if (tagIds.length > 0) {
      const { data } = await supabase.from('blog_tags').select('*').in('id', tagIds)
      tagData = data || []
    }

    return NextResponse.json({ ...post, tags: tagData })
  } catch (error) {
    console.error('GET /api/admin/blog/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
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
    
    const validation = blogPostSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { tag_ids, ...postData } = validation.data

    const updateData: Record<string, unknown> = { ...postData, updated_at: new Date().toISOString() }
    
    if (postData.content) {
      updateData.reading_time = Math.ceil(postData.content.split(/\s+/).length / 200)
    }
    
    if (postData.status === 'published' && !postData.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Handle tags if provided
    if (Array.isArray(tag_ids)) {
      await supabase.from('blog_post_tags').delete().eq('post_id', id)

      if (tag_ids.length > 0) {
        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(tag_ids.map((tag_id: string) => ({ post_id: id, tag_id })))

        if (tagsError) throw tagsError
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/admin/blog/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    // Delete tags first
    await supabase.from('blog_post_tags').delete().eq('post_id', id)

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/blog/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}