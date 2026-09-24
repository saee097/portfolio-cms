import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminLoginForm } from './AdminLoginForm'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard.',
}

export default async function AdminLoginPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return <AdminLoginForm configurationError />
  }

  const supabase = createServerClientSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile && ['super_admin', 'admin', 'editor'].includes(profile.role)) {
      redirect('/admin')
    }
  }

  return <AdminLoginForm />
}
