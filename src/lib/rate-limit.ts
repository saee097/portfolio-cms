/**
 * Fixed-window rate limiter kept in module scope.
 *
 * Works per instance: it stops bursts and single-source abuse without a round trip.
 * It is not a substitute for a shared store — `assertSubmissionThrottle` layers the
 * authoritative database check on top for multi-instance/serverless deployments.
 */
interface Window {
  count: number
  resetAt: number
}

const windows = new Map<string, Window>()
const SWEEP_INTERVAL_MS = 5 * 60 * 1000
let lastSweep = 0

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  retryAfterSeconds: number
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = windows.get(key)
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, limit, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { allowed: true, remaining: limit - existing.count, limit, retryAfterSeconds: 0 }
}

export function resetRateLimit(key: string): void {
  windows.delete(key)
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
  }
  if (!result.allowed) {
    headers['Retry-After'] = String(result.retryAfterSeconds)
  }
  return headers
}

export const CONTACT_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxPerIp: 5,
  maxPerIpPerDay: 20,
  dbWindowMs: 60 * 60 * 1000,
  dbMaxPerIp: 8,
} as const