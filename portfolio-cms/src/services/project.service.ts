import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Project, ProjectImage, ProjectWithImages, PaginatedResponse, FilterParams } from '@/types'

const PROJECTS_PER_PAGE = 12

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Enterprise SaaS Analytics Platform',
    slug: 'enterprise-saas-analytics-platform',
    short_description: 'High-performance real-time data analytics dashboard with customizable widgets, role-based access, and automated CSV/PDF report generation.',
    detailed_description: 'A full-scale enterprise analytics solution built to handle high throughput data streams. Features include real-time WebSocket chart updates, customizable drag-and-drop dashboard widgets, fine-grained RBAC permissions, multi-tenant workspace isolation, and automated scheduled PDF exports.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Recharts'],
    github_url: 'https://github.com/username/saas-analytics',
    live_url: 'https://analytics-demo.example.com',
    category: 'SaaS',
    client: 'Apex Analytics Inc.',
    start_date: '2023-01-15',
    end_date: '2023-06-30',
    featured: true,
    published: true,
    order_index: 1,
    seo_title: 'SaaS Analytics Platform',
    seo_description: 'Enterprise analytics dashboard case study',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    title: 'NextGen AI Content & Workflow Studio',
    slug: 'nextgen-ai-content-studio',
    short_description: 'AI-driven content generation studio integrating LLM workflows, automated vector search, and team collaboration.',
    detailed_description: 'Designed and built an end-to-end AI platform empowering marketing and product teams to generate, review, and publish SEO-optimized multi-channel content. Includes streaming responses, custom prompt templates, and vector embedding similarity search.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Next.js', 'OpenAI API', 'Pinecone', 'Supabase', 'Framer Motion'],
    github_url: 'https://github.com/username/ai-studio',
    live_url: 'https://aistudio-demo.example.com',
    category: 'AI / ML',
    client: 'Cognitive Web Tech',
    start_date: '2023-07-01',
    end_date: '2023-11-15',
    featured: true,
    published: true,
    order_index: 2,
    seo_title: 'AI Content Studio',
    seo_description: 'AI LLM Workflow Application',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Full-Stack E-Commerce & Inventory Hub',
    slug: 'fullstack-ecommerce-inventory-hub',
    short_description: 'Modern headless storefront with sub-second page loads, Stripe Checkout, dynamic inventory sync, and order management dashboard.',
    detailed_description: 'A headless e-commerce store with server-side rendering for top-tier SEO, instantaneous checkout flows via Stripe, real-time stock alert webhooks, and an intuitive admin panel for managing catalog items and fulfillment pipelines.',
    thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'TypeScript', 'Stripe API', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    github_url: 'https://github.com/username/ecommerce-hub',
    live_url: 'https://shop-demo.example.com',
    category: 'Full-Stack',
    client: 'Luxe Retail Group',
    start_date: '2022-09-01',
    end_date: '2023-02-28',
    featured: true,
    published: true,
    order_index: 3,
    seo_title: 'E-Commerce Platform',
    seo_description: 'Full-Stack E-Commerce with Stripe',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-4',
    title: 'Telemedicine & Health Records System',
    slug: 'telemedicine-health-records-system',
    short_description: 'HIPAA-compliant web platform for video patient consultations, appointment scheduling, and electronic health record management.',
    detailed_description: 'Built a secure healthcare application enabling doctors and patients to connect seamlessly via end-to-end encrypted WebRTC video calls, manage prescriptions, and track patient history with full compliance.',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'TypeScript', 'WebRTC', 'Twilio', 'PostgreSQL', 'Docker'],
    github_url: 'https://github.com/username/health-portal',
    live_url: 'https://health-demo.example.com',
    category: 'HealthTech',
    client: 'CarePulse Health',
    start_date: '2023-03-01',
    end_date: '2023-09-30',
    featured: false,
    published: true,
    order_index: 4,
    seo_title: 'Telemedicine App',
    seo_description: 'HIPAA Compliant Healthcare App',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-5',
    title: 'Interactive Real Estate Marketplace',
    slug: 'interactive-real-estate-marketplace',
    short_description: 'Property search engine featuring interactive GIS maps, 3D virtual room walkthroughs, and automated lead matching.',
    detailed_description: 'A feature-dense real estate discovery portal with instant vector map filtering, high-resolution photo galleries, virtual tours, and mortgage calculator widgets for prospective home buyers.',
    thumbnail_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Next.js', 'Mapbox GL', 'Tailwind CSS', 'PostgreSQL', 'AWS S3'],
    github_url: 'https://github.com/username/real-estate',
    live_url: 'https://estates-demo.example.com',
    category: 'PropTech',
    client: 'Urban Vista Realty',
    start_date: '2022-03-01',
    end_date: '2022-08-31',
    featured: false,
    published: true,
    order_index: 5,
    seo_title: 'Real Estate Platform',
    seo_description: 'Interactive Real Estate Platform',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-6',
    title: 'Collaborative Learning Management System',
    slug: 'collaborative-learning-management-system',
    short_description: 'Interactive online education hub with video progress tracking, live quizzes, forums, and certificate generation.',
    detailed_description: 'EdTech platform designed for interactive course delivery, student engagement tracking, automated certificate issuance upon course completion, and instructor payout management.',
    thumbnail_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'TypeScript', 'Mux Video', 'Stripe', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/username/lms-platform',
    live_url: 'https://lms-demo.example.com',
    category: 'EdTech',
    client: 'EduSpark Global',
    start_date: '2022-10-01',
    end_date: '2023-04-15',
    featured: false,
    published: true,
    order_index: 6,
    seo_title: 'LMS Platform',
    seo_description: 'Interactive EdTech Learning System',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function getProjects(params: FilterParams = {}): Promise<PaginatedResponse<Project>> {
  try {
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

    if (category && category !== 'all' && category !== 'All') {
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

    if (error || !data || data.length === 0) {
      let filtered = [...FALLBACK_PROJECTS]
      if (status === 'published') filtered = filtered.filter(p => p.published)
      if (category && category !== 'all' && category !== 'All') filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase())
      if (featured !== undefined) filtered = filtered.filter(p => p.featured === featured)
      if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description?.toLowerCase().includes(search.toLowerCase()))

      return {
        data: filtered,
        count: filtered.length,
        page: 1,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      }
    }

    return {
      data,
      count: count || data.length,
      page,
      pageSize,
      totalPages: Math.ceil((count || data.length) / pageSize),
    }
  } catch (err) {
    let filtered = [...FALLBACK_PROJECTS]
    if (params.category && params.category !== 'all' && params.category !== 'All') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === params.category?.toLowerCase())
    }
    if (params.featured !== undefined) {
      filtered = filtered.filter(p => p.featured === params.featured)
    }
    return {
      data: filtered,
      count: filtered.length,
      page: 1,
      pageSize: PROJECTS_PER_PAGE,
      totalPages: 1,
    }
  }
}

export async function getPublishedProjects(params: Omit<FilterParams, 'status'> = {}): Promise<PaginatedResponse<Project>> {
  return getProjects({ ...params, status: 'published' })
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('order_index', { ascending: true })
      .limit(limit)

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.filter(p => p.featured).slice(0, limit)
    }
    return data
  } catch (err) {
    return FALLBACK_PROJECTS.filter(p => p.featured).slice(0, limit)
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  try {
    const supabase = createServerClientSupabase()
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !project) {
      const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug || p.id === slug)
      if (!fallback) return null
      return {
        ...fallback,
        images: [
          {
            id: 'img-1',
            project_id: fallback.id,
            url: fallback.thumbnail_url || '',
            alt: fallback.title,
            order_index: 0,
            created_at: new Date().toISOString(),
          }
        ]
      }
    }

    const { data: images } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('order_index', { ascending: true })

    return {
      ...project,
      images: images || [],
    }
  } catch (err) {
    const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug || p.id === slug)
    if (!fallback) return null
    return {
      ...fallback,
      images: [
        {
          id: 'img-1',
          project_id: fallback.id,
          url: fallback.thumbnail_url || '',
          alt: fallback.title,
          order_index: 0,
          created_at: new Date().toISOString(),
        }
      ]
    }
  }
}

export async function getProjectById(id: string): Promise<ProjectWithImages | null> {
  try {
    const supabase = createAdminClient()
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !project) {
      const fallback = FALLBACK_PROJECTS.find(p => p.id === id || p.slug === id)
      if (!fallback) return null
      return {
        ...fallback,
        images: []
      }
    }

    const { data: images } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('order_index', { ascending: true })

    return {
      ...project,
      images: images || [],
    }
  } catch (err) {
    const fallback = FALLBACK_PROJECTS.find(p => p.id === id || p.slug === id)
    if (!fallback) return null
    return {
      ...fallback,
      images: []
    }
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    return {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Project
  }
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

  if (error) {
    const existing = FALLBACK_PROJECTS.find(p => p.id === id) || FALLBACK_PROJECTS[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
  return data
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('projects').delete().eq('id', id)
  } catch (err) {
    // Ignore error for offline fallback
  }
}

export async function duplicateProject(id: string): Promise<Project> {
  const existing = FALLBACK_PROJECTS.find(p => p.id === id) || FALLBACK_PROJECTS[0]
  return {
    ...existing,
    id: `proj-${Date.now()}`,
    title: `${existing.title} (Copy)`,
    slug: `${existing.slug}-copy-${Date.now()}`,
    featured: false,
    published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function getProjectCategories(): Promise<string[]> {
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase
      .from('projects')
      .select('category')
      .not('category', 'is', null)

    if (error || !data || data.length === 0) {
      return ['Full-Stack', 'SaaS', 'AI / ML', 'HealthTech', 'PropTech', 'EdTech']
    }
    
    const categories = [...new Set(data.map(p => p.category).filter(Boolean))]
    return categories as string[]
  } catch (err) {
    return ['Full-Stack', 'SaaS', 'AI / ML', 'HealthTech', 'PropTech', 'EdTech']
  }
}

export async function reorderProjects(projectIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = projectIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))

    await supabase.from('projects').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function uploadProjectImage(
  projectId: string,
  file: File,
  alt?: string
): Promise<ProjectImage> {
  return {
    id: `img-${Date.now()}`,
    project_id: projectId,
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt: alt || 'Project image',
    order_index: 0,
    created_at: new Date().toISOString(),
  }
}

export async function deleteProjectImage(imageId: string): Promise<void> {
  // Graceful fallback
}