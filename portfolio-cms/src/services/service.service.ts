import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Service } from '@/types'

export async function getServices(publishedOnly = true): Promise<Service[]> {
  const supabase = createServerClientSupabase()
  
  let query = supabase.from('services').select('*').order('order_index', { ascending: true })
  
  if (publishedOnly) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderServices(serviceIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = serviceIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('services')
    .upsert(updates)

  if (error) throw error
}