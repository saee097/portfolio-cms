import { labelForBudget, labelForTimeline, labelForTopic } from './contact'

interface InquiryNotification {
  reference: string
  name: string
  email: string
  subject: string
  company?: string | null
  topic?: string | null
  budget?: string | null
  timeline?: string | null
  message: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderText(inquiry: InquiryNotification): string {
  const lines = [
    `New inquiry from ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''}`,
    `Reply to: ${inquiry.email}`,
    `Reference: ${inquiry.reference}`,
    `Topic: ${labelForTopic(inquiry.topic)}`,
    `Budget: ${labelForBudget(inquiry.budget)}`,
    `Timeline: ${labelForTimeline(inquiry.timeline)}`,
    '',
    inquiry.subject,
    '',
    inquiry.message,
  ]
  return lines.join('\n')
}

function renderHtml(inquiry: InquiryNotification): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${escapeHtml(value)}</td></tr>`

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:#0f766e;padding:20px 24px">
      <h1 style="margin:0;color:#ffffff;font-size:16px">New contact inquiry</h1>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${row('Name', inquiry.name)}${row('Email', inquiry.email)}${row('Company', inquiry.company || '—')}${row('Topic', labelForTopic(inquiry.topic))}${row('Budget', labelForBudget(inquiry.budget))}${row('Timeline', labelForTimeline(inquiry.timeline))}${row('Reference', inquiry.reference)}</table>
      <h2 style="margin:0 0 8px;font-size:15px;color:#0f172a">${escapeHtml(inquiry.subject)}</h2>
      <div style="white-space:pre-wrap;color:#334155;font-size:14px;line-height:1.6">${escapeHtml(inquiry.message)}</div>
    </div>
  </div>
</body></html>`
}

/**
 * Best-effort inbox notification for a new inquiry.
 *
 * Delivery failures must never break the visitor's submission: the message is
 * already stored and readable in the admin dashboard, so errors are logged only.
 */
export async function notifyNewInquiry(inquiry: InquiryNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const to = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_FROM
  if (!to) return

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: inquiry.email,
        subject: `[${inquiry.reference}] ${inquiry.subject}`,
        text: renderText(inquiry),
        html: renderHtml(inquiry),
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.warn('Contact notification not delivered:', response.status, body.slice(0, 200))
    }
  } catch (error) {
    console.warn('Contact notification failed:', error)
  }
}