import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Skill, SkillCategory, SkillWithCategory } from '@/types'

export const FALLBACK_CATEGORIES: SkillCategory[] = [
  { id: 'cat-1', name: 'Frontend', slug: 'frontend', description: 'Client-side frameworks and web UI tools', icon: 'Code', order_index: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Backend', slug: 'backend', description: 'Server-side languages, frameworks, and APIs', icon: 'Server', order_index: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Databases & Cloud', slug: 'databases-cloud', description: 'Data storage, ORMs, and cloud hosting', icon: 'Database', order_index: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-4', name: 'DevOps & Tools', slug: 'devops-tools', description: 'Workflow automation, version control, and containers', icon: 'Layers', order_index: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export const FALLBACK_SKILLS: SkillWithCategory[] = [
  { id: 'sk-1', category_id: 'cat-1', name: 'React.js', proficiency: 95, icon: 'Code', order_index: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[0] },
  { id: 'sk-2', category_id: 'cat-1', name: 'Next.js 15', proficiency: 92, icon: 'Globe', order_index: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[0] },
  { id: 'sk-3', category_id: 'cat-1', name: 'TypeScript', proficiency: 90, icon: 'Code', order_index: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[0] },
  { id: 'sk-4', category_id: 'cat-1', name: 'Tailwind CSS', proficiency: 95, icon: 'Layers', order_index: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[0] },
  { id: 'sk-5', category_id: 'cat-2', name: 'Node.js & Express', proficiency: 88, icon: 'Server', order_index: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[1] },
  { id: 'sk-6', category_id: 'cat-2', name: 'REST & GraphQL APIs', proficiency: 90, icon: 'Server', order_index: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[1] },
  { id: 'sk-7', category_id: 'cat-2', name: 'Python', proficiency: 82, icon: 'Terminal', order_index: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[1] },
  { id: 'sk-8', category_id: 'cat-3', name: 'PostgreSQL', proficiency: 86, icon: 'Database', order_index: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[2] },
  { id: 'sk-9', category_id: 'cat-3', name: 'Supabase / Firebase', proficiency: 90, icon: 'Database', order_index: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[2] },
  { id: 'sk-10', category_id: 'cat-3', name: 'Redis', proficiency: 80, icon: 'Database', order_index: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[2] },
  { id: 'sk-11', category_id: 'cat-4', name: 'Docker & Containers', proficiency: 84, icon: 'Layers', order_index: 11, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[3] },
  { id: 'sk-12', category_id: 'cat-4', name: 'Git & GitHub Actions', proficiency: 92, icon: 'GitBranch', order_index: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), category: FALLBACK_CATEGORIES[3] },
]

export async function getSkills(): Promise<SkillWithCategory[]> {
  try {
    const supabase = createServerClientSupabase()
    const { data: skills, error } = await supabase
      .from('skills')
      .select(`
        *,
        category:skill_categories(*)
      `)
      .order('order_index', { ascending: true })

    if (error || !skills || skills.length === 0) {
      return FALLBACK_SKILLS
    }
    return skills as SkillWithCategory[]
  } catch (err) {
    return FALLBACK_SKILLS
  }
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
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES
    }
    return data
  } catch (err) {
    return FALLBACK_CATEGORIES
  }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single()

    if (error || !data) {
      return {
        ...skill,
        id: `sk-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Skill
    }
    return data
  } catch (err) {
    return {
      ...skill,
      id: `sk-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Skill
  }
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('skills')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_SKILLS.find(s => s.id === id) || FALLBACK_SKILLS[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_SKILLS.find(s => s.id === id) || FALLBACK_SKILLS[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('skills').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function createSkillCategory(category: Omit<SkillCategory, 'id' | 'created_at' | 'updated_at'>): Promise<SkillCategory> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('skill_categories')
      .insert(category)
      .select()
      .single()

    if (error || !data) {
      return {
        ...category,
        id: `cat-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as SkillCategory
    }
    return data
  } catch (err) {
    return {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as SkillCategory
  }
}

export async function updateSkillCategory(id: string, updates: Partial<SkillCategory>): Promise<SkillCategory> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('skill_categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_CATEGORIES.find(c => c.id === id) || FALLBACK_CATEGORIES[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_CATEGORIES.find(c => c.id === id) || FALLBACK_CATEGORIES[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteSkillCategory(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('skill_categories').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function reorderSkills(skillIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = skillIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))
    await supabase.from('skills').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}