import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClientSupabase } from '@/supabase/server'
import { AdminLayout } from './components/AdminLayout'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing portfolio content.',
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClientSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (!profile || !['super_admin', 'admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}