'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ZodTypeAny } from 'zod'
import { AlertCircle, CheckCircle2, Copy, Mail, RotateCcw, Save, Send, ShieldCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { contactMessageSchema, type ContactMessageFormData } from '@/lib/validations'
import {
  BUDGET_RANGES,
  CONTACT_TOPICS,
  TIMELINES,
  labelForBudget,
  labelForTimeline,
  labelForTopic,
  type ContactBudget,
  type ContactTimeline,
  type ContactTopic,
} from '@/lib/contact'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

const DRAFT_KEY = 'portfolio:contact-draft:v1'
const SUBJECT_MAX = 160
const MESSAGE_MAX = 4000
const MESSAGE_MIN = 30
const REQUEST_TIMEOUT_MS = 20_000
const RESUBMIT_COOLDOWN_MS = 15_000
const DRAFT_DEBOUNCE_MS = 700

type Values = {
  name: string
  email: string
  company: string
  subject: string
  message: string
  topic: ContactTopic | ''
  budget: ContactBudget | ''
  timeline: ContactTimeline | ''
  consent: boolean
}

type FieldName = keyof Values
type Errors = Partial<Record<FieldName, string>>

const EMPTY_VALUES: Values = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
  topic: '',
  budget: '',
  timeline: '',
  consent: false,
}

const FOCUSABLE: Record<FieldName, string> = {
  name: 'contact-name',
  email: 'contact-email',
  company: 'contact-company',
  subject: 'contact-subject',
  message: 'contact-message',
  topic: 'contact-topic-0',
  budget: 'contact-budget-0',
  timeline: 'contact-timeline-0',
  consent: 'contact-consent',
}

const FIELD_ORDER: FieldName[] = [
  'name',
  'email',
  'company',
  'topic',
  'budget',
  'timeline',
  'subject',
  'message',
  'consent',
]

/** Reuses the server contract so client and server can never disagree. */
function validateField(field: FieldName, value: unknown): string | undefined {
  const schema = contactMessageSchema.shape[field] as ZodTypeAny
  const result = schema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

function isDirtyValues(values: Values): boolean {
  return (
    values.name.trim().length > 0 ||
    values.email.trim().length > 0 ||
    values.company.trim().length > 0 ||
    values.subject.trim().length > 0 ||
    values.message.trim().length > 0 ||
    values.topic !== '' ||
    values.budget !== '' ||
    values.timeline !== ''
  )
}

function readDraft(): Partial<Values> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Values>
    const usable =
      parsed &&
      typeof parsed === 'object' &&
      (parsed.name || parsed.email || parsed.subject || parsed.message)
    return usable ? parsed : null
  } catch {
    return null
  }
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  showError,
  columns = 2,
}: {
  legend: string
  name: string
  options: readonly { value: T; label: string; hint?: string }[]
  value: T | ''
  onChange: (value: T) => void
  error?: string
  showError: boolean
  columns?: 1 | 2
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {legend} <span className="text-red-500">*</span>
      </legend>
      <div
        role="radiogroup"
        aria-label={legend}
        aria-invalid={showError && error ? 'true' : 'false'}
        className={cn('grid gap-2', columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}
      >
        {options.map((option, index) => {
          const selected = value === option.value
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-all',
                'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1 dark:focus-within:ring-offset-slate-900',
                selected
                  ? 'border-primary-600 bg-primary-50 text-primary-900 dark:border-primary-500/60 dark:bg-primary-900/30 dark:text-primary-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700/50'
              )}
            >
              <input
                type="radio"
                id={`${name}-${index}`}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected ? 'border-primary-600 bg-primary-600' : 'border-slate-300 dark:border-slate-600'
                )}
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="min-w-0">
                <span className="block font-medium leading-tight">{option.label}</span>
                {option.hint && (
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {option.hint}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
      {showError && error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Counter({ value, max, min }: { value: number; max: number; min?: number }) {
  const remaining = max - value
  const belowMinimum = min !== undefined && value > 0 && value < min
  const tone = remaining <= 100 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'

  return (
    <p className={cn('ml-auto text-xs tabular-nums', belowMinimum ? 'text-amber-600 dark:text-amber-400' : tone)}>
      {belowMinimum ? `${min - value} more to go` : `${remaining.toLocaleString()} left`}
    </p>
  )
}

export function ContactForm({ inboxEmail }: { inboxEmail: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [values, setValues] = useState<Values>(EMPTY_VALUES)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deliveryFailed, setDeliveryFailed] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const [draftRestored, setDraftRestored] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [clock, setClock] = useState(0)

  const startedAtRef = useRef(0)
  const resultRef = useRef<HTMLDivElement | null>(null)

  /** Pre-filled email so a backend outage can never cost the visitor their message. */
  const fallbackMailto = useMemo(() => {
    const details = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.company ? `Company: ${values.company}` : '',
      `Topic: ${labelForTopic(values.topic)}`,
      values.budget ? `Budget: ${labelForBudget(values.budget)}` : '',
      values.timeline ? `Timeline: ${labelForTimeline(values.timeline)}` : '',
      '',
      values.message,
    ]
      .filter(line => line !== '')
      .join('\n')

    return `mailto:${inboxEmail}?subject=${encodeURIComponent(`[Contact form] ${values.subject}`)}&body=${encodeURIComponent(details)}`
  }, [inboxEmail, values])

  const dirty = useMemo(() => isDirtyValues(values), [values])
  const cooldownLeft = cooldownUntil === 0 ? 0 : Math.max(0, Math.ceil((cooldownUntil - clock) / 1000))

  // Restore a draft only after hydration so the first client render matches the server.
  useEffect(() => {
    startedAtRef.current = Date.now()

    const draft = readDraft()
    if (!draft) return

    const timer = window.setTimeout(() => {
      setValues({ ...EMPTY_VALUES, ...draft, consent: false })
      setDraftRestored(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  // Persist drafts, debounced so typing does not thrash storage.
  useEffect(() => {
    if (!dirty || reference) return
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
      } catch {
        // Storage unavailable or full: drafts are a convenience, not a requirement.
      }
    }, DRAFT_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [values, dirty, reference])

  // Countdown tick. Only the interval callback touches state.
  useEffect(() => {
    if (cooldownUntil === 0) return
    const interval = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [cooldownUntil])

  useEffect(() => {
    if (!reference) return
    resultRef.current?.focus()
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [reference])

  const startCooldown = useCallback((ms: number) => {
    const now = Date.now()
    setClock(now)
    setCooldownUntil(now + ms)
  }, [])

  const update = useCallback(
    (field: FieldName, value: Values[FieldName]) => {
      setValues(current => {
        const next = { ...current, [field]: value }
        setErrors(currentErrors => {
          if (!currentErrors[field]) return currentErrors
          const message = validateField(field, value)
          if (message === currentErrors[field]) return currentErrors
          const nextErrors = { ...currentErrors }
          if (message) nextErrors[field] = message
          else delete nextErrors[field]
          return nextErrors
        })
        return next
      })
    },
    []
  )

  const blur = useCallback((field: FieldName, value: unknown) => {
    setTouched(current => ({ ...current, [field]: true }))
    setErrors(currentErrors => {
      const message = validateField(field, value)
      if (!message && !currentErrors[field]) return currentErrors
      const nextErrors = { ...currentErrors }
      if (message) nextErrors[field] = message
      else delete nextErrors[field]
      return nextErrors
    })
  }, [])

  const resetForm = useCallback(() => {
    setValues(EMPTY_VALUES)
    setErrors({})
    setTouched({})
    setAttempted(false)
    setHoneypot('')
    setFormError(null)
    try {
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to clean up when storage is unavailable.
    }
  }, [])

  const sendAnother = useCallback(() => {
    resetForm()
    setReference(null)
    setDraftRestored(false)
    startCooldown(RESUBMIT_COOLDOWN_MS)
    startedAtRef.current = Date.now()
  }, [resetForm, startCooldown])

  const focusFirstError = useCallback((nextErrors: Errors) => {
    const firstInvalid = FIELD_ORDER.find(field => nextErrors[field])
    if (!firstInvalid) return
    const element = document.getElementById(FOCUSABLE[firstInvalid])
    element?.focus({ preventScroll: true })
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setAttempted(true)
    setFormError(null)
    setDeliveryFailed(false)

    const nextErrors: Errors = {}
    for (const field of FIELD_ORDER) {
      const message = validateField(field, values[field])
      if (message) nextErrors[field] = message
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      return
    }

    setErrors({})
    setSubmitting(true)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const payload: ContactMessageFormData & { website: string; startedAt: number } = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      company: values.company.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
      topic: values.topic as ContactTopic,
      budget: (values.budget || undefined) as ContactBudget | undefined,
      timeline: (values.timeline || undefined) as ContactTimeline | undefined,
      consent: true,
      website: honeypot,
      startedAt: startedAtRef.current,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      })

      const body = (await response.json().catch(() => null)) as {
        error?: string
        reference?: string | null
        fieldErrors?: Record<string, string[] | undefined>
      } | null

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get('retry-after') || '0')
          if (retryAfter > 0) startCooldown(retryAfter * 1000)
          else startCooldown(RESUBMIT_COOLDOWN_MS * 4)
          const message = body?.error || 'You have reached the message limit. Please try again shortly.'
          setFormError(message)
          toast.error(message)
          return
        }

        if (response.status === 503) {
          const message =
            body?.error || 'Your message could not be saved. Please try again in a moment.'
          setFormError(message)
          setDeliveryFailed(true)
          toast.error(message)
          return
        }

        const serverErrors: Errors = {}
        for (const [field, messages] of Object.entries(body?.fieldErrors || {})) {
          if (messages?.length && field in FOCUSABLE) {
            serverErrors[field as FieldName] = messages[0]
          }
        }

        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors)
          focusFirstError(serverErrors)
          return
        }

        const message = body?.error || 'Your message could not be sent. Please try again.'
        setFormError(message)
        toast.error(message)
        return
      }

      setReference(body?.reference || 'CONFIRMED')
      startCooldown(RESUBMIT_COOLDOWN_MS)
      try {
        window.localStorage.removeItem(DRAFT_KEY)
      } catch {
        // Draft already removed or storage unavailable.
      }
      toast.success('Message sent — reply within one business day.')
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === 'AbortError'
      const message = aborted
        ? 'The request timed out before delivery was confirmed. Please try again.'
        : 'Network error — your message was not sent. Check your connection and try again.'
      setFormError(message)
      toast.error(message)
    } finally {
      window.clearTimeout(timeout)
      setSubmitting(false)
    }
  }

  const submitLabel = submitting ? 'Sending…' : cooldownLeft > 0 ? `Available in ${cooldownLeft}s` : 'Send message'
  const showError = (field: FieldName) => Boolean((touched[field] || attempted) && errors[field])

  if (reference) {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="animate-in fade-in-0 zoom-in-95 rounded-xl border border-green-200 bg-green-50 p-8 text-center focus:outline-none dark:border-green-900/60 dark:bg-green-950/30"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <CheckCircle2 className="h-8 w-8 text-green-700 dark:text-green-300" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100">Message received</h3>
        <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
          It landed in my inbox as an unread inquiry. You will get a personal reply within one business day — no
          auto-replies, no ticket numbers.
        </p>

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-2.5 dark:border-green-900/60 dark:bg-slate-900">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Reference</span>
          <code className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-100">{reference}</code>
          <button
            type="button"
            onClick={() => {
              if (!navigator.clipboard) {
                toast.error('Clipboard unavailable')
                return
              }
              navigator.clipboard.writeText(reference).then(
                () => toast.success('Reference copied'),
                () => toast.error('Could not copy')
              )
            }}
            className="text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Copy reference code"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={sendAnother} disabled={cooldownLeft > 0}>
            <RotateCcw className="h-4 w-4" />
            {cooldownLeft > 0 ? `Try again in ${cooldownLeft}s` : 'Send another message'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/projects')}>
            Browse my work while you wait
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={submitting} className="space-y-6">
      {draftRestored && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm dark:border-primary-900/60 dark:bg-primary-950/40">
          <p className="flex items-center gap-2 text-primary-800 dark:text-primary-200">
            <Save className="h-4 w-4 shrink-0" aria-hidden="true" />
            We restored your unsent draft from this device.
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm()
              setDraftRestored(false)
            }}
            className="font-medium text-primary-800 underline underline-offset-2 transition-colors hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-400"
          >
            Discard it
          </button>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          <p className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </p>
          {deliveryFailed && (
            <div className="mt-3 flex flex-col gap-2 pl-7 sm:flex-row">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={submitting}
              >
                {submitting ? 'Retrying…' : 'Try the form again'}
              </Button>
              <a
                href={fallbackMailto}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-800 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-800 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-red-950/50"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Email this instead
              </a>
            </div>
          )}
        </div>
      )}

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={event => setHoneypot(event.target.value)}
        />
      </div>

      <fieldset className="space-y-5">
        <legend className="sr-only">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="contact-name"
            label="Name"
            placeholder="Jordan Avery"
            autoComplete="name"
            required
            value={values.name}
            onChange={event => update('name', event.target.value)}
            onBlur={event => blur('name', event.target.value)}
            error={showError('name') ? errors.name : undefined}
          />
          <Input
            id="contact-email"
            type="email"
            label="Email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            value={values.email}
            onChange={event => update('email', event.target.value)}
            onBlur={event => blur('email', event.target.value)}
            error={showError('email') ? errors.email : undefined}
          />
        </div>
        <Input
          id="contact-company"
          label="Company"
          placeholder="Optional — helps me prepare"
          autoComplete="organization"
          value={values.company}
          onChange={event => update('company', event.target.value)}
          onBlur={event => blur('company', event.target.value)}
          error={showError('company') ? errors.company : undefined}
        />
      </fieldset>

      <ChoiceGroup
        legend="What is this about?"
        name="contact-topic"
        options={CONTACT_TOPICS}
        value={values.topic}
        onChange={value => {
          update('topic', value)
          setTouched(current => ({ ...current, topic: true }))
        }}
        error={errors.topic}
        showError={showError('topic')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <ChoiceGroup
          legend="Budget range"
          name="contact-budget"
          options={BUDGET_RANGES}
          value={values.budget}
          onChange={value => update('budget', value)}
          error={errors.budget}
          showError={showError('budget')}
          columns={1}
        />
        <ChoiceGroup
          legend="Timeline"
          name="contact-timeline"
          options={TIMELINES}
          value={values.timeline}
          onChange={value => update('timeline', value)}
          error={errors.timeline}
          showError={showError('timeline')}
          columns={1}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Subject <span className="text-red-500">*</span>
          </label>
          <Counter value={values.subject.length} max={SUBJECT_MAX} />
        </div>
        <Input
          id="contact-subject"
          placeholder="Analytics dashboard MVP for a B2B SaaS"
          required
          value={values.subject}
          onChange={event => update('subject', event.target.value)}
          onBlur={event => blur('subject', event.target.value)}
          error={showError('subject') ? errors.subject : undefined}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Project details <span className="text-red-500">*</span>
          </label>
          <Counter value={values.message.length} max={MESSAGE_MAX} min={MESSAGE_MIN} />
        </div>
        <Textarea
          id="contact-message"
          rows={7}
          placeholder="What are you building, who is it for, what does success look like, and is there a deadline I should know about? Links to references are welcome."
          required
          value={values.message}
          onChange={event => update('message', event.target.value)}
          onBlur={event => blur('message', event.target.value)}
          error={showError('message') ? errors.message : undefined}
          helperText="Rough details are fine — links, bullet points, or a transcript all work."
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
          <input
            id="contact-consent"
            type="checkbox"
            checked={values.consent}
            onChange={event => {
              update('consent', event.target.checked)
              setTouched(current => ({ ...current, consent: true }))
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
            aria-invalid={showError('consent') ? 'true' : 'false'}
          />
          <span>
            I agree that this information may be used to reply to my inquiry. It is never sold or shared with third
            parties.
          </span>
        </label>
        {showError('consent') && errors.consent && (
          <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Protected by spam filtering and rate limiting. Drafts stay on your device until you send.
        </p>
        <Button type="submit" size="lg" loading={submitting} disabled={submitting || cooldownLeft > 0} className="sm:w-auto">
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}