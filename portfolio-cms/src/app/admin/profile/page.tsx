import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, User, Mail, Lock, Shield, Trash2, Camera, Image as ImageIcon, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { createServerClientSupabase } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile and account settings.',
}

const socialOptions = [
  { key: 'github', label: 'GitHub', icon: 'Github', placeholder: 'username' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', placeholder: 'username' },
  { key: 'twitter', label: 'Twitter/X', icon: 'Twitter', placeholder: '@username' },
  { key: 'email', label: 'Email', icon: 'Mail', placeholder: 'email@example.com' },
  { key: 'website', label: 'Website', icon: 'Globe', placeholder: 'https://example.com' },
  { key: 'youtube', label: 'YouTube', icon: 'Youtube', placeholder: 'channel' },
  { key: 'devto', label: 'Dev.to', icon: 'Code', placeholder: 'username' },
  { key: 'medium', label: 'Medium', icon: 'BookOpen', placeholder: '@username' },
  { key: 'stackoverflow', label: 'Stack Overflow', icon: 'Terminal', placeholder: 'user-id' },
  { key: 'discord', label: 'Discord', icon: 'MessageSquare', placeholder: 'username#1234' },
]

async function getProfile() {
  const supabase = createServerClientSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error && error.code !== 'PGRST116') throw error
  
  return { user, profile: data }
}

export default async function ProfilePage() {
  const data = await getProfile()
  if (!data) redirect('/admin/login')
  
  const { user, profile } = data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and profile information.</p>
        </div>
      </div>

      {/* Avatar Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors" title="Change Avatar">
                <Camera className="h-5 w-5" />
                <input type="file" accept="image/*" className="hidden" id="avatar-upload" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const formData = new FormData()
                    formData.append('avatar', file)
                    await fetch('/api/admin/profile/avatar', { method: 'POST', body: formData })
                    window.location.reload()
                  }
                }} />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{profile?.full_name || user.email}</h2>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Role: <span className="capitalize">{profile?.role || 'user'}</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
              <Camera className="h-4 w-4 mr-2" />
              Change Avatar
            </Button>
            {profile?.avatar_url && (
              <Button variant="outline" onClick={async () => {
                if (confirm('Remove avatar?')) {
                  await fetch('/api/admin/profile/avatar', { method: 'DELETE' })
                  window.location.reload()
                }
              }}>
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </h2>
        <form action="/api/admin/profile" method="POST" className="space-y-6">
          <input type="hidden" name="section" value="personal" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <Input id="full_name" name="full_name" placeholder="Your Name" value={profile?.full_name || ''} />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Professional Title
              </label>
              <Input id="title" name="title" placeholder="Full Stack Developer" value={profile?.title || ''} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bio
              </label>
              <Textarea id="bio" name="bio" placeholder="Tell us about yourself..." rows={4}>{profile?.bio || ''}</Textarea>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <Input id="location" name="location" placeholder="City, Country" value={profile?.location || ''} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" value={profile?.phone || ''} type="tel" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Personal Info
            </Button>
          </div>
        </form>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Social Links
        </h2>
        <form action="/api/admin/profile" method="POST" className="space-y-6">
          <input type="hidden" name="section" value="social" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialOptions.map((social) => (
              <div key={social.key}>
                <label htmlFor={`social_${social.key}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {social.label}
                </label>
                <Input
                  id={`social_${social.key}`}
                  name={`social_${social.key}`}
                  placeholder={social.placeholder}
                  value={profile?.social_links?.[social.key] || ''}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Social Links
            </Button>
          </div>
        </form>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Email</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <Link href="/api/auth/change-email">
              <Button variant="outline" size="sm">Change Email</Button>
            </Link>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Password</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last changed: {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
            <Link href="/api/auth/change-password">
              <Button variant="outline" size="sm">Change Password</Button>
            </Link>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm" disabled>Enable 2FA</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-6 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">Delete Account</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Permanently delete your account and all data. This action cannot be undone.</p>
            </div>
            <form action="/api/admin/profile" method="POST" onSubmit={(e) => { if (!confirm('Are you absolutely sure? This will permanently delete your account and all data!')) e.preventDefault() }}>
              <input type="hidden" name="section" value="delete" />
              <Button type="submit" variant="destructive">Delete Account</Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}