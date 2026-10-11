import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Code, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Edit Skill',
  description: 'Edit an existing skill.',
}

interface SkillEditPageProps {
  params: Promise<{ id: string }>
}

async function getSkill(id: string) {
  const supabase = createServerClientSupabase()
  
  const { data: skill, error } = await supabase
    .from('skills')
    .select('*, category:skill_categories(*)')
    .eq('id', id)
    .single()

  if (error || !skill) return null
  return skill
}

async function getCategories() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('skill_categories').select('id, name').order('name')
  return data || []
}

export default async function EditSkillPage({ params }: SkillEditPageProps) {
  const { id } = await params
  const [skill, categories] = await Promise.all([getSkill(id), getCategories()])

  if (!skill) notFound()

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
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Edit Skill</h1>
            <p className="text-slate-600 dark:text-slate-400">{skill.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action={`/api/admin/skills/${id}`}>
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Skill Details</h2>
          <div className="space-y-6">
            <Input
              label="Name *"
              name="name"
              defaultValue={skill.name}
              required
              maxLength={100}
            />
            <Input
              label="Icon (emoji or class)"
              name="icon"
              defaultValue={skill.icon || ''}
              placeholder="⚛️ or fab fa-react"
              maxLength={50}
              helperText="Emoji or Font Awesome class name"
            />
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Proficiency *"
                name="proficiency"
                type="number"
                defaultValue={skill.proficiency}
                min="0"
                max="100"
                required
                helperText="0-100"
              />
              <Select
                label="Category"
                name="category_id"
                defaultValue={skill.category_id || ''}
                placeholder="Select category (optional)"
                options={[{ value: '', label: 'Uncategorized' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
              />
            </div>
            <Input
              label="Order Index"
              name="order_index"
              type="number"
              defaultValue={skill.order_index}
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
            Delete Skill
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