import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Search, Mail, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Manage contact messages.',
}

async function getMessages(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 10
  const search = searchParams.search as string || ''
  const status = searchParams.status as string || ''

  let query = supabase.from('messages').select('*', { count: 'exact' })

  if (status === 'read') query = query.eq('read', true)
  else if (status === 'unread') query = query.eq('read', false)
  else if (status === 'archived') query = query.eq('archived', true)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Sender',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{row.original.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">{row.original.subject}</p>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      if (row.original.archived) return <Badge variant="secondary" className="text-xs">Archived</Badge>
      return row.original.read ? (
        <Badge variant="success" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" /> Read</Badge>
      ) : (
        <Badge variant="warning" className="text-xs"><Clock className="h-3 w-3 mr-1" /> Unread</Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Received',
    cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">{new Date(row.original.created_at).toLocaleDateString()}</span>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/admin/messages/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="View">
          <Mail className="h-4 w-4" />
        </Link>
        <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

export default async function MessagesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const messagesData = await getMessages(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage contact form messages.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{messagesData.count}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Messages</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {messagesData.data.filter(m => !m.read && !m.archived).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Unread</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {messagesData.data.filter(m => m.read && !m.archived).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Read</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {messagesData.data.filter(m => m.archived).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Archived</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search messages..." value={searchParams.search as string || ''} className="pl-10" />
          </div>
          <Select
            name="status"
            value={searchParams.status as string || ''}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </form>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={messagesData.data}
          pagination={{
            pageIndex: messagesData.page - 1,
            pageSize: messagesData.pageSize,
            onPageChange: () => {},
            onPageSizeChange: () => {},
            totalPages: messagesData.totalPages,
            totalCount: messagesData.count,
          }}
        />
      </Card>
    </div>
  )
}