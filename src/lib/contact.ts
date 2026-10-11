export const CONTACT_TOPICS = [
  { value: 'new-project', label: 'New project', hint: 'A build from scratch' },
  { value: 'existing-codebase', label: 'Existing codebase', hint: 'Feature work or fixes' },
  { value: 'audit-review', label: 'Audit / code review', hint: 'Performance or quality pass' },
  { value: 'consulting', label: 'Consulting', hint: 'Architecture or strategy advice' },
  { value: 'freelance', label: 'Freelance retainer', hint: 'Ongoing, part-time capacity' },
  { value: 'fulltime', label: 'Full-time role', hint: 'A permanent position' },
  { value: 'other', label: 'Something else', hint: 'Not sure yet' },
] as const

export const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5k' },
  { value: '5k-15k', label: '$5k – $15k' },
  { value: '15k-40k', label: '$15k – $40k' },
  { value: '40k-plus', label: '$40k+' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within a month' },
  { value: '1-3-months', label: '1 – 3 months' },
  { value: '3-plus-months', label: '3+ months' },
  { value: 'exploring', label: 'Just exploring' },
] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value']
export type ContactBudget = (typeof BUDGET_RANGES)[number]['value']
export type ContactTimeline = (typeof TIMELINES)[number]['value']

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map(t => t.value) as [ContactTopic, ...ContactTopic[]]
export const CONTACT_BUDGET_VALUES = BUDGET_RANGES.map(b => b.value) as [ContactBudget, ...ContactBudget[]]
export const CONTACT_TIMELINE_VALUES = TIMELINES.map(t => t.value) as [ContactTimeline, ...ContactTimeline[]]

export function labelForTopic(value: string | null | undefined): string {
  return CONTACT_TOPICS.find(t => t.value === value)?.label ?? 'General'
}

export function labelForBudget(value: string | null | undefined): string {
  return BUDGET_RANGES.find(b => b.value === value)?.label ?? 'Not specified'
}

export function labelForTimeline(value: string | null | undefined): string {
  return TIMELINES.find(t => t.value === value)?.label ?? 'Not specified'
}

export interface ContactProcessStep {
  step: string
  title: string
  description: string
}

export const CONTACT_PROCESS: ContactProcessStep[] = [
  {
    step: '01',
    title: 'I read your brief',
    description:
      'Every inquiry lands in my inbox and gets read personally — usually the same day, always within one business day.',
  },
  {
    step: '02',
    title: 'I reply with next steps',
    description:
      'You get a direct answer on fit, availability, and a rough range. No call required before we talk.',
  },
  {
    step: '03',
    title: 'We scope the work',
    description:
      'A short call or async thread to nail down scope, timeline, and budget. You get a written proposal before anything starts.',
  },
]

export interface ContactFaqItem {
  question: string
  answer: string
}

export const CONTACT_FAQS: ContactFaqItem[] = [
  {
    question: 'How fast will I hear back?',
    answer:
      'Within one business day, usually sooner. If your message lands during a weekend or holiday it will come Monday morning. If it has been longer than that, email me directly — something went wrong, not on your end.',
  },
  {
    question: 'Do you work with clients outside your timezone?',
    answer:
      'Yes. Most of my work is async-first across US, EU, and APAC timezones, with scheduled calls in windows that work for everyone. Overlapping hours are never a requirement.',
  },
  {
    question: 'What does a typical engagement cost?',
    answer:
      'Most projects land between $5k and $40k depending on scope. A focused audit or code review starts much lower; a full product build sits at the higher end. I always give a fixed, written range before any commitment — no surprise invoices.',
  },
  {
    question: 'Do you work with existing codebases?',
    answer:
      'Regularly. Audits, feature additions, performance work, and partial rebuilds are a large part of what I do. I will tell you honestly if a rewrite is warranted or if the existing code just needs targeted fixes.',
  },
  {
    question: 'What happens after I send this form?',
    answer:
      'Your message is stored in my dashboard as an unread inquiry, I get an email notification, and I respond personally. You will never get an auto-reply or a ticket number — you will get a human answering your actual question.',
  },
  {
    question: 'Do you sign NDAs and work with client code?',
    answer:
      'Yes, routinely. I am comfortable with NDAs, private repositories, and on-prem or security-reviewed environments. Mention it in your message and I will get the paperwork started in parallel.',
  },
]