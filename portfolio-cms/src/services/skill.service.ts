import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Skill, SkillCategory, SkillWithCategory } from '@/types'

export async function getSkills(): Promise<SkillWithCategory[]> {
  const supabase = createServerClientSupabase()
  
  const { data: skills, error } = await supabase
    .from('skills')
    .select(`
      *,
      category:skill_categories(*)
    `)
    .order('order_index', { ascending: true })

  if (error) throw error
  return (skills || []) as SkillWithCategory[]
}

export async function getSkillsByCategory(): Promise<Record<string, SkillWithCategory[]>> {
  const skills = await getSkills()
  return skills.reduce((acc, skill) => {
    const categoryName = skill.category?.name || 'Uncategorized'
    if (!acc[categoryName]) acc[categoryName] = []
    acc[categoryName].push(skill)
    return acc
  }, {} as Record<string, SkillWithCategory[]>)
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createServerClientSupabase()
  
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('skills')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function createSkillCategory(category: Omit<SkillCategory, 'id' | 'created_at' | 'updated_at'>): Promise<SkillCategory> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('skill_categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSkillCategory(id: string, updates: Partial<SkillCategory>): Promise<SkillCategory> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('skill_categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSkillCategory(id: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderSkills(skillIds: string[]): Promise<void> {
  const supabase = createAdminClient()
  
  const updates = skillIds.map((id, index) => ({
    id,
    order_index: index,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('skills')
    .upsert(updates)

  if (error) throw error
}