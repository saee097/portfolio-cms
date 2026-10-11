import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Image, Globe, Github } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

export const metadata: Metadata = {
  title: 'Create Project',
  description: 'Create a new portfolio project.',
}

const categories = [
  'Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Desktop', 'DevOps', 'AI/ML', 'Other'
]

export default function CreateProjectPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon" aria-label="Back to projects">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Create Project</h1>
            <p className="text-slate-600 dark:text-slate-400">Add a new project to your portfolio.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action="/api/admin/projects">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Title *"
                name="title"
                placeholder="Project title"
                required
                maxLength={200}
              />
              <Input
                label="Slug *"
                name="slug"
                placeholder="project-slug"
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
                placeholder="Select category"
                options={[{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c, label: c }))]}
              />
              <Input
                label="Client"
                name="client"
                placeholder="Client name (optional)"
                maxLength={100}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                name="start_date"
                type="date"
              />
              <Input
                label="End Date"
                name="end_date"
                type="date"
              />
            </div>
            <Textarea
              label="Short Description"
              name="short_description"
              placeholder="Brief description for cards and listings (max 500 chars)"
              rows={3}
              maxLength={500}
            />
            <Textarea
              label="Detailed Description"
              name="detailed_description"
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
              placeholder="https://github.com/username/repo"
              helperText="Repository URL"
            />
            <Input
              label="Live URL"
              name="live_url"
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
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">Drag & drop thumbnail image, or click to browse</p>
              <Button variant="outline" className="w-auto">Choose File</Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recommended: 1200x800px, max 2MB. Additional images can be added after creation.</p>
          </div>
        </Card>

        {/* Publishing & SEO */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Publishing & SEO</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="featured" className="font-medium text-slate-600 dark:text-slate-100">Featured project</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="published" id="published" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="published" className="font-medium text-slate-600 dark:text-slate-100">Published</label>
              </div>
            </div>
            <Input
              label="SEO Title"
              name="seo_title"
              placeholder="Custom SEO title (max 60 chars)"
              maxLength={60}
            />
            <Textarea
              label="SEO Description"
              name="seo_description"
              placeholder="Custom SEO description (max 160 chars)"
              rows={3}
              maxLength={160}
            />
            <Input
              label="Order Index"
              name="order_index"
              type="number"
              defaultValue="0"
              min="0"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}