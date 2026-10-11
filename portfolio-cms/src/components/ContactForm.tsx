'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { contactMessageSchema } from '@/lib/validations'
import type { ContactMessageFormData } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageFormData>({
    resolver: zodResolver(contactMessageSchema),
  })

  const onSubmit = async (data: ContactMessageFormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Your name"
            autoComplete="name"
            error={errors.name?.message as string | undefined}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your@email.com"
            autoComplete="email"
            error={errors.email?.message as string | undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Subject
        </label>
        <Input
          id="subject"
          {...register('subject')}
          placeholder="What's this about?"
          error={errors.subject?.message as string | undefined}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Message
        </label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell me about your project..."
          rows={6}
          error={errors.message?.message as string | undefined}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        By submitting this form, you agree to our Privacy Policy. Your information will not be shared with
        third parties.
      </p>
    </form>
  )
}