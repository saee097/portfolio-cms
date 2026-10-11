import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Search, Mail, CheckCircle, Clock, Archive, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'
import { labelForBudget, labelForTimeline, labelForTopic } from '@/lib/contact'
import { ColumnDef } from '@tanstack/react-table'

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

  let query = supabase.from('contact_messages').select('*', { count: 'exact' })

  if (status === 'archived') query = query.eq('status', 'archived')
  else if (status === 'replied') query = query.eq('status', 'replied')
  else if (status === 'read') query = query.eq('status', 'read')
  else if (status === 'new') query = query.eq('status', 'new')

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

const columns: ColumnDef<{
  id: string
  name: string
  email: string
  subject: string
  message: string
  company: string | null
  topic: string | null
  budget: string | null
  timeline: string | null
  status: string
  created_at: string
}>[] = [
  {
    accessorKey: 'name',
    header: 'Sender',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-600 dark:text-slate-100">{row.original.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.original.email}</p>
        {row.original.company && (
          <p className="text-xs text-slate-400 truncate max-w-xs">{row.original.company}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Inquiry',
    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{row.original.subject}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{row.original.message}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="outline" size="sm">{labelForTopic(row.original.topic)}</Badge>
          {row.original.budget && (
            <Badge variant="secondary" size="sm">{labelForBudget(row.original.budget)}</Badge>
          )}
          {row.original.timeline && (
            <Badge variant="secondary" size="sm">{labelForTimeline(row.original.timeline)}</Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      switch (row.original.status) {
        case 'archived': return <Badge variant="secondary" className="text-xs"><Archive className="h-3 w-3 mr-1" /> Archived</Badge>
        case 'replied': return <Badge variant="success" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" /> Replied</Badge>
        case 'read': return <Badge variant="success" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" /> Read</Badge>
        default: return <Badge variant="warning" className="text-xs"><Clock className="h-3 w-3 mr-1" /> New</Badge>
      }
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

export default async function MessagesPage({ searchParams: sp }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await sp
  const messagesData = await getMessages(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Messages</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage contact form messages.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">{messagesData.count}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Messages</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {messagesData.data.filter(m => m.status === 'new').length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Unread</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {messagesData.data.filter(m => m.status === 'read' || m.status === 'replied').length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Read</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {messagesData.data.filter(m => m.status === 'archived').length}
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
              { value: 'new', label: 'New' },
              { value: 'read', label: 'Read' },
              { value: 'replied', label: 'Replied' },
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