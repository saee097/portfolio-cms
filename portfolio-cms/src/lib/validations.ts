import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  short_description: z.string().max(500).optional().nullable(),
  detailed_description: z.string().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  technologies: z.array(z.string()).optional().nullable(),
  github_url: z.string().url().optional().nullable(),
  live_url: z.string().url().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  client: z.string().max(100).optional().nullable(),
  start_date: z.string().date().optional().nullable(),
  end_date: z.string().date().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order_index: z.number().int().min(0).default(0),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

export const projectImageSchema = z.object({
  project_id: z.string().uuid(),
  url: z.string().url(),
  alt: z.string().max(200).optional().nullable(),
  order_index: z.number().int().min(0).default(0),
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional().nullable(),
  proficiency: z.number().int().min(0).max(100).default(50),
  category_id: z.string().uuid().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
})

export const skillCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
})

export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  technologies: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
      if (Array.isArray(val)) return val
      return val
    },
    z.array(z.string()).optional().nullable()
  ),
  start_date: z.string().date(),
  end_date: z.string().date().optional().nullable(),
  current: z.boolean().default(false),
  order_index: z.number().int().min(0).default(0),
})

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(200),
  institution: z.string().min(1, 'Institution is required').max(200),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  start_date: z.string().date(),
  end_date: z.string().date().optional().nullable(),
  current: z.boolean().default(false),
  order_index: z.number().int().min(0).default(0),
})

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  icon: z.string().optional().nullable(),
  features: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
      if (Array.isArray(val)) return val
      return val
    },
    z.array(z.string()).optional().nullable()
  ),
  order_index: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
  reading_time: z.number().int().min(0).default(0),
  views: z.number().int().min(0).default(0),
  tag_ids: z.array(z.string().uuid()).optional().nullable(),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const blogCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
})

export const blogTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9-]+$/),
})

export const testimonialSchema = z.object({
  client_name: z.string().min(1, 'Client name is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  company: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  message: z.string().min(1, 'Message is required').max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(true),
  order_index: z.number().int().min(0).default(0),
})

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  status: z.enum(['new', 'read', 'replied', 'archived']).default('new'),
})

export const siteSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
})

export const seoSettingSchema = z.object({
  page: z.string().min(1).max(200),
  title: z.string().max(60).optional().nullable(),
  description: z.string().max(160).optional().nullable(),
  og_title: z.string().max(60).optional().nullable(),
  og_description: z.string().max(160).optional().nullable(),
  og_image: z.string().url().optional().nullable(),
  twitter_card: z.string().max(20).optional().nullable(),
  twitter_title: z.string().max(60).optional().nullable(),
  twitter_description: z.string().max(160).optional().nullable(),
  twitter_image: z.string().url().optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
  structured_data: z.record(z.unknown()).optional().nullable(),
})

export const profileSchema = z.object({
  full_name: z.string().min(1).max(100).optional().nullable(),
  email: z.string().email().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  website: z.string().url().optional().nullable(),
  github: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>
export type ExperienceFormData = z.infer<typeof experienceSchema>
export type EducationFormData = z.infer<typeof educationSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type BlogPostFormData = z.infer<typeof blogPostSchema>
export type BlogCategoryFormData = z.infer<typeof blogCategorySchema>
export type BlogTagFormData = z.infer<typeof blogTagSchema>
export type TestimonialFormData = z.infer<typeof testimonialSchema>
export type ContactMessageFormData = z.infer<typeof contactMessageSchema>
export type ProfileFormData = z.infer<typeof profileSchema>