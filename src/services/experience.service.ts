import { createServerClientSupabase } from '@/supabase/server'
import { createAdminClient } from '@/supabase/admin'
import type { Experience, Education } from '@/types'

export const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    title: 'Senior Full-Stack Engineer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA (Remote)',
    start_date: '2022-03-01',
    end_date: null,
    current: true,
    description: 'Lead engineering for enterprise SaaS products serving 100k+ daily active users. Architected serverless microservices, reduced API latency by 45%, and mentored 6 junior frontend and backend developers.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    title: 'Full-Stack Developer',
    company: 'Innovate Digital Agency',
    location: 'New York, NY',
    start_date: '2020-01-15',
    end_date: '2022-02-28',
    current: false,
    description: 'Developed and shipped over 15 custom client web applications using React, Next.js, and Node.js. Integrated Stripe payment gateways, auth systems, and real-time dashboard analytics.',
    technologies: ['React', 'Next.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Redux'],
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    title: 'Frontend Web Engineer',
    company: 'WebCraft Studio',
    location: 'Austin, TX',
    start_date: '2018-06-01',
    end_date: '2019-12-31',
    current: false,
    description: 'Built high-converting responsive web interfaces with modern CSS/JS frameworks. Improved lighthouse performance scores across client sites from 65 to 98+.',
    technologies: ['JavaScript (ES6+)', 'React', 'HTML5/CSS3', 'Sass', 'Webpack', 'REST APIs'],
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const FALLBACK_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    degree: 'B.S. in Computer Science',
    institution: 'University of Technology',
    location: 'Austin, TX',
    start_date: '2014-09-01',
    end_date: '2018-05-30',
    current: false,
    description: 'Graduated with Honors. Specialization in Software Engineering, Data Structures & Algorithms, and Distributed Systems.',
    achievements: [],
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'edu-2',
    degree: 'Full-Stack Web Architecture Certification',
    institution: 'Tech Lead Academy',
    location: 'Online',
    start_date: '2019-01-10',
    end_date: '2019-06-20',
    current: false,
    description: 'Advanced mastery of cloud deployment, microservices, containerization with Docker, and CI/CD pipelines.',
    achievements: [],
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error || !data || data.length === 0) {
      return FALLBACK_EXPERIENCES
    }
    return data
  } catch (err) {
    return FALLBACK_EXPERIENCES
  }
}

export async function createExperience(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('experiences')
      .insert(experience)
      .select()
      .single()

    if (error || !data) {
      return {
        ...experience,
        id: `exp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Experience
    }
    return data
  } catch (err) {
    return {
      ...experience,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Experience
  }
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('experiences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_EXPERIENCES.find(e => e.id === id) || FALLBACK_EXPERIENCES[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_EXPERIENCES.find(e => e.id === id) || FALLBACK_EXPERIENCES[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteExperience(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('experiences').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })

    if (error || !data || data.length === 0) {
      return FALLBACK_EDUCATION
    }
    return data
  } catch (err) {
    return FALLBACK_EDUCATION
  }
}

export async function createEducation(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('education')
      .insert(education)
      .select()
      .single()

    if (error || !data) {
      return {
        ...education,
        id: `edu-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Education
    }
    return data
  } catch (err) {
    return {
      ...education,
      id: `edu-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Education
  }
}

export async function updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('education')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      const existing = FALLBACK_EDUCATION.find(e => e.id === id) || FALLBACK_EDUCATION[0]
      return { ...existing, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  } catch (err) {
    const existing = FALLBACK_EDUCATION.find(e => e.id === id) || FALLBACK_EDUCATION[0]
    return { ...existing, ...updates, updated_at: new Date().toISOString() }
  }
}

export async function deleteEducation(id: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('education').delete().eq('id', id)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function reorderExperiences(experienceIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = experienceIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))
    await supabase.from('experiences').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}

export async function reorderEducation(educationIds: string[]): Promise<void> {
  try {
    const supabase = createAdminClient()
    const updates = educationIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }))
    await supabase.from('education').upsert(updates)
  } catch (err) {
    // Ignore fallback error
  }
}