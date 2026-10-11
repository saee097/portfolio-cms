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
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !service) {
  console.error('Missing Supabase env')
  process.exit(1)
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const publicClient = createClient(url, anon, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const tables = [
  'profiles',
  'projects',
  'project_images',
  'skill_categories',
  'skills',
  'experiences',
  'education',
  'services',
  'blog_categories',
  'blog_tags',
  'blog_posts',
  'blog_post_tags',
  'testimonials',
  'contact_messages',
  'media',
  'site_settings',
  'seo_settings',
  'analytics_events',
]

console.log('=== Table probe (service role) ===')
let missing = 0
for (const table of tables) {
  const { error, count } = await admin.from(table).select('*', { count: 'exact', head: true })
  if (error) {
    missing++
    console.log(`FAIL  ${table.padEnd(20)} ${error.code || ''} ${error.message}`)
  } else {
    console.log(`OK    ${table.padEnd(20)} rows=${count ?? 0}`)
  }
}

console.log('\n=== contact_messages columns ===')
const { data: sampleMsg, error: msgErr } = await admin
  .from('contact_messages')
  .select('id, company, topic, budget, timeline')
  .limit(1)
if (msgErr) {
  console.log('FAIL', msgErr.message)
} else {
  console.log('OK columns present (company/topic/budget/timeline)')
  console.log('sample_row=', sampleMsg?.[0] ?? '(empty table)')
}

console.log('\n=== Round-trip write test (site_settings) ===')
const probeKey = `__probe_${Date.now()}`
const { error: upsertErr } = await admin.from('site_settings').upsert(
  { key: probeKey, value: { ok: true }, description: 'temporary probe' },
  { onConflict: 'key' }
)
if (upsertErr) {
  console.log('WRITE FAIL', upsertErr.message)
} else {
  const { data: readBack, error: readErr } = await publicClient
    .from('site_settings')
    .select('key, value')
    .eq('key', probeKey)
    .maybeSingle()
  if (readErr || !readBack) {
    console.log('READ FAIL', readErr?.message || 'no row')
  } else {
    console.log('WRITE+PUBLIC READ OK', readBack.key)
  }
  await admin.from('site_settings').delete().eq('key', probeKey)
  console.log('cleanup OK')
}

console.log('\n=== Public content snapshot ===')
for (const table of ['projects', 'experiences', 'skills', 'services', 'testimonials', 'blog_posts']) {
  const { data, error } = await publicClient.from(table).select('*').limit(3)
  if (error) console.log(`${table}: ERROR ${error.message}`)
  else console.log(`${table}: ${data?.length ?? 0} visible rows (sample limit 3)`)
}

console.log(`\nmissing_tables=${missing}`)
process.exit(missing > 0 ? 1 : 0)
