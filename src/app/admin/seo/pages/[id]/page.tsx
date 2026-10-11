import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, FileText, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { createServerClientSupabase } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Page SEO',
  description: 'Edit page SEO override.',
}

async function getSEOPage(id: string) {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('seo_pages').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export default async function SEOPageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getSEOPage(id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/seo" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Edit Page SEO</h1>
          <p className="text-slate-600 dark:text-slate-400">Path: {page.path}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action={`/api/admin/seo/pages/${id}`} method="POST" className="space-y-6">
          <input type="hidden" name="_method" value="PATCH" />
          <div className="space-y-6">
            <div>
              <label htmlFor="path" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Path
              </label>
              <Input id="path" name="path" value={page.path} readOnly className="bg-slate-100 dark:bg-slate-800" />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title
              </label>
              <Input id="title" name="title" placeholder="Custom title" value={page.title || ''} />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <Textarea id="description" name="description" placeholder="Custom description" rows={3}>{page.description || ''}</Textarea>
            </div>

            <div>
              <label htmlFor="og_image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                OG Image URL
              </label>
              <Input id="og_image" name="og_image" placeholder="https://example.com/og.jpg" type="url" value={page.og_image || ''} />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="noindex" name="noindex" checked={page.noindex} />
              <label htmlFor="noindex" className="text-sm text-slate-700 dark:text-slate-300">No Index</label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/seo">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Update Page SEO
            </Button>
            <form action={`/api/admin/seo/pages/${id}`} method="POST" onSubmit={(e) => { if (!confirm('Delete this page override?')) e.preventDefault() }}>
              <input type="hidden" name="_method" value="DELETE" />
              <Button type="submit" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
          </div>
        </form>
      </Card>
    </div>
  )
}