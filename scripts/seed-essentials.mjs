/**
 * Seeds the minimum site_settings + one published project so public pages
 * read from the database instead of in-code FALLBACK samples.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  const path = resolve(process.cwd(), '.env')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const value = match[2].replace(/^["']|["']$/g, '')
    if (process.env[match[1]] === undefined) process.env[match[1]] = value
  }
}

loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
const contactEmail = process.env.CONTACT_EMAIL || 'hello@example.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const supabase = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const settings = [
  { key: 'site_name', value: siteName, description: 'Site name' },
  { key: 'site_url', value: siteUrl, description: 'Canonical site URL' },
  { key: 'author_name', value: 'Portfolio Owner', description: 'Author display name' },
  { key: 'author_title', value: 'Full Stack Developer', description: 'Author title' },
  { key: 'author_email', value: contactEmail, description: 'Public contact email' },
  { key: 'contact_email', value: contactEmail, description: 'Inbox / notification email' },
  { key: 'author_location', value: 'Remote', description: 'Location' },
  { key: 'author_timezone', value: 'UTC±0', description: 'Timezone label' },
  { key: 'response_sla', value: 'within 1 business day', description: 'Response SLA' },
  { key: 'availability_status', value: 'Taking on new work', description: 'Availability label' },
  { key: 'available_for_work', value: true, description: 'Available for work flag' },
]

async function main() {
  console.log('Seeding site_settings…')
  for (const row of settings) {
    const { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'key' })
    if (error) {
      console.error(`  FAIL ${row.key}: ${error.message}`)
      process.exit(1)
    }
    console.log(`  OK ${row.key}`)
  }

  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', 'db-connected-portfolio')
    .maybeSingle()

  if (!existingProject) {
    console.log('Seeding sample published project…')
    const { error } = await supabase.from('projects').insert({
      title: 'DB-Connected Portfolio',
      slug: 'db-connected-portfolio',
      short_description: 'This project row was inserted into Supabase — proof the live site reads from the database.',
      detailed_description:
        'If you can see this project on the public /projects page, the backend and database are wired correctly.',
      technologies: ['Next.js', 'Supabase', 'TypeScript'],
      category: 'Web Application',
      featured: true,
      published: true,
      order_index: 0,
    })
    if (error) {
      console.error('Project seed failed:', error.message)
      process.exit(1)
    }
    console.log('  OK projects/db-connected-portfolio')
  } else {
    console.log('Sample project already present')
  }

  const { count } = await supabase
    .from('site_settings')
    .select('*', { count: 'exact', head: true })
  console.log(`Done. site_settings rows=${count ?? 0}`)
}

main()
