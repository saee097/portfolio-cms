import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, Edit, Eye, Copy, Trash2, Globe, Github } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DataTable } from '@/components/ui/DataTable'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'
import { projectSchema } from '@/lib/validations'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage portfolio projects.',
}

async function getProjects(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 10
  const search = searchParams.search as string || ''
  const sortBy = searchParams.sortBy as string || 'order_index'
  const sortOrder = searchParams.sortOrder as string || 'asc'
  const status = searchParams.status as string || ''
  const category = searchParams.category as string || ''
  const featured = searchParams.featured as string || ''

  let query = supabase.from('projects').select('*', { count: 'exact' })

  if (status === 'published') query = query.eq('published', true)
  else if (status === 'draft') query = query.eq('published', false)

  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('featured', true)
  else if (featured === 'false') query = query.eq('featured', false)

  if (search) {
    query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
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

async function getCategories() {
  const supabase = createServerClientSupabase()
  const { data } = await supabase.from('projects').select('category').not('category', 'is', null)
  return [...new Set(data?.map(p => p.category).filter(Boolean) || [])] as string[]
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [projectsData, categories] = await Promise.all([
    getProjects(searchParams),
    getCategories(),
  ])

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{row.original.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.original.short_description || 'No description'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">{row.original.category || '—'}</Badge>
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
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <Badge variant={row.original.featured ? 'default' : 'outline'} className="text-xs">
          {row.original.featured ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'order_index',
      header: 'Order',
      cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">#{row.original.order_index}</span>,
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated',
      cell: ({ row }) => <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(row.original.updated_at)}</span>,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="View">
            <Eye className="h-4 w-4" />
          </Link>
          <Link href={`/admin/projects/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
            <Edit className="h-4 w-4" />
          </Link>
          <Link href={`/admin/projects/${row.original.id}/duplicate`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Duplicate">
            <Copy className="h-4 w-4" />
          </Link>
          <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your portfolio projects.</p>
        </div>
        <Link href="/admin/projects/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              name="search"
              placeholder="Search projects..."
              value={searchParams.search as string || ''}
              className="pl-10"
            />
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
          <Select
            name="category"
            value={searchParams.category as string || ''}
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(c => ({ value: c, label: c })),
            ]}
          />
          <Select
            name="featured"
            value={searchParams.featured as string || ''}
            placeholder="Featured"
            options={[
              { value: '', label: 'Featured' },
              { value: 'true', label: 'Featured' },
              { value: 'false', label: 'Not Featured' },
            ]}
          />
        </form>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={projectsData.data}
          pagination={{
            pageIndex: projectsData.page - 1,
            pageSize: projectsData.pageSize,
            onPageChange: (page) => {},
            onPageSizeChange: (size) => {},
            totalPages: projectsData.totalPages,
            totalCount: projectsData.count,
          }}
          sorting={{
            sorting: [{ id: searchParams.sortBy as string || 'order_index', desc: (searchParams.sortOrder as string || 'asc') === 'desc' }],
            onSortingChange: () => {},
          }}
        />
      </Card>
    </div>
  )
}