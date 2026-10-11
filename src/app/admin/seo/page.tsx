import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Globe, Search, FileText, Settings, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'SEO Settings',
  description: 'Manage SEO configuration.',
}

const pageTypes = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'skills', label: 'Skills' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'services', label: 'Services' },
  { value: 'projects', label: 'Projects' },
  { value: 'blog', label: 'Blog' },
  { value: 'contact', label: 'Contact' },
  { value: 'resume', label: 'Resume' },
]

async function getSEOSettings() {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('seo_settings').select('*').single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

async function getSEOPages() {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('seo_pages').select('*').order('path')
  if (error) throw error
  return data || []
}

export default async function SEOPage() {
  const settings = await getSEOSettings()
  const pages = await getSEOPages()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">SEO Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure global SEO and per-page metadata.</p>
        </div>
      </div>

      {/* Global Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Global SEO Settings
        </h2>
        <form action="/api/admin/seo/global" method="POST" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="site_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Site Name <span className="text-red-500">*</span>
              </label>
              <Input id="site_name" name="site_name" placeholder="CodeSpare" required defaultValue={settings?.site_name || ''} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="default_title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Title <span className="text-red-500">*</span>
              </label>
              <Input id="default_title" name="default_title" placeholder="Full Stack Developer" required defaultValue={settings?.default_title || ''} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="default_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Description <span className="text-red-500">*</span>
              </label>
              <Textarea id="default_description" name="default_description" placeholder="Default meta description for pages" rows={3} required defaultValue={settings?.default_description || ''} />
            </div>

            <div>
              <label htmlFor="default_og_image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default OG Image URL
              </label>
              <Input id="default_og_image" name="default_og_image" placeholder="https://example.com/og-image.jpg" type="url" defaultValue={settings?.default_og_image || ''} />
            </div>

            <div>
              <label htmlFor="twitter_handle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Twitter Handle
              </label>
              <Input id="twitter_handle" name="twitter_handle" placeholder="@username" defaultValue={settings?.twitter_handle || ''} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="google_analytics_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Google Analytics ID
              </label>
              <Input id="google_analytics_id" name="google_analytics_id" placeholder="G-XXXXXXXXXX" defaultValue={settings?.google_analytics_id || ''} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="google_site_verification" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Google Site Verification
              </label>
              <Input id="google_site_verification" name="google_site_verification" placeholder="verification-code" defaultValue={settings?.google_site_verification || ''} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="structured_data" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Custom Structured Data (JSON-LD)
              </label>
              <Textarea id="structured_data" name="structured_data" placeholder='{ "@context": "https://schema.org", "@type": "Person", ... }' rows={6} defaultValue={settings?.structured_data || ''} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Global Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Page-specific SEO */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Page SEO Overrides
          </h2>
          <Button variant="outline" onClick={() => document.getElementById('add-page-modal')?.classList.remove('hidden')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Page Override
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Path</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Title</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Description</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">OG Image</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">No Index</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">No page overrides configured</td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">
                      <code className="text-sm text-slate-600 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{page.path}</code>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{page.title || '—'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{page.description || '—'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{page.og_image || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={page.noindex ? 'text-green-600' : 'text-slate-400'}>
                        {page.noindex ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/seo/pages/${page.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <form action="/api/admin/seo/pages" method="POST" onSubmit={(e) => { if (!confirm('Delete this page override?')) e.preventDefault() }}>
                          <input type="hidden" name="_method" value="DELETE" />
                          <input type="hidden" name="id" value={page.id} />
                          <button type="submit" className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-100 mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Quick Links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/api/sitemap" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <FileText className="h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-slate-600 dark:text-slate-100 mb-1">Sitemap.xml</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">View generated sitemap</p>
          </Link>
          <Link href="/api/robots" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Settings className="h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-slate-600 dark:text-slate-100 mb-1">Robots.txt</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">View robots.txt</p>
          </Link>
          <Link href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Search className="h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-slate-600 dark:text-slate-100 mb-1">Google Search Console</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Submit sitemap & monitor</p>
          </Link>
          <Link href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Globe className="h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-medium text-slate-600 dark:text-slate-100 mb-1">Rich Results Test</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Test structured data</p>
          </Link>
        </div>
      </Card>

      {/* Add Page Modal */}
      <div id="add-page-modal" className="fixed inset-0 z-50 hidden overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-100">Add Page Override</h3>
              <button onClick={() => document.getElementById('add-page-modal')?.classList.add('hidden')} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form action="/api/admin/seo/pages" method="POST" className="p-4 space-y-4">
              <div>
                <label htmlFor="page_path" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Path <span className="text-red-500">*</span>
                </label>
                <select id="page_path" name="path" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select a page</option>
                  {pageTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="page_title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <Input id="page_title" name="title" placeholder="Custom title" />
              </div>
              <div>
                <label htmlFor="page_description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <Textarea id="page_description" name="description" placeholder="Custom description" rows={2} />
              </div>
              <div>
                <label htmlFor="page_og_image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  OG Image URL
                </label>
                <Input id="page_og_image" name="og_image" placeholder="https://example.com/og.jpg" type="url" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="page_noindex" name="noindex" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="page_noindex" className="text-sm text-slate-700 dark:text-slate-300">No Index</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => document.getElementById('add-page-modal')?.classList.add('hidden')} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                <Button type="submit">Add Page</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}