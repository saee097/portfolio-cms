import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Image, Globe, Github, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Edit Project',
  description: 'Edit portfolio project.',
}

interface ProjectEditPageProps {
  params: Promise<{ id: string }>
}

async function getProject(id: string) {
  const supabase = createServerClientSupabase()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) return null

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', id)
    .order('order_index', { ascending: true })

  return { ...project, images: images || [] }
}

const categories = [
  'Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Desktop', 'DevOps', 'AI/ML', 'Other'
]

export default async function EditProjectPage({ params }: ProjectEditPageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon" aria-label="Back to projects">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Edit Project</h1>
            <p className="text-slate-600 dark:text-slate-400">{project.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.published ? 'success' : 'secondary'} className="text-sm">
            {project.published ? 'Published' : 'Draft'}
          </Badge>
          {project.featured && <Badge variant="default" className="text-sm">Featured</Badge>}
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action={`/api/admin/projects/${id}`}>
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Title *"
                name="title"
                defaultValue={project.title}
                required
                maxLength={200}
              />
              <Input
                label="Slug *"
                name="slug"
                defaultValue={project.slug}
                required
                maxLength={200}
                pattern="[a-z0-9-]+"
                helperText="Lowercase, numbers, and hyphens only"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="Category"
                name="category"
                defaultValue={project.category || ''}
                placeholder="Select category"
                options={[{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c, label: c }))]}
              />
              <Input
                label="Client"
                name="client"
                defaultValue={project.client || ''}
                placeholder="Client name (optional)"
                maxLength={100}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                name="start_date"
                type="date"
                defaultValue={project.start_date ? project.start_date.split('T')[0] : ''}
              />
              <Input
                label="End Date"
                name="end_date"
                type="date"
                defaultValue={project.end_date ? project.end_date.split('T')[0] : ''}
              />
            </div>
            <Textarea
              label="Short Description"
              name="short_description"
              defaultValue={project.short_description || ''}
              placeholder="Brief description for cards and listings (max 500 chars)"
              rows={3}
              maxLength={500}
            />
            <Textarea
              label="Detailed Description"
              name="detailed_description"
              defaultValue={project.detailed_description || ''}
              placeholder="Full project description with markdown support"
              rows={8}
            />
          </div>
        </Card>

        {/* Links */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="GitHub URL"
              name="github_url"
              defaultValue={project.github_url || ''}
              placeholder="https://github.com/username/repo"
              helperText="Repository URL"
            />
            <Input
              label="Live URL"
              name="live_url"
              defaultValue={project.live_url || ''}
              placeholder="https://project-demo.com"
              helperText="Live demo URL"
            />
          </div>
        </Card>

        {/* Technologies */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Technologies</h2>
          <Textarea
            label="Technologies (one per line)"
            name="technologies"
            defaultValue={project.technologies?.join('\n') || ''}
            placeholder="Next.js&#10;TypeScript&#10;PostgreSQL&#10;Tailwind CSS"
            rows={6}
            helperText="Enter each technology on a new line"
          />
        </Card>

        {/* Media */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Media
          </h2>
          <div className="space-y-4">
            {project.thumbnail_url && (
              <div className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover" />
                </div>
                <button type="button" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </button>
              </div>
            )}
            
            {project.images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-100 mb-3">Additional Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {project.images.map((image: { id: string; url: string; alt?: string | null }, index: number) => (
                    <div key={image.id} className="relative group aspect-square">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" />
                      </div>
                      <button type="button" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => {}}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">Drag & drop images, or click to browse</p>
              <Button variant="outline" className="w-auto">Add Images</Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recommended: 1200x800px, max 2MB per image.</p>
          </div>
        </Card>

        {/* Publishing & SEO */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Publishing & SEO</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured" defaultChecked={project.featured} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="featured" className="font-medium text-slate-600 dark:text-slate-100">Featured project</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="published" id="published" defaultChecked={project.published} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="published" className="font-medium text-slate-600 dark:text-slate-100">Published</label>
              </div>
            </div>
            <Input
              label="SEO Title"
              name="seo_title"
              defaultValue={project.seo_title || ''}
              placeholder="Custom SEO title (max 60 chars)"
              maxLength={60}
            />
            <Textarea
              label="SEO Description"
              name="seo_description"
              defaultValue={project.seo_description || ''}
              placeholder="Custom SEO description (max 160 chars)"
              rows={3}
              maxLength={160}
            />
            <Input
              label="Order Index"
              name="order_index"
              type="number"
              defaultValue={project.order_index}
              min="0"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/admin/projects/${id}/duplicate`}>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            </Link>
            <button type="button" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
              <Trash2 className="h-4 w-4 inline mr-1" />
              Delete Project
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}