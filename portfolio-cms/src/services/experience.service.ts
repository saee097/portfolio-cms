import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Experience, Education } from '@/types'

export async function getExperiences(): Promise<Experience[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createExperience(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('experiences')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExperience(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getEducation(): Promise<Education[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createEducation(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('education')
    .insert(education)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('education')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEducation(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderExperiences(experienceIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = experienceIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('experiences')
    .upsert(updates)

  if (error) throw error
}

export async function reorderEducation(educationIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = educationIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('education')
    .upsert(updates)

  if (error) throw error
}