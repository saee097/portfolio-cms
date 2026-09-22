import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Code, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Edit Skill Category',
  description: 'Edit an existing skill category.',
}

interface CategoryEditPageProps {
  params: Promise<{ id: string }>
}

async function getCategory(id: string) {
  const supabase = createServerClientSupabase()
  
  const { data: category, error } = await supabase
    .from('skill_categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) return null
  return category
}

export default async function EditCategoryPage({ params }: CategoryEditPageProps) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/skills">
            <Button variant="ghost" size="icon" aria-label="Back to skills">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Skill Category</h1>
            <p className="text-slate-600 dark:text-slate-400">{category.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action={`/api/admin/skill-categories/${id}`}>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Category Details</h2>
          <div className="space-y-6">
            <Input
              label="Name *"
              name="name"
              defaultValue={category.name}
              required
              maxLength={100}
            />
            <Input
              label="Slug *"
              name="slug"
              defaultValue={category.slug}
              required
              maxLength={100}
              pattern="[a-z0-9-]+"
              helperText="Lowercase, numbers, and hyphens only"
            />
            <Textarea
              label="Description"
              name="description"
              defaultValue={category.description || ''}
              placeholder="Optional description for this category"
              rows={3}
              maxLength={500}
            />
            <Input
              label="Icon (emoji or class)"
              name="icon"
              defaultValue={category.icon || ''}
              placeholder="💻 or fas fa-code"
              maxLength={50}
              helperText="Emoji or Font Awesome class name"
            />
            <Input
              label="Order Index"
              name="order_index"
              type="number"
              defaultValue={category.order_index}
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
          <button type="button" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
            <Trash2 className="h-4 w-4 inline mr-1" />
            Delete Category
          </button>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/skills">
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