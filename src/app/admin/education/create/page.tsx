import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, GraduationCap, Calendar } from 'lucide-react'
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
  title: 'Create Education',
  description: 'Add a new education entry.',
}

const degreeOptions = [
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'high_school', label: 'High School' },
  { value: 'other', label: 'Other' },
]

export default function EducationCreatePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/education" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Add Education</h1>
          <p className="text-slate-600 dark:text-slate-400">Create a new education entry.</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action="/api/admin/education" method="POST" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="degree" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <Select
                id="degree"
                name="degree"
                placeholder="Select degree"
                options={degreeOptions}
                required
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institution <span className="text-red-500">*</span>
              </label>
              <Input id="institution" name="institution" placeholder="University/Institution" required />
            </div>

            <div>
              <label htmlFor="field_of_study" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Field of Study
              </label>
              <Input id="field_of_study" name="field_of_study" placeholder="Computer Science, etc." />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <Input id="location" name="location" placeholder="City, Country" />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <Input id="end_date" name="end_date" type="date" />
            </div>

            <div>
              <label htmlFor="current" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current
              </label>
              <Switch id="current" name="current" checked={false} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <Textarea id="description" name="description" placeholder="Description, achievements, coursework, etc." rows={4} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="logo_url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Logo URL
              </label>
              <Input id="logo_url" name="logo_url" placeholder="https://example.com/logo.png" type="url" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="order_index" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Order
              </label>
              <Input id="order_index" name="order_index" type="number" min="0" defaultValue="0" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/education">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Education
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}