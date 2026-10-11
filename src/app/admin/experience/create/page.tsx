import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Briefcase, Plus, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export const metadata: Metadata = {
  title: 'Create Experience',
  description: 'Add a new work experience entry.',
}

export default function CreateExperiencePage() {
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
            <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Create Experience</h1>
            <p className="text-slate-600 dark:text-slate-400">Add a new work experience entry.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" method="POST" action="/api/admin/experience">
        <Card>
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-6">Experience Details</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Title *"
                name="title"
                placeholder="e.g., Senior Full Stack Developer"
                required
                maxLength={200}
              />
              <Input
                label="Company *"
                name="company"
                placeholder="Company name"
                required
                maxLength={200}
              />
            </div>
            <Input
              label="Location"
              name="location"
              placeholder="City, State / Remote"
              maxLength={200}
            />
            <Textarea
              label="Description"
              name="description"
              placeholder="Key responsibilities and achievements..."
              rows={4}
              maxLength={2000}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Start Date *"
                name="start_date"
                type="date"
                required
              />
              <Input
                label="End Date"
                name="end_date"
                type="date"
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="current" id="current" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="current" className="font-medium text-slate-600 dark:text-slate-100">Current position</label>
            </div>
            <Input
              label="Technologies (comma separated)"
              name="technologies"
              placeholder="React, Next.js, TypeScript, PostgreSQL"
              helperText="Will be split by commas"
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
          <Link href="/admin/experience">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create Experience
          </Button>
        </div>
      </form>
    </div>
  )
}