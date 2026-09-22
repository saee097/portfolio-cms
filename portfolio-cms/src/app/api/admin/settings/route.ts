import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/supabase/admin'
import { siteSettingSchema } from '@/lib/validations'

const SETTINGS_KEYS = [
  'site_name', 'site_description', 'site_url', 'author_name', 'author_title', 
  'author_email', 'author_location', 'github_url', 'linkedin_url', 'twitter_url',
  'youtube_url', 'devto_url', 'primary_color', 'dark_mode', 'font_family',
  'border_radius', 'ga_id', 'ga_enabled', 'plausible_domain', 'plausible_enabled',
  'contact_email', 'recaptcha_site_key', 'recaptcha_secret_key', 'recaptcha_enabled',
  'spam_protection', 'session_timeout', 'max_login_attempts', 'lockout_duration',
  'two_factor_enabled'
]

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', SETTINGS_KEYS)

    if (error) throw error

    const settings = (data || []).reduce((acc, s) => {
      acc[s.key] = s.value
      return acc
    }, {} as Record<string, unknown>)

    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/admin/settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const updates = []
    for (const key of SETTINGS_KEYS) {
      if (key in body) {
        const validation = siteSettingSchema.shape.value.safeParse(body[key])
        if (validation.success) {
          updates.push({
            key,
            value: validation.data,
            updated_at: new Date().toISOString(),
          })
        }
      }
    }

    if (updates.length > 0) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(updates)

      if (error) throw error
    }

    return NextResponse.json({ success: true, updated: updates.length })
  } catch (error) {
    console.error('POST /api/admin/settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}