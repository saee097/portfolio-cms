import { Metadata } from 'next'
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for project inquiries, collaborations, or just to say hello.',
}

export default function ContactPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to send message')
      
      toast.success('Message sent successfully!')
      e.currentTarget.reset()
    } catch {
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Get In <span className="text-primary-700 dark:text-primary-300">Touch</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Have a project in mind? I'd love to hear about it. Send me a message and let's discuss.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Let's Start a Conversation</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                      <Mail className="h-6 w-6 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email</h3>
                      <a href="mailto:hello@example.com" className="text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                        hello@example.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                      <MapPin className="h-6 w-6 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Location</h3>
                      <p className="text-slate-600 dark:text-slate-400">San Francisco, CA</p>
                      <p className="text-slate-600 dark:text-slate-400">Available for remote work worldwide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                      <Phone className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Availability</h3>
                      <p className="text-slate-600 dark:text-slate-400">Open for freelance & full-time</p>
                      <p className="text-slate-600 dark:text-slate-400">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Connect With Me</h3>
                <div className="flex gap-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                  </a>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      name="name"
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="What's this about?"
                    required
                  />
                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={false}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    By submitting this form, you agree to our Privacy Policy. Your information will not be shared with third parties.
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="card group">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                What's your typical project timeline?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 text-slate-600 dark:text-slate-400">
                <p>Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while a full-stack application could take 2-3 months. I provide detailed timelines during the initial consultation.</p>
              </div>
            </details>
            <details className="card group">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                Do you work with existing codebases?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 text-slate-600 dark:text-slate-400">
                <p>Yes! I frequently work with existing codebases for feature additions, refactoring, performance optimization, and bug fixes. I can adapt to your team's coding standards and workflows.</p>
              </div>
            </details>
            <details className="card group">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                What's your availability for new projects?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 text-slate-600 dark:text-slate-400">
                <p>I'm currently available for new projects starting next month. For urgent requests, please mention it in your message and I'll do my best to accommodate.</p>
              </div>
            </details>
            <details className="card group">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                What's included in your development process?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 text-slate-600 dark:text-slate-400">
                <p>My process includes: discovery & planning, architecture design, iterative development with regular demos, testing (unit, integration, E2E), deployment setup, documentation, and post-launch support.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}