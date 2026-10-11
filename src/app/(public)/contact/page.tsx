import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { CopyButton } from '@/components/public/CopyButton'
import { FAQAccordion } from '@/components/public/FAQAccordion'
import { CONTACT_PROCESS } from '@/lib/contact'
import { getContactPageSettings, socialIcon } from '@/services/settings.service'
import { getServices } from '@/services/service.service'

const PAGE_TITLE = 'Contact'
const PAGE_DESCRIPTION =
  'Start a project with me. Send a brief, get a personal reply within one business day — scoping, availability, and a clear range before anything starts.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `${PAGE_TITLE} | Let's build something that ships`,
    description: PAGE_DESCRIPTION,
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getContactPageSettings(), getServices(true)])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact',
    url: `${siteUrl}/contact`,
    description: PAGE_DESCRIPTION,
    mainEntity: {
      '@type': 'Person',
      email: settings.contactEmail,
      ...(settings.location ? { address: settings.location } : {}),
    },
  }

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main relative z-10 pt-12 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm dark:border-primary-900 dark:bg-slate-900 dark:text-primary-300">
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    settings.isAvailable ? 'animate-ping bg-primary-400' : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    settings.isAvailable ? 'bg-primary-500' : 'bg-slate-500'
                  }`}
                />
              </span>
              {settings.availability}
            </div>

            <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-600 sm:text-3xl lg:text-4xl dark:text-slate-100">
              Let&apos;s build something that{' '}
              <span className="text-primary-700 dark:text-primary-300">actually ships</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-400">
              Tell me what you&apos;re working on. I read every message myself and reply {settings.responseSla} — usually
              with fit, availability, and a rough range.
            </p>

            <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Clock, label: 'Response time', value: settings.responseSla },
                { icon: CalendarClock, label: 'Working hours', value: settings.timezone },
                { icon: MessageSquare, label: 'Format', value: 'Async first, calls on request' },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-left backdrop-blur dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</dt>
                    <dd className="truncate text-sm font-medium text-slate-600 dark:text-slate-100">{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />
        </div>
      </section>

      {/* Form + channels */}
      <section className="py-14 bg-white dark:bg-slate-950">
        <div className="container-main">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Channels */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-100">Direct channels</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Prefer email? Skip the form entirely — it reaches the same inbox.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        Email
                      </p>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="mt-1.5 block truncate text-base font-medium text-primary-700 hover:underline dark:text-primary-300"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                    <CopyButton value={settings.contactEmail} label="Email address" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    Replies {settings.responseSla}. Include a deadline or budget range and you&apos;ll get a sharper
                    answer.
                  </p>
                </div>

                <dl className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-slate-100">Based in</dt>
                      <dd className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.location || 'Remote-first, working globally'}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-slate-100">Overlap hours</dt>
                      <dd className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.timezone} · async-first across US, EU and APAC
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-slate-100">No auto-replies</dt>
                      <dd className="text-sm text-slate-600 dark:text-slate-400">
                        A real person reads your message and answers the question you actually asked.
                      </dd>
                    </div>
                  </div>
                </dl>

                {settings.social.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Elsewhere
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {settings.social.map(link => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-700 dark:hover:bg-primary-950/40 dark:hover:text-primary-300"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                              <path d={socialIcon(link.icon)} />
                            </svg>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-100">
                    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    Want the short version first?
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                    The resume has the full history, stack, and delivery record.
                  </p>
                  <Link
                    href="/resume"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline dark:text-primary-300"
                  >
                    View resume
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <Sparkles className="h-5 w-5 text-primary-700 dark:text-primary-300" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-100">Tell me about the project</h2>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Six fields, two minutes. The more context you give, the more useful my first reply is.
                    </p>
                  </div>
                </div>

                <ContactForm inboxEmail={settings.contactEmail} />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}