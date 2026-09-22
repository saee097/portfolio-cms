import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, LogOut, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Logging Out',
  description: 'Logging out of admin dashboard.',
}

export default async function LogoutPage() {
  const supabase = createServerClientSupabase()
  await supabase.auth.signOut()
  redirect('/admin/login')
}