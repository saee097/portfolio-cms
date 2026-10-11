import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Code, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Create Skill',
  description: 'Create a new skill.',
}

async function getCategories() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('skill_categories').select('id, name').order('name')
  return data || []
}

export default async function CreateSkillPage() {
  const categories = await getCategories()

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
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Create Skill</h1>
            <p className="text-slate-600 dark:text-slate-400">Add a new technical skill.</p>
          </div>
        </div>
        <Link href="/admin/skills/categories/create">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </Link>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action="/api/admin/skills">
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Skill Details</h2>
          <div className="space-y-6">
            <Input
              label="Name *"
              name="name"
              placeholder="e.g., React, TypeScript, PostgreSQL"
              required
              maxLength={100}
            />
            <Input
              label="Icon (emoji or class)"
              name="icon"
              placeholder="⚛️ or fab fa-react"
              maxLength={50}
              helperText="Emoji or Font Awesome class name"
            />
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Proficiency *"
                name="proficiency"
                type="number"
                defaultValue="50"
                min="0"
                max="100"
                required
                helperText="0-100"
              />
              <Select
                label="Category"
                name="category_id"
                placeholder="Select category (optional)"
                options={[{ value: '', label: 'Uncategorized' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
              />
            </div>
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
            Create Skill
          </Button>
        </div>
      </form>
    </div>
  )
}