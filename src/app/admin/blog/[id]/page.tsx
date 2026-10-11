import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image, Tag, Calendar, Hash, Trash2, Copy, ExternalLink, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Edit Blog Post',
  description: 'Edit an existing blog post.',
}

interface BlogEditPageProps {
  params: Promise<{ id: string }>
}

async function getBlogPost(id: string) {
  const supabase = createServerClientSupabase()
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name),
      tags:blog_post_tags(tag_id),
      author:profiles(full_name)
    `)
    .eq('id', id)
    .single()

  if (error || !post) return null

  const tagIds = post.tags?.map((t: { tag_id: string }) => t.tag_id) || []
  
  return { ...post, tag_ids: tagIds }
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

export default async function EditBlogPage({ params }: BlogEditPageProps) {
  const { id } = await params
  const [post, categories, tags] = await Promise.all([
    getBlogPost(id),
    getCategories(),
    getTags(),
  ])

  if (!post) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon" aria-label="Back to blog">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Edit Blog Post</h1>
            <p className="text-slate-600 dark:text-slate-400">{post.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={post.status === 'published' ? 'success' : 'secondary'} className="text-sm">
            {post.status}
          </Badge>
          {post.published_at && (
            <Badge variant="outline" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(post.published_at)}
            </Badge>
          )}
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action={`/api/admin/blog/${id}`}>
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Content</h2>
          <div className="space-y-6">
            <Input
              label="Title *"
              name="title"
              defaultValue={post.title}
              required
              maxLength={200}
            />
            <Input
              label="Slug *"
              name="slug"
              defaultValue={post.slug}
              required
              maxLength={200}
              pattern="[a-z0-9-]+"
              helperText="Lowercase, numbers, and hyphens only."
            />
            <Textarea
              label="Excerpt"
              name="excerpt"
              defaultValue={post.excerpt || ''}
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
                defaultValue={post.content || ''}
                placeholder="Write your article content here using Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Cover Image */}
        <Card>
          <h2 className="text-lg font-semibold 
           dark:text-slate-100 mb-6 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Cover Image
          </h2>
          <div className="space-y-4">
            {post.cover_image_url && (
              <div className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <button type="button" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </button>
              </div>
            )}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">Drag & drop cover image, or click to browse</p>
              <Button variant="outline" className="w-auto">Choose File</Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recommended: 1200x630px, max 2MB.</p>
          </div>
        </Card>

        {/* Metadata */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Metadata</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Category"
              name="category_id"
              defaultValue={post.category_id || ''}
              placeholder="Select category"
              options={[{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags</label>
              <select
                name="tag_ids"
                multiple
                defaultValue={post.tag_ids}
                className="w-full h-24 px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
              >
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Input
              label="SEO Title"
              name="seo_title"
              defaultValue={post.seo_title || ''}
              placeholder="Custom SEO title (max 60 chars)"
              maxLength={60}
            />
            <Input
              label="SEO Description"
              name="seo_description"
              defaultValue={post.seo_description || ''}
              placeholder="Custom SEO description (max 160 chars)"
              maxLength={160}
            />
          </div>
        </Card>

        {/* Publishing */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Publishing</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" name="status" id="published" value="published" defaultChecked={post.status === 'published'} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="published" className="font-medium text-slate-600 dark:text-slate-100">Published</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured" defaultChecked={post.featured} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="featured" className="font-medium text-slate-600 dark:text-slate-100">Featured</label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="schedule" id="schedule" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="schedule" className="font-medium text-slate-600 dark:text-slate-100">Schedule for later</label>
              <Input
                name="published_at"
                type="datetime-local"
                defaultValue={post.published_at ? post.published_at.slice(0, 16) : ''}
                className="ml-auto max-w-xs"
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/admin/blog/${id}/duplicate`}>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            </Link>
            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </Button>
            </a>
            <button type="button" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
              <Trash2 className="h-4 w-4 inline mr-1" />
              Delete Post
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}