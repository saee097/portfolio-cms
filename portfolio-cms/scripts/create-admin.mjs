import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env') })

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

  if (authError) {
    if (authError.message && authError.message.includes('already')) {
      console.log('User already exists')
      console.log('You can now login at /admin/login')
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
      process.exit(0)
    }
    console.error('Error creating user:', authError.message)
    process.exit(1)
  }

  console.log('User created:', authData.user.id)

  try {
    await supabase.rpc('set_profile', {
      p_user_id: authData.user.id,
      p_email: email,
      p_role: role,
      p_full_name: fullName,
    })
    console.log('Profile created via RPC')
  } catch {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          user_id: authData.user.id,
          email,
          role,
          full_name: fullName,
        })
      if (profileError && !profileError.message.includes('duplicate')) {
        console.log('Profile note:', profileError.message)
      } else {
        console.log('Profile created')
      }
    } catch (e) {
      console.log('Profile may auto-create on login:', e.message)
    }
  }

  console.log('Done! Login at http://localhost:3000/admin/login')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
}

main()