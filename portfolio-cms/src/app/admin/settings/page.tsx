import { Metadata } from 'next'
import { Save, Shield, Bell, Palette, Globe, Key, Database, Mail, Link2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Admin dashboard settings.',
}

interface ConfigField {
  name: string
  label: string
  type: string
  placeholder?: string
  rows?: number
  options?: { value: string; label: string }[]
  min?: string
  max?: string
}

interface SettingsSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  fields: ConfigField[]
}

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'General',
    icon: Globe,
    fields: [
      { name: 'site_name', label: 'Site Name', type: 'text', placeholder: 'My Portfolio' },
      { name: 'site_description', label: 'Site Description', type: 'textarea', placeholder: 'Full-stack developer portfolio...', rows: 3 },
      { name: 'site_url', label: 'Site URL', type: 'url', placeholder: 'https://your-domain.com' },
      { name: 'author_name', label: 'Author Name', type: 'text', placeholder: 'John Developer' },
      { name: 'author_title', label: 'Author Title', type: 'text', placeholder: 'Senior Full Stack Developer' },
      { name: 'author_email', label: 'Contact Email', type: 'email', placeholder: 'hello@example.com' },
      { name: 'author_location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
    ],
  },
  {
    id: 'social',
    title: 'Social Links',
    icon: Link2,
    fields: [
      { name: 'github_url', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/username' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username' },
      { name: 'twitter_url', label: 'Twitter/X URL', type: 'url', placeholder: 'https://twitter.com/username' },
      { name: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/@username' },
      { name: 'devto_url', label: 'Dev.to URL', type: 'url', placeholder: 'https://dev.to/username' },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Palette,
    fields: [
      { name: 'primary_color', label: 'Primary Color', type: 'text', placeholder: '#0f766e' },
      { name: 'dark_mode', label: 'Default Dark Mode', type: 'select', options: [{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] },
      { name: 'font_family', label: 'Font Family', type: 'select', options: [{ value: 'inter', label: 'Inter' }, { value: 'manrope', label: 'Manrope' }, { value: 'system', label: 'System' }] },
      { name: 'border_radius', label: 'Border Radius', type: 'select', options: [{ value: 'rounded', label: 'Rounded' }, { value: 'rounded-lg', label: 'Large' }, { value: 'rounded-xl', label: 'Extra Large' }] },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: Database,
    fields: [
      { name: 'ga_id', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
      { name: 'ga_enabled', label: 'Enable Google Analytics', type: 'checkbox' },
      { name: 'plausible_domain', label: 'Plausible Domain', type: 'text', placeholder: 'your-domain.com' },
      { name: 'plausible_enabled', label: 'Enable Plausible', type: 'checkbox' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Form',
    icon: Mail,
    fields: [
      { name: 'contact_email', label: 'Notification Email', type: 'email', placeholder: 'your-email@example.com' },
      { name: 'recaptcha_site_key', label: 'reCAPTCHA Site Key', type: 'text', placeholder: '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' },
      { name: 'recaptcha_secret_key', label: 'reCAPTCHA Secret Key', type: 'password', placeholder: '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' },
      { name: 'recaptcha_enabled', label: 'Enable reCAPTCHA', type: 'checkbox' },
      { name: 'spam_protection', label: 'Spam Protection', type: 'select', options: [{ value: 'none', label: 'None' }, { value: 'honeypot', label: 'Honeypot' }, { value: 'recaptcha', label: 'reCAPTCHA' }] },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    fields: [
      { name: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', placeholder: '60', min: '15', max: '1440' },
      { name: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', placeholder: '5', min: '3', max: '20' },
      { name: 'lockout_duration', label: 'Lockout Duration (minutes)', type: 'number', placeholder: '15', min: '5', max: '60' },
      { name: 'two_factor_enabled', label: 'Enable 2FA', type: 'checkbox' },
    ],
  },
]

async function getSettings() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('site_settings').select('key, value')
  return (data || []).reduce((acc, s) => { acc[s.key] = s.value; return acc }, {} as Record<string, unknown>)
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Configure your portfolio settings.</p>
      </div>

      <form className="space-y-8" method="POST" action="/api/admin/settings">
        {settingsSections.map(section => (
          <Card key={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <section.icon className="h-5 w-5 text-primary-700 dark:text-primary-300" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
            </div>
            <div className="space-y-6">
              {section.fields.map(field => {
                const value = settings[field.name] as string || ''
                
                if (field.type === 'textarea') {
                  return (
                    <Textarea
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      defaultValue={value}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                    />
                  )
                }
                
                if (field.type === 'select') {
                  return (
                    <Select
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      defaultValue={value}
                      placeholder="Select..."
                      options={field.options || []}
                    />
                  )
                }
                
                if (field.type === 'checkbox') {
                  return (
                    <div key={field.name} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name={field.name}
                        id={field.name}
                        defaultChecked={value === 'true'}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={field.name} className="font-medium text-slate-900 dark:text-slate-100">
                        {field.label}
                      </label>
                    </div>
                  )
                }
                
                return (
                  <Input
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    defaultValue={value}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                  />
                )
              })}
            </div>
          </Card>
        ))}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}