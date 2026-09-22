import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Testimonial, ContactMessage, Media } from '@/types'

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
  const supabase = createServerClientSupabase()
  
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (publishedOnly) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('testimonials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderTestimonials(testimonialIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = testimonialIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('testimonials')
    .upsert(updates)

  if (error) throw error
}

export async function submitContactMessage(
  message: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at' | 'ip_address' | 'user_agent'>,
  ipAddress?: string,
  userAgent?: string
): Promise<ContactMessage> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      ...message,
      status: 'new',
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getMedia(bucket?: string): Promise<Media[]> {
  const supabase = createAdminClient()
  
  let query = supabase.from('media').select('*').order('created_at', { ascending: false })
  
  if (bucket) {
    query = query.eq('bucket', bucket)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function uploadMedia(
  file: File,
  bucket: string,
  uploadedBy?: string
): Promise<Media> {
  const supabase = createAdminClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const path = `${bucket}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  const { data, error } = await supabase
    .from('media')
    .insert({
      name: file.name,
      url: publicUrl,
      mime_type: file.type,
      size: file.size,
      bucket,
      path,
      uploaded_by: uploadedBy,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMedia(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('bucket, path')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  await supabase.storage.from(media.bucket).remove([media.path])

  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const STORAGE_BUCKETS = {
  PROJECT_IMAGES: 'project-images',
  BLOG_IMAGES: 'blog-images',
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  PORTFOLIO_ASSETS: 'portfolio-assets',
} as const