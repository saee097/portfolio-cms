import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { BlogPost, BlogCategory, BlogTag, BlogPostWithRelations, PaginatedResponse, FilterParams } from '@/types'

const POSTS_PER_PAGE = 10

export async function getBlogPosts(params: FilterParams = {}): Promise<PaginatedResponse<BlogPost>> {
  const supabase = createServerClientSupabase()
  const {
    page = 1,
    pageSize = POSTS_PER_PAGE,
    search,
    sortBy = 'published_at',
    sortOrder = 'desc',
    status,
    category,
  } = params

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })

  if (status === 'published') {
    query = query.eq('status', 'published').not('published_at', 'is', null)
  } else if (status === 'draft') {
    query = query.eq('status', 'draft')
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function getPublishedBlogPosts(params: Omit<FilterParams, 'status'> = {}): Promise<PaginatedResponse<BlogPost>> {
  return getBlogPosts({ ...params, status: 'published' })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  const supabase = createServerClientSupabase()
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) return null

  const [category, tags, author] = await Promise.all([
    post.category_id ? supabase.from('blog_categories').select('*').eq('id', post.category_id).single() : Promise.resolve({ data: null }),
    supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('post_id', post.id)
      .then(({ data }) => data?.map(t => t.tag_id) || []),
    post.author_id ? supabase.from('profiles').select('*').eq('user_id', post.author_id).single() : Promise.resolve({ data: null }),
  ])

  let tagData: BlogTag[] = []
  if (tags.length > 0) {
    const { data } = await supabase.from('blog_tags').select('*').in('id', tags)
    tagData = data || []
  }

  return {
    ...post,
    category: category.data,
    tags: tagData,
    author: author.data,
  }
}

export async function getBlogPostById(id: string): Promise<BlogPostWithRelations | null> {
  const supabase = createAdminClient()
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) return null

  const [category, tags, author] = await Promise.all([
    post.category_id ? supabase.from('blog_categories').select('*').eq('id', post.category_id).single() : Promise.resolve({ data: null }),
    supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('post_id', post.id)
      .then(({ data }) => data?.map(t => t.tag_id) || []),
    post.author_id ? supabase.from('profiles').select('*').eq('user_id', post.author_id).single() : Promise.resolve({ data: null }),
  ])

  let tagData: BlogTag[] = []
  if (tags.length > 0) {
    const { data } = await supabase.from('blog_tags').select('*').in('id', tags)
    tagData = data || []
  }

  return {
    ...post,
    category: category.data,
    tags: tagData,
    author: author.data,
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<BlogPost> {
  const supabase = createAdminClient()
  
  const readingTime = post.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 0
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ ...post, reading_time: readingTime, views: 0 })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const supabase = createAdminClient()
  
  const updateData: Partial<BlogPost> = { ...updates, updated_at: new Date().toISOString() }
  
  if (updates.content) {
    updateData.reading_time = Math.ceil(updates.content.split(/\s+/).length / 200)
  }
  
  if (updates.status === 'published' && !updates.published_at) {
    updateData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  await supabase.from('blog_post_tags').delete().eq('post_id', id)
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function incrementBlogViews(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase.rpc('increment_blog_views', { post_id: id })
  
  if (error) {
    const { data: post } = await supabase.from('blog_posts').select('views').eq('id', id).single()
    if (post) {
      await supabase.from('blog_posts').update({ views: post.views + 1 }).eq('id', id)
    }
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getBlogTags(): Promise<BlogTag[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createBlogCategory(category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<BlogCategory> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('blog_categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createBlogTag(tag: Omit<BlogTag, 'id' | 'created_at'>): Promise<BlogTag> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('blog_tags')
    .insert(tag)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function setBlogPostTags(postId: string, tagIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  await supabase.from('blog_post_tags').delete().eq('post_id', postId)
  
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('blog_post_tags')
      .insert(tagIds.map(tagId => ({ post_id: postId, tag_id: tagId })))
    
    if (error) throw error
  }
}

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3): Promise<BlogPost[]> {
  const supabase = createServerClientSupabase()
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}