import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, Briefcase, Plus, Calendar, Search, Edit, Trash2, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Manage work experience entries.',
}

async function getExperiences(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 10
  const search = searchParams.search as string || ''

  let query = supabase.from('experiences').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('start_date', { ascending: false })
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{row.original.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.original.company}</p>
      </div>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <span className="text-sm text-slate-600 dark:text-slate-400">{row.original.location || '—'}</span>
    ),
  },
  {
    accessorKey: 'current',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.current ? 'success' : 'secondary'} className="text-xs">
        {row.original.current ? 'Current' : 'Past'}
      </Badge>
    ),
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(row.original.start_date)}</span>,
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">{row.original.end_date ? formatDate(row.original.end_date) : 'Present'}</span>,
  },
  {
    accessorKey: 'order_index',
    header: 'Order',
    cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">#{row.original.order_index}</span>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/admin/experience/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
          <Edit className="h-4 w-4" />
        </Link>
        <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

export default async function ExperiencePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const experiencesData = await getExperiences(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Experience</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your work experience entries.</p>
        </div>
        <Link href="/admin/experience/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{experiencesData.count}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Entries</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {experiencesData.data.filter(e => e.current).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {experiencesData.data.filter(e => !e.current).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Past</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {experiencesData.data.reduce((sum, e) => sum + (e.technologies?.length || 0), 0)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Technologies</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search experience..." value={searchParams.search as string || ''} className="pl-10" />
          </div>
        </form>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={experiencesData.data}
          pagination={{
            pageIndex: experiencesData.page - 1,
            pageSize: experiencesData.pageSize,
            onPageChange: () => {},
            onPageSizeChange: () => {},
            totalPages: experiencesData.totalPages,
            totalCount: experiencesData.count,
          }}
        />
      </Card>
    </div>
  )
}