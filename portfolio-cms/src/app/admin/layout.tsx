import { Metadata } from 'next'
import { AdminLayout } from './components/AdminLayout'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing portfolio content.',
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
