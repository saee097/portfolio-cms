import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectImage = Database['public']['Tables']['project_images']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type SkillCategory = Database['public']['Tables']['skill_categories']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type Education = Database['public']['Tables']['education']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']
export type BlogTag = Database['public']['Tables']['blog_tags']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type SEOSetting = Database['public']['Tables']['seo_settings']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']

export type UserRole = Database['public']['Enums']['user_role']
export type MessageStatus = Database['public']['Enums']['message_status']
export type BlogStatus = Database['public']['Enums']['blog_status']

export interface ProjectWithImages extends Project {
  images: ProjectImage[]
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null
  tags: BlogTag[]
  author: Profile | null
}

export interface SkillWithCategory extends Skill {
  category: SkillCategory | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: string
  category?: string
  featured?: boolean
}

export interface AdminStats {
  totalProjects: number
  publishedProjects: number
  totalBlogPosts: number
  publishedBlogPosts: number
  totalMessages: number
  newMessages: number
  totalViews: number
  recentProjects: Project[]
  recentMessages: ContactMessage[]
}

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

export interface SocialLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface SEOProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  structuredData?: Record<string, unknown>
}