import type { Metadata } from 'next'
import { AdminLayout } from './components/AdminLayout'
import { getDatabaseStatus } from '@/services/database-health.service'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing portfolio content.',
}

// The dashboard reads cookies for the session and probes the database on every request,
// so it must never be prerendered or cached.
export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Every dashboard page queries these tables. Checking once here turns "database not
  // initialised" from a raw crash on each page into one actionable setup screen.
  const database = await getDatabaseStatus()

  return (
    <AdminLayout databaseReady={database.ready} sqlEditorUrl={database.sqlEditorUrl}>
      {children}
    </AdminLayout>
  )
}