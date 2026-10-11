import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Briefcase, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Edit Experience',
  description: 'Edit an existing work experience entry.',
}

interface ExperienceEditPageProps {
  params: Promise<{ id: string }>
}

async function getExperience(id: string) {
  const supabase = createServerClientSupabase()
  
  const { data: exp, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !exp) return null
  return exp
}

export default async function EditExperiencePage({ params }: ExperienceEditPageProps) {
  const { id } = await params
  const exp = await getExperience(id)

  if (!exp) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/experience">
            <Button variant="ghost" size="icon" aria-label="Back to experience">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Experience</h1>
            <p className="text-slate-600 dark:text-slate-400">{exp.title} at {exp.company}</p>
          </div>
        </div>
        <Badge variant={exp.current ? 'success' : 'secondary'} className="text-sm">
          {exp.current ? 'Current' : 'Past'}
        </Badge>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action={`/api/admin/experience/${id}`}>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Experience Details</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Title *"
                name="title"
                defaultValue={exp.title}
                required
                maxLength={200}
              />
              <Input
                label="Company *"
                name="company"
                defaultValue={exp.company}
                required
                maxLength={200}
              />
            </div>
            <Input
              label="Location"
              name="location"
              defaultValue={exp.location || ''}
              placeholder="City, State / Remote"
              maxLength={200}
            />
            <Textarea
              label="Description"
              name="description"
              defaultValue={exp.description || ''}
              placeholder="Key responsibilities and achievements..."
              rows={4}
              maxLength={2000}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Start Date *"
                name="start_date"
                type="date"
                defaultValue={exp.start_date}
                required
              />
              <Input
                label="End Date"
                name="end_date"
                type="date"
                defaultValue={exp.end_date || ''}
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="current" id="current" defaultChecked={exp.current} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="current" className="font-medium text-slate-900 dark:text-slate-100">Current position</label>
            </div>
            <Input
              label="Technologies (comma separated)"
              name="technologies"
              defaultValue={exp.technologies?.join(', ') || ''}
              placeholder="React, Next.js, TypeScript, PostgreSQL"
              helperText="Will be split by commas"
            />
            <Input
              label="Order Index"
              name="order_index"
              type="number"
              defaultValue={exp.order_index}
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
            Delete Experience
          </button>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/experience">
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