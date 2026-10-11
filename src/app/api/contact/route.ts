import { NextRequest, NextResponse } from 'next/server'
import { contactMessageSchema } from '@/lib/validations'
import { CONTACT_RATE_LIMIT, checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { notifyNewInquiry } from '@/lib/notifications'
import { ContactSubmissionError, countRecentSubmissions, submitContactMessage } from '@/services/media.service'

const MAX_BODY_BYTES = 16 * 1024
const MIN_FILL_TIME_MS = 1500

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 45)
  }
  return (request.headers.get('x-real-ip') || 'unknown').slice(0, 45)
}

/** Identical acknowledgement for accepted and silently-dropped spam. */
function acknowledged(reference?: string) {
  return NextResponse.json(
    {
      success: true,
      reference: reference ?? null,
      message: 'Message received. I reply to every inquiry within one business day.',
    },
    { status: 201 }
  )
}

export async function POST(request: NextRequest) {
  const ipAddress = getClientIp(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Unsupported content type', code: 'UNSUPPORTED_MEDIA_TYPE' },
        { status: 415 }
      )
    }

    const declaredLength = Number(request.headers.get('content-length') || '0')
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request payload too large', code: 'PAYLOAD_TOO_LARGE' },
        { status: 413 }
      )
    }

    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request payload too large', code: 'PAYLOAD_TOO_LARGE' },
        { status: 413 }
      )
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Malformed request body', code: 'BAD_JSON' }, { status: 400 })
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Malformed request body', code: 'BAD_JSON' }, { status: 400 })
    }

    const payload = body as Record<string, unknown>

    // Honeypot + fill-time trap. Bots get a success response and nothing stored.
    const honeypot = typeof payload.website === 'string' ? payload.website.trim() : ''
    const startedAt = typeof payload.startedAt === 'number' ? payload.startedAt : null
    const filledTooFast = startedAt !== null && Date.now() - startedAt < MIN_FILL_TIME_MS

    if (honeypot || filledTooFast) {
      return acknowledged()
    }

    const burst = checkRateLimit(`contact:${ipAddress}`, CONTACT_RATE_LIMIT.maxPerIp, CONTACT_RATE_LIMIT.windowMs)
    if (!burst.allowed) {
      return NextResponse.json(
        {
          error: `Too many messages from this network. Try again in ${burst.retryAfterSeconds} seconds.`,
          code: 'RATE_LIMITED',
        },
        { status: 429, headers: rateLimitHeaders(burst) }
      )
    }

    const recentCount = await countRecentSubmissions(ipAddress, CONTACT_RATE_LIMIT.dbWindowMs)
    if (recentCount >= CONTACT_RATE_LIMIT.dbMaxPerIp) {
      const limited = { allowed: false, remaining: 0, limit: CONTACT_RATE_LIMIT.dbMaxPerIp, retryAfterSeconds: CONTACT_RATE_LIMIT.dbWindowMs / 1000 }
      return NextResponse.json(
        {
          error: 'This network has reached its hourly message limit. Please email me directly instead.',
          code: 'RATE_LIMITED',
        },
        { status: 429, headers: rateLimitHeaders(limited) }
      )
    }

    const validation = contactMessageSchema.safeParse(payload)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Please review the highlighted fields',
          code: 'VALIDATION_FAILED',
          fieldErrors: validation.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    // Explicit allowlist: nothing the visitor sent can reach the database columns directly.
    const { name, email, company, subject, message, topic, budget, timeline } = validation.data

    const saved = await submitContactMessage(
      { name, email, company, subject, message, topic, budget, timeline },
      ipAddress,
      userAgent
    )
    const reference = `REF-${saved.id.slice(0, 8).toUpperCase()}`

    await notifyNewInquiry({
      reference,
      name,
      email,
      subject,
      company,
      topic,
      budget,
      timeline,
      message,
    })

    return acknowledged(reference)
  } catch (error) {
    if (error instanceof ContactSubmissionError) {
      const details = Array.isArray(error.details) ? error.details.join(' // ') : error.details
      console.error('Contact form persistence failed:', error.message, details)
      return NextResponse.json(
        {
          error:
            'The form could not reach my inbox just now. Use the pre-filled email option and nothing will be lost.',
          code: 'DELIVERY_FAILED',
          recoverable: true,
        },
        { status: 503, headers: { 'Retry-After': '30' } }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong sending your message. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}