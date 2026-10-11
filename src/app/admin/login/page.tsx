import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard.',
}

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value === 'true'

  if (adminSession) {
    redirect('/admin')
  }

  return <AdminLoginForm />
}
