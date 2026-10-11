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
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const ref = new URL(url).hostname.split('.')[0]
const tables = ['profiles', 'projects', 'contact_messages', 'site_settings']

console.log('project_ref=' + ref)
console.log('sql_editor=https://supabase.com/dashboard/project/' + ref + '/sql/new')

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  })
  const body = await res.text()
  let code = ''
  try {
    code = JSON.parse(body)?.code || ''
  } catch {
    /* ignore */
  }
  console.log(`${table}=${res.status}${code ? ' ' + code : res.ok ? ' OK' : ''}`)
}
