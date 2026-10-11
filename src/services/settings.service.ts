import { createServerClientSupabase } from '@/supabase/server'

export interface ContactPageSettings {
  contactEmail: string
  contactPhone: string | null
  location: string | null
  timezone: string
  responseSla: string
  availability: string
  isAvailable: boolean
  social: { label: string; href: string; icon: 'github' | 'linkedin' | 'twitter' | 'website' }[]
}

const DEFAULTS: ContactPageSettings = {
  contactEmail: 'saeedsaeed7745@gmail.com',
  contactPhone: null,
  location: null,
  timezone: 'UTC±0',
  responseSla: 'within 1 business day',
  availability: 'Taking on new work',
  isAvailable: true,
  social: [
    { label: 'GitHub', href: 'https://github.com/saee097', icon: 'github' },
    { label: 'LinkedIn', href: 'www.linkedin.com/in/saeed-ur-rahman-dev', icon: 'linkedin' },
    { label: 'X', href: 'https://twitter.com', icon: 'twitter' },
  ],
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true'
  return fallback
}

/**
 * Public contact details come from `site_settings` so the page is editable from
 * the admin dashboard. Any missing or unreachable value falls back to a default
 * rather than breaking the page.
 */
export async function getContactPageSettings(): Promise<ContactPageSettings> {
  try {
    const supabase = createServerClientSupabase()
    const { data } = await supabase.from('site_settings').select('key, value')
    if (!data || data.length === 0) return DEFAULTS

    const settings = data.reduce<Record<string, unknown>>((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    const social = (['github_url', 'linkedin_url', 'twitter_url', 'site_url'] as const)
      .map(key => {
        const href = readString(settings[key])
        if (!href) return null
        const label =
          key === 'github_url'
            ? 'GitHub'
            : key === 'linkedin_url'
              ? 'LinkedIn'
              : key === 'twitter_url'
                ? 'X'
                : 'Website'
        const icon =
          key === 'github_url'
            ? ('github' as const)
            : key === 'linkedin_url'
              ? ('linkedin' as const)
              : key === 'twitter_url'
                ? ('twitter' as const)
                : ('website' as const)
        return { label, href, icon }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

    return {
      contactEmail:
        readString(settings.contact_email) ??
        readString(settings.author_email) ??
        DEFAULTS.contactEmail,
      contactPhone: readString(settings.contact_phone) ?? readString(settings.author_phone),
      location: readString(settings.author_location),
      timezone: readString(settings.author_timezone) ?? readString(settings.timezone_label) ?? DEFAULTS.timezone,
      responseSla: readString(settings.response_sla) ?? DEFAULTS.responseSla,
      availability: readString(settings.availability_status) ?? DEFAULTS.availability,
      isAvailable: readBoolean(settings.available_for_work, DEFAULTS.isAvailable),
      social: social.length > 0 ? social : DEFAULTS.social,
    }
  } catch {
    return DEFAULTS
  }
}

export function socialIcon(icon: ContactPageSettings['social'][number]['icon']) {
  switch (icon) {
    case 'github':
      return 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.89-.01-1.75-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z'
    case 'linkedin':
      return 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-1.5 14.5h-2.2v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H8.6V9h2.1v1.36h.03a2.3 2.3 0 0 1 2.07-1.14c2.21 0 2.62 1.46 2.62 3.35v4.93ZM5.3 7.4a1.28 1.28 0 1 1 0-2.56 1.28 1.28 0 0 1 0 2.56Zm1.13 10.1H4.4V9h2.03v8.5ZM21 12.4h-1.9v-1.83c0-.42-.02-1.3-1-1.3-.98 0-1.13.77-1.13 1.26v1.87H15V9h2.1v1.19h.03a2.3 2.3 0 0 1 2.07-1.14c2.21 0 2.63 1.46 2.63 3.35V12.4Z'
    case 'twitter':
      return 'M17.53 3h3.1l-6.77 7.74L21.75 21h-6.23l-4.88-6.38L5.08 21H2l7.24-8.28L2.25 3h6.4l4.4 5.82L17.53 3Zm-1.09 16.13h1.72L7.63 4.78H5.79l10.65 14.35Z'
    default:
      return 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.2 0 2.34.26 3.41.74A8 8 0 0 0 6.2 6.2 8.02 8.02 0 0 1 12 4Zm-6.93 3.05a8 8 0 0 0-.9 4.3l2.6-2.6a6 6 0 0 1 .24-2.42l-1.94.72Zm.62 5.68a8 8 0 0 0 1.16 2.2l2.06-2.06a6 6 0 0 1-1.83-1.83l-1.39 1.69Zm2.7 4.02a8 8 0 0 0 2.2 1.16l1.69-1.39a6 6 0 0 1-2.06-1.83l-1.83 2.06ZM14.4 20a8 8 0 0 0 3.04-1.62l-1.94-.72a6 6 0 0 1-2.42.24l1.32 2.1Zm1.9-4.44c.4-.9.6-1.87.6-2.83 0-2.1-1.7-3.8-3.8-3.8a3.8 3.8 0 0 0 0 7.6c2.1 0 3.8-1.7 3.8-3.8 0-.06 0-.12-.01-.18l-.59.01Zm4.27-3.05c.03-.22.04-.44.04-.67 0-.55-.06-1.09-.17-1.6l-1.94.72a6 6 0 0 1 0 3.15l2.07-.4v.8Zm-.9 5.98a8 8 0 0 0 1.62-3.04l-2.1-1.32a6 6 0 0 1-1.83-2.06l-1.39 1.69a6 6 0 0 0 1.83 2.06l2.87 2.67Zm3.33-9.53a8 8 0 0 0-1.16-2.2l-2.06 2.06a6 6 0 0 1 1.83 1.83l1.39-1.69ZM13.6 4a8 8 0 0 0-3.04 1.62l1.94.72a6 6 0 0 1 2.42-.24L13.6 4Zm-2.7 4.02-2.06 2.06A6 6 0 0 1 7.67 7.25l-1.39 1.69A8 8 0 0 0 8.1 10.94l2.8-2.92Z'
  }
}