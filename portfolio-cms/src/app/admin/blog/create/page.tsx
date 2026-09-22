import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Image, Tag, Calendar, Hash } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Create Blog Post',
  description: 'Create a new blog post.',
}

async function getCategories() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('blog_categories').select('id, name').order('name')
  return data || []
}

async function getTags() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('blog_tags').select('id, name').order('name')
  return data || []
}

export default async function CreateBlogPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon" aria-label="Back to blog">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Blog Post</h1>
            <p className="text-slate-600 dark:text-slate-400">Write a new article for your blog.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action="/api/admin/blog">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Content</h2>
          <div className="space-y-6">
            <Input
              label="Title *"
              name="title"
              placeholder="Enter post title"
              required
              maxLength={200}
            />
            <Input
              label="Slug *"
              name="slug"
              placeholder="post-slug"
              required
              maxLength={200}
              pattern="[a-z0-9-]+"
              helperText="Lowercase, numbers, and hyphens only. Auto-generated from title if empty."
            />
            <Textarea
              label="Excerpt"
              name="excerpt"
              placeholder="Brief summary for listings and SEO (max 500 chars)"
              rows={3}
              maxLength={500}
            />
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content (Markdown)
              </label>
              <Textarea
                name="content"
                placeholder="Write your article content here using Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports GitHub-flavored Markdown with code highlighting.</p>
            </div>
          </div>
        </Card>

        {/* Cover Image */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Cover Image
          </h2>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
            <Image className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">Drag & drop cover image, or click to browse</p>
            <Button variant="outline" className="w-auto">Choose File</Button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Recommended: 1200x630px, max 2MB.</p>
        </Card>

        {/* Metadata */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Metadata</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Category"
              name="category_id"
              placeholder="Select category"
              options={[{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags</label>
              <select
                name="tag_ids"
                multiple
                className="w-full h-24 px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
              >
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Input
              label="SEO Title"
              name="seo_title"
              placeholder="Custom SEO title (max 60 chars)"
              maxLength={60}
            />
            <Input
              label="SEO Description"
              name="seo_description"
              placeholder="Custom SEO description (max 160 chars)"
              maxLength={160}
            />
          </div>
        </Card>

        {/* Publishing */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Publishing</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" name="status" id="published" value="published" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="published" className="font-medium text-slate-900 dark:text-slate-100">Published</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="featured" className="font-medium text-slate-900 dark:text-slate-100">Featured</label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="schedule" id="schedule" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="schedule" className="font-medium text-slate-900 dark:text-slate-100">Schedule for later</label>
              <Input
                name="published_at"
                type="datetime-local"
                className="ml-auto max-w-xs"
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </form>
    </div>
  )
}