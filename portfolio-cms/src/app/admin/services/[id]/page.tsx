import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Briefcase, Image, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { createServerClientSupabase } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Service',
  description: 'Edit a service offering.',
}

async function getService(id: string) {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export default async function ServiceEditPage({ params }: { params: { id: string } }) {
  const service = await getService(params.id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Service</h1>
          <p className="text-slate-600 dark:text-slate-400">Update service: {service.title}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action={`/api/admin/services/${params.id}`} method="POST" className="space-y-6">
          <input type="hidden" name="_method" value="PATCH" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input id="title" name="title" placeholder="Service Title" value={service.title} required />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input id="slug" name="slug" placeholder="web-development" value={service.slug} required />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="short_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <Textarea id="short_description" name="short_description" placeholder="Brief description for cards/previews" rows={3} required>{service.short_description}</Textarea>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="full_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Description
              </label>
              <Textarea id="full_description" name="full_description" placeholder="Detailed description with markdown support" rows={6}>{service.full_description || ''}</Textarea>
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Icon (Lucide name)
              </label>
              <Input id="icon" name="icon" placeholder="Code, PenTool, Server, etc." value={service.icon || ''} />
            </div>

            <div>
              <label htmlFor="icon_color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Icon Color
              </label>
              <Input id="icon_color" name="icon_color" type="color" value={service.icon_color || '#3B82F6'} />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Image URL
              </label>
              <Input id="image_url" name="image_url" placeholder="https://example.com/image.jpg" type="url" value={service.image_url || ''} />
            </div>

            <div>
              <label htmlFor="published" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Published
              </label>
              <Switch id="published" name="published" checked={service.published} />
            </div>

            <div>
              <label htmlFor="order_index" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Order
              </label>
              <Input id="order_index" name="order_index" type="number" min="0" defaultValue={service.order_index} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/services">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Update Service
            </Button>
            <form action={`/api/admin/services/${params.id}`} method="POST" onSubmit={(e) => { if (!confirm('Delete this service?')) e.preventDefault() }}>
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