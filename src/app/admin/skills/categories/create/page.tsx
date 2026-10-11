import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Code, FolderPlus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export const metadata: Metadata = {
  title: 'Create Skill Category',
  description: 'Create a new skill category.',
}

export default function CreateSkillCategoryPage() {
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
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Create Skill Category</h1>
            <p className="text-slate-600 dark:text-slate-400">Add a new category to organize skills.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action="/api/admin/skill-categories">
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Category Details</h2>
          <div className="space-y-6">
            <Input
              label="Name *"
              name="name"
              placeholder="e.g., Frontend, Backend, Database"
              required
              maxLength={100}
            />
            <Input
              label="Slug *"
              name="slug"
              placeholder="frontend"
              required
              maxLength={100}
              pattern="[a-z0-9-]+"
              helperText="Lowercase, numbers, and hyphens only"
            />
            <Textarea
              label="Description"
              name="description"
              placeholder="Optional description for this category"
              rows={3}
              maxLength={500}
            />
            <Input
              label="Icon (emoji or class)"
              name="icon"
              placeholder="💻 or fas fa-code"
              maxLength={50}
              helperText="Emoji or Font Awesome class name"
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
          <Link href="/admin/skills">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>
      </form>
    </div>
  )
}