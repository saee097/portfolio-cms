import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Project, ProjectImage, ProjectWithImages, PaginatedResponse, FilterParams } from '@/types'

const PROJECTS_PER_PAGE = 12

export async function getProjects(params: FilterParams = {}): Promise<PaginatedResponse<Project>> {
  const supabase = createServerClientSupabase()
  const {
    page = 1,
    pageSize = PROJECTS_PER_PAGE,
    search,
    sortBy = 'order_index',
    sortOrder = 'asc',
    status,
    category,
    featured,
  } = params

  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })

  if (status === 'published') {
    query = query.eq('published', true)
  } else if (status === 'draft') {
    query = query.eq('published', false)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
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

export async function getPublishedProjects(params: Omit<FilterParams, 'status'> = {}): Promise<PaginatedResponse<Project>> {
  return getProjects({ ...params, status: 'published' })
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('order_index', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  const supabase = createServerClientSupabase()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !project) return null

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('order_index', { ascending: true })

  return {
    ...project,
    images: images || [],
  }
}

export async function getProjectById(id: string): Promise<ProjectWithImages | null> {
  const supabase = createAdminClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) return null

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('order_index', { ascending: true })

  return {
    ...project,
    images: images || [],
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function duplicateProject(id: string): Promise<Project> {
  const supabase = createAdminClient()
  
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', id)

  const newProject = {
    ...project,
    title: `${project.title} (Copy)`,
    slug: `${project.slug}-copy-${Date.now()}`,
    featured: false,
    published: false,
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
  }

  const { data: createdProject, error: createError } = await supabase
    .from('projects')
    .insert(newProject)
    .select()
    .single()

  if (createError) throw createError

  if (images && images.length > 0) {
    const newImages = images.map(img => ({
      ...img,
      id: undefined,
      project_id: createdProject.id,
      created_at: undefined,
    }))
    
    const { error: imagesError } = await supabase
      .from('project_images')
      .insert(newImages)
    
    if (imagesError) throw imagesError
  }

  return createdProject
}

export async function getProjectCategories(): Promise<string[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .not('category', 'is', null)

  if (error) throw error
  
  const categories = [...new Set(data.map(p => p.category).filter(Boolean))]
  return categories as string[]
}

export async function reorderProjects(projectIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = projectIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('projects')
    .upsert(updates)

  if (error) throw error
}

export async function uploadProjectImage(
  projectId: string,
  file: File,
  alt?: string
): Promise<ProjectImage> {
  const supabase = createAdminClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${projectId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName)

  const { data: image, error } = await supabase
    .from('project_images')
    .insert({
      project_id: projectId,
      url: publicUrl,
      alt,
      order_index: 0,
    })
    .select()
    .single()

  if (error) throw error
  return image
}

export async function deleteProjectImage(imageId: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { data: image, error: fetchError } = await supabase
    .from('project_images')
    .select('url')
    .eq('id', imageId)
    .single()

  if (fetchError) throw fetchError

  const url = new URL(image.url)
  const path = url.pathname.split('/project-images/')[1]

  if (path) {
    await supabase.storage.from('project-images').remove([path])
  }

  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}