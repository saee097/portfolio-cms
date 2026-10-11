import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, MessageSquare, Star, Trash2 } from 'lucide-react'
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
  title: 'Edit Testimonial',
  description: 'Edit a client testimonial.',
}

const ratingOptions = [
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '5', label: '5 Stars' },
]

async function getTestimonial(id: string) {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export default async function TestimonialEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testimonial = await getTestimonial(id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Edit Testimonial</h1>
          <p className="text-slate-600 dark:text-slate-400">Update testimonial from: {testimonial.client_name}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action={`/api/admin/testimonials/${id}`} method="POST" className="space-y-6">
          <input type="hidden" name="_method" value="PATCH" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <Input id="client_name" name="client_name" placeholder="John Doe" value={testimonial.client_name} required />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Position
              </label>
              <Input id="position" name="position" placeholder="CEO, Founder, etc." value={testimonial.position || ''} />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company
              </label>
              <Input id="company" name="company" placeholder="Company Name" value={testimonial.company || ''} />
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Avatar URL
              </label>
              <Input id="avatar_url" name="avatar_url" placeholder="https://example.com/avatar.jpg" type="url" value={testimonial.avatar_url || ''} />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Rating <span className="text-red-500">*</span>
              </label>
              <Select
                id="rating"
                name="rating"
                placeholder="Select rating"
                options={ratingOptions}
                value={String(testimonial.rating)}
                required
              />
            </div>

            <div>
              <label htmlFor="published" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Published
              </label>
              <Switch id="published" name="published" checked={testimonial.published} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Testimonial Content <span className="text-red-500">*</span>
              </label>
              <Textarea id="content" name="content" placeholder="Client's testimonial text..." rows={4} required>{testimonial.content}</Textarea>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="order_index" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Order
              </label>
              <Input id="order_index" name="order_index" type="number" min="0" defaultValue={testimonial.order_index} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/admin/testimonials">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Update Testimonial
            </Button>
            <form action={`/api/admin/testimonials/${id}`} method="POST" onSubmit={(e) => { if (!confirm('Delete this testimonial?')) e.preventDefault() }}>
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