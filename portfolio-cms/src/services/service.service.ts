import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Service } from '@/types'

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 'serv-1',
    title: 'Full-Stack Web App Development',
    slug: 'full-stack-web-app-development',
    short_description: 'End-to-end custom web applications built with Next.js, React, and modern cloud databases.',
    description: 'Complete architecture and implementation of scalable web applications tailored to your business needs. From database design to responsive frontend interfaces and secure authentication systems.',
    icon: 'Code',
    features: ['Next.js 15 App Router & SSR', 'TypeScript & Zod Type Safety', 'PostgreSQL / Supabase integration', 'SEO & Performance Optimization', 'Clean, Modular Architecture'],
    published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'serv-2',
    title: 'SaaS MVP Development & Architecture',
    slug: 'saas-mvp-development-architecture',
    short_description: 'Turn your software idea into a launch-ready SaaS MVP in weeks with subscription payments and analytics.',
    description: 'Rapid prototyping and production-grade MVP development for startups. Includes multi-tenant data architecture, Stripe subscription billing, user role management, and admin control panels.',
    icon: 'Rocket',
    features: ['Rapid 3-4 Week Delivery', 'Stripe Checkout & Billing Portal', 'User Auth & Role Management', 'Admin Dashboard Included', 'Scalable Cloud Infrastructure'],
    published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'serv-3',
    title: 'AI & LLM Integration Services',
    slug: 'ai-llm-integration-services',
    short_description: 'Supercharge your application with OpenAI, vector search, streaming responses, and custom AI agents.',
    description: 'Integrate cutting-edge AI capabilities into your existing products. Build smart chat assistants, automated document processors, vector database search (RAG), and tailored AI tools.',
    icon: 'Brain',
    features: ['OpenAI & Anthropic API integration', 'Vector Search & Embeddings (RAG)', 'Streaming UI Responses', 'Custom Prompt Engineering', 'Token Optimization & Rate Limiting'],
    published: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'serv-4',
    title: 'UI/UX Redesign & Core Web Vitals Optimization',
    slug: 'ui-ux-redesign-performance-optimization',
    short_description: 'Modernize outdated UIs and achieve 95+ Google Lighthouse scores for maximum conversion.',
    description: 'Audit, redesign, and refactor existing web applications to improve visual appeal, mobile responsiveness, accessibility, and speed.',
    icon: 'Zap',
    features: ['Lighthouse Score 95+ Guarantee', 'Modern Glassmorphism / Tailwind Styling', 'Smooth Animations & Micro-interactions', 'Accessibility (WCAG) Compliance', 'Mobile-First Responsive Layout'],
    published: true,
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'serv-5',
    title: 'API Design & Microservices Engineering',
    slug: 'api-design-microservices-engineering',
    short_description: 'Robust RESTful and GraphQL APIs built for security, high throughput, and zero downtime.',
    description: 'Design and deploy clean, documented, and secure APIs. Includes rate limiting, JWT token validation, Swagger/OpenAPI docs, and database query optimization.',
    icon: 'Server',
    features: ['RESTful & GraphQL Specs', 'Swagger / OpenAPI Documentation', 'JWT Auth & Rate Limiting', 'Database Query Optimization', 'Automated Test Suites'],
    published: true,
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'serv-6',
    title: 'Technical Consulting & Codebase Audits',
    slug: 'technical-consulting-codebase-audits',
    short_description: 'Comprehensive code reviews, architecture consulting, and technology stack selection.',
    description: 'Identify bottlenecks, security flaws, and architectural debt in your codebase. Receive detailed refactoring roadmaps and recommendations for scaling.',
    icon: 'Search',
    features: ['Comprehensive Security & Quality Audit', 'Performance Bottleneck Identification', 'Actionable Refactoring Blueprint', '1-on-1 Strategy Calls', 'Tech Stack Evaluation'],
    published: true,
    order_index: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function getServices(publishedOnly = true): Promise<Service[]> {
  try {
    const supabase = createServerClientSupabase()
    let query = supabase.from('services').select('*').order('order_index', { ascending: true })
    
    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return publishedOnly ? FALLBACK_SERVICES.filter(s => s.published) : FALLBACK_SERVICES
    }
    return data
  } catch (err) {
    return publishedOnly ? FALLBACK_SERVICES.filter(s => s.published) : FALLBACK_SERVICES
  }
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error || !data) {
      return {
        ...service,
        id: `serv-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Service
    }
    return data
  } catch (err) {
    return {
      ...service,
      id: `serv-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Service
  }
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_SERVICES.find(s => s.id === id) || FALLBACK_SERVICES[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_SERVICES.find(s => s.id === id) || FALLBACK_SERVICES[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('services').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function reorderServices(serviceIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = serviceIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))
    await supabase.from('services').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}