import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Save, MessageSquare, Plus, Search, Edit, Trash2, Star, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createServerClientSupabase } from '@/supabase/server'
import { ColumnDef } from '@tanstack/react-table'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Manage client testimonials.',
}

async function getTestimonials(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 10
  const search = searchParams.search as string || ''
  const status = searchParams.status as string || ''

  let query = supabase.from('testimonials').select('*', { count: 'exact' })

  if (status === 'published') query = query.eq('published', true)
  else if (status === 'draft') query = query.eq('published', false)

  if (search) {
    query = query.or(`client_name.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('order_index', { ascending: true })
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
  client_name: string
  position?: string | null
  company?: string | null
  rating: number
  published: boolean
  order_index: number
}>[] = [
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-600 dark:text-slate-100">{row.original.client_name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{row.original.position}{row.original.company ? `, ${row.original.company}` : ''}</p>
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {Array.from({ length: row.original.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'published',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.published ? 'success' : 'secondary'} className="text-xs">
        {row.original.published ? 'Published' : 'Draft'}
      </Badge>
    ),
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
        <Link href={`/admin/testimonials/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
          <Edit className="h-4 w-4" />
        </Link>
        <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

export default async function TestimonialsPage({ searchParams: sp }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await sp
  const testimonialsData = await getTestimonials(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Testimonials</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage client testimonials.</p>
        </div>
        <Link href="/admin/testimonials/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">{testimonialsData.count}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {testimonialsData.data.filter(t => t.published).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Published</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {testimonialsData.data.filter(t => !t.published).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Draft</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {testimonialsData.data.reduce((sum, t) => sum + t.rating, 0) / (testimonialsData.count || 1)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Rating</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search testimonials..." value={searchParams.search as string || ''} className="pl-10" />
          </div>
          <Select
            name="status"
            value={searchParams.status as string || ''}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
          />
        </form>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={testimonialsData.data}
          pagination={{
            pageIndex: testimonialsData.page - 1,
            pageSize: testimonialsData.pageSize,
            onPageChange: () => {},
            onPageSizeChange: () => {},
            totalPages: testimonialsData.totalPages,
            totalCount: testimonialsData.count,
          }}
        />
      </Card>
    </div>
  )
}