import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/** Minimal .env reader — avoids a dotenv dependency. */
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL')
  console.error('  SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws,
  },
})

const email = process.env.ADMIN_EMAIL || 'admin123@gmail.com'
const password = process.env.ADMIN_PASSWORD || 'admin123'
const fullName = process.env.ADMIN_FULL_NAME || 'Admin'
const role = process.env.ADMIN_ROLE || 'super_admin'

async function ensureProfile(userId) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('profiles')
      .update({ email, full_name: fullName, role, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
    if (error) throw error
    console.log('Profile updated to', role)
    return
  }

  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    email,
    role,
    full_name: fullName,
  })
  if (error) throw error
  console.log('Profile created as', role)
}

async function main() {
  console.log('Creating admin user...')

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  })

  let userId = authData?.user?.id

  if (authError) {
    const already =
      authError.message?.toLowerCase().includes('already') ||
      authError.message?.toLowerCase().includes('registered')
    if (!already) {
      console.error('Error creating user:', authError.message)
      process.exit(1)
    }

    console.log('User already exists — looking up by email…')
    const { data: listed, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (listError) {
      console.error('Could not list users:', listError.message)
      process.exit(1)
    }
    const match = listed.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!match) {
      console.error('User exists but could not be found by email.')
      process.exit(1)
    }
    userId = match.id
  } else {
    console.log('User created:', userId)
  }

  try {
    await ensureProfile(userId)
  } catch (error) {
    console.error('Profile error:', error.message || error)
    process.exit(1)
  }

  console.log('Done! Login at /admin/login')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
}

main()
