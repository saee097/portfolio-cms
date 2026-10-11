import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Briefcase, Image } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'

export const metadata: Metadata = {
  title: 'Create Service',
  description: 'Add a new service offering.',
}

export default function ServiceCreatePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Add Service</h1>
          <p className="text-slate-600 dark:text-slate-400">Create a new service offering.</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action="/api/admin/services" method="POST" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input id="title" name="title" placeholder="Service Title" required />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input id="slug" name="slug" placeholder="web-development" required />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="short_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <Textarea id="short_description" name="short_description" placeholder="Brief description for cards/previews" rows={3} required />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="full_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Description
              </label>
              <Textarea id="full_description" name="full_description" placeholder="Detailed description with markdown support" rows={6} />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Icon (Lucide name)
              </label>
              <Input id="icon" name="icon" placeholder="Code, PenTool, Server, etc." />
            </div>

            <div>
              <label htmlFor="icon_color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Icon Color
              </label>
              <Input id="icon_color" name="icon_color" placeholder="#3B82F6" type="color" defaultValue="#3B82F6" />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Image URL
              </label>
              <Input id="image_url" name="image_url" placeholder="https://example.com/image.jpg" type="url" />
            </div>

            <div>
              <label htmlFor="published" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Published
              </label>
              <Switch id="published" name="published" checked={true} />
            </div>

            <div>
              <label htmlFor="order_index" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Order
              </label>
              <Input id="order_index" name="order_index" type="number" min="0" defaultValue="0" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/services">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}