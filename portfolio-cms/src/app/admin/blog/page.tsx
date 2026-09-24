import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Search, Filter, PenTool, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DataTable } from '@/components/ui/DataTable'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Manage blog posts.',
}

async function getBlogPosts(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 10
  const search = searchParams.search as string || ''
  const status = searchParams.status as string || ''
  const category = searchParams.category as string || ''

  let query = supabase.from('blog_posts').select(`
    *,
    category:blog_categories(name, slug),
    author:profiles(full_name)
  `, { count: 'exact' })

  if (status === 'published') query = query.eq('status', 'published')
  else if (status === 'draft') query = query.eq('status', 'draft')

  if (category) query = query.eq('category_id', category)

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('published_at', { ascending: false, nullsFirst: false })
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
  const { data } = await supabase.from('blog_categories').select('id, name').order('name')
  return data || []
}

const columns: ColumnDef<{
  id: string
  title: string
  slug: string
  excerpt?: string | null
  category?: { name?: string } | null
  published: boolean
  status: string
  published_at?: string | null
  views?: number
  updated_at?: string | null
}>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{row.original.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.original.excerpt || 'No excerpt'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original.category?.name || 'Uncategorized'}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'published' ? 'success' : 'secondary'} className="text-xs">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'published_at',
    header: 'Published',
    cell: ({ row }) => (
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {row.original.published_at ? formatDate(row.original.published_at) : '—'}
      </span>
    ),
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
        <Eye className="h-3.5 w-3.5" />
        {row.original.views?.toLocaleString() || 0}
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/admin/blog/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
          <Edit className="h-4 w-4" />
        </Link>
        <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

export default async function AdminBlogPage({ searchParams: sp }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await sp
  const [postsData, categories] = await Promise.all([
    getBlogPosts(searchParams),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Blog Posts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your blog articles.</p>
        </div>
        <Link href="/admin/blog/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search posts..." className="pl-10" />
          </div>
          <Select
            name="status"
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
          />
          <Select
            name="category"
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(c => ({ value: c.id, label: c.name })),
            ]}
          />
        </form>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={postsData.data}
          pagination={{
            pageIndex: postsData.page - 1,
            pageSize: postsData.pageSize,
            onPageChange: () => {},
            onPageSizeChange: () => {},
            totalPages: postsData.totalPages,
            totalCount: postsData.count,
          }}
        />
      </Card>
    </div>
  )
}