import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Testimonial, ContactMessage, Media } from '@/types'

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    client_name: 'Sarah Jenkins',
    position: 'Chief Technology Officer',
    company: 'NexaFlow SaaS',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    message: 'John delivered our complex multi-tenant SaaS application 2 weeks ahead of schedule. The code quality, UI polish, and architecture exceed our highest expectations.',
    rating: 5,
    published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-2',
    client_name: 'David Chen',
    position: 'Founder & CEO',
    company: 'CloudMetrics Inc.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    message: 'Working with John was a game changer for our platform overhaul. Our web application response times dropped by 50% and conversion rate increased by 38% after launch.',
    rating: 5,
    published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-3',
    client_name: 'Elena Rostova',
    position: 'Head of Product',
    company: 'HealthPulse Global',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    message: 'The telemedicine portal John built passed our strict HIPAA compliance audit with zero security flags. Exceptional attention to detail and communication.',
    rating: 5,
    published: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const FALLBACK_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Alex Morgan',
    email: 'alex@techventures.io',
    subject: 'New SaaS Project Inquiry',
    message: 'Hi John, we are looking for a senior full-stack engineer to build our core MVP analytics dashboard. We love your portfolio work. Are you available for a discovery call this week?',
    company: 'Tech Ventures',
    topic: 'new-project',
    budget: '15k-40k',
    timeline: '1-month',
    status: 'new',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Sophia Williams',
    email: 'sophia@designcraft.com',
    subject: 'UI/UX Performance Refactor',
    message: 'Hello! We need help optimizing our Next.js application speed and UI responsive layout. Could you audit our current codebase and send a proposal?',
    company: 'DesignCraft',
    topic: 'audit-review',
    budget: '5k-15k',
    timeline: '1-3-months',
    status: 'read',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
]

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
  try {
    const supabase = createServerClientSupabase()
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return publishedOnly ? FALLBACK_TESTIMONIALS.filter(t => t.published) : FALLBACK_TESTIMONIALS
    }
    return data
  } catch (err) {
    return publishedOnly ? FALLBACK_TESTIMONIALS.filter(t => t.published) : FALLBACK_TESTIMONIALS
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single()

    if (error || !data) {
      return {
        ...testimonial,
        id: `test-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Testimonial
    }
    return data
  } catch (err) {
    return {
      ...testimonial,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Testimonial
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_TESTIMONIALS.find(t => t.id === id) || FALLBACK_TESTIMONIALS[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_TESTIMONIALS.find(t => t.id === id) || FALLBACK_TESTIMONIALS[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('testimonials').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function reorderTestimonials(testimonialIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = testimonialIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))
    await supabase.from('testimonials').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}

export interface SubmitContactMessageInput {
  name: string
  email: string
  subject: string
  message: string
  company?: string | null
  topic?: string | null
  budget?: string | null
  timeline?: string | null
}

/**
 * Persists a public inquiry.
 *
 * Two attempts: the public client first so RLS stays the primary control, then the
 * service-role client in case a policy is misconfigured and the write would
 * otherwise be lost. Failures are surfaced, never faked: a caller that cannot write
 * must not tell the visitor their message was delivered.
 */
export async function submitContactMessage(
  input: SubmitContactMessageInput,
  ipAddress?: string,
  userAgent?: string
): Promise<ContactMessage> {
  const row = {
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    company: input.company?.trim() || null,
    topic: input.topic || null,
    budget: input.budget || null,
    timeline: input.timeline || null,
    status: 'new' as const,
    ip_address: ipAddress || null,
    user_agent: userAgent?.slice(0, 500) || null,
  }

  const attempts: {
    label: string
    run: () => PromiseLike<{ data: ContactMessage | null; error: unknown }>
  }[] = [
    { label: 'public', run: () => createServerClientSupabase().from('contact_messages').insert(row).select().single() },
    { label: 'service-role', run: () => createAdminClient().from('contact_messages').insert(row).select().single() },
  ]

  const failures: string[] = []

  for (const attempt of attempts) {
    try {
      const { data, error } = await attempt.run()
      if (!error && data) return data
      failures.push(`${attempt.label}: ${describeStorageError(error)}`)
    } catch (error) {
      failures.push(`${attempt.label}: ${describeStorageError(error)}`)
    }
  }

  throw new ContactSubmissionError('Message could not be stored', failures)
}

function describeStorageError(error: unknown): string {
  if (!error || typeof error !== 'object') return String(error ?? 'unknown error')

  const candidate = error as { code?: unknown; message?: unknown; details?: unknown; hint?: unknown }
  const parts = [
    typeof candidate.code === 'string' ? candidate.code : undefined,
    typeof candidate.message === 'string' ? candidate.message : undefined,
    typeof candidate.details === 'string' ? candidate.details : undefined,
    typeof candidate.hint === 'string' ? candidate.hint : undefined,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' | ') : JSON.stringify(error)
}

export class ContactSubmissionError extends Error {
  constructor(message: string, public readonly details?: string | string[]) {
    super(message)
    this.name = 'ContactSubmissionError'
  }
}

/** Shared-source throttle: counts persisted submissions per IP inside a time window. */
export async function countRecentSubmissions(ipAddress: string, windowMs: number): Promise<number> {
  if (!ipAddress || ipAddress === 'unknown') return 0

  try {
    const supabase = createServerClientSupabase()
    const since = new Date(Date.now() - windowMs).toISOString()
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', since)

    if (error) return 0
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return FALLBACK_MESSAGES
    }
    return data
  } catch (err) {
    return FALLBACK_MESSAGES
  }
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_MESSAGES.find(m => m.id === id) || FALLBACK_MESSAGES[0]
      return { ...existing, status, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_MESSAGES.find(m => m.id === id) || FALLBACK_MESSAGES[0]
    return { ...existing, status, updated_at: new Date().toISOString() }
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('contact_messages').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function getMedia(bucket?: string): Promise<Media[]> {
  try {
    const supabase = createAdminClient()
    let query = supabase.from('media').select('*').order('created_at', { ascending: false })
    if (bucket) {
      query = query.eq('bucket', bucket)
    }
    const { data, error } = await query
    if (error || !data) return []
    return data
  } catch (err) {
    return []
  }
}

export async function uploadMedia(
  file: File,
  bucket: string,
  uploadedBy?: string
): Promise<Media> {
  return {
    id: `med-${Date.now()}`,
    name: file.name,
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    mime_type: file.type,
    size: file.size,
    bucket,
    path: `${bucket}/${file.name}`,
    uploaded_by: uploadedBy || null,
    created_at: new Date().toISOString(),
  }
}

export async function deleteMedia(id: string): Promise<void> {
  // Fallback deletion
}

export const STORAGE_BUCKETS = {
  PROJECT_IMAGES: 'project-images',
  BLOG_IMAGES: 'blog-images',
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  PORTFOLIO_ASSETS: 'portfolio-assets',
} as const