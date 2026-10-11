import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Search, Code, ChevronUp, ChevronDown, ChevronsUpDown, Edit, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DataTable } from '@/components/ui/DataTable'
import { createServerClientSupabase } from '@/supabase/server'
import { skillSchema, skillCategorySchema } from '@/lib/validations'
import { ColumnDef } from '@tanstack/react-table'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Manage skills and categories.',
}

async function getSkills() {
  const supabase = createServerClientSupabase()
  
  const [skillsResult, categoriesResult] = await Promise.all([
    supabase.from('skills').select('*, category:skill_categories(*)').order('order_index', { ascending: true }),
    supabase.from('skill_categories').select('*').order('order_index', { ascending: true }),
  ])

  return {
    skills: skillsResult.data || [],
    categories: categoriesResult.data || [],
  }
}

const columns: ColumnDef<{
  id: string
  name: string
  icon?: string | null
  proficiency: number
  category?: { name?: string } | null
  order_index: number
}>[] = [
  {
    accessorKey: 'name',
    header: 'Skill',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.icon && <span className="text-lg">{row.original.icon}</span>}
        <div>
          <p className="font-medium text-slate-600 dark:text-slate-100">{row.original.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proficiency: {row.original.proficiency}%
          </p>
        </div>
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
    accessorKey: 'proficiency',
    header: 'Proficiency',
    cell: ({ row }) => (
      <div className="w-32">
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${row.original.proficiency}%` }}
          />
        </div>
      </div>
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
        <Link href={`/admin/skills/${row.original.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300" title="Edit">
          <Edit className="h-4 w-4" />
        </Link>
        <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

export default async function AdminSkillsPage() {
  const { skills, categories } = await getSkills()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Skills</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage technical skills and categories.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/skills/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </Link>
          <Link href="/admin/skills/categories">
            <Button variant="outline">
              <Code className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search skills..." className="pl-10" />
          </div>
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

      {/* Skills Table */}
      <Card>
        <DataTable
          columns={columns}
          data={skills}
        />
      </Card>

      {/* Categories Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-100 mb-4">Categories</h2>
        <Card>
          <div className="space-y-4 p-4">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
                  {category.icon && <span className="text-2xl">{category.icon}</span>}
                  <div>
                    <p className="font-medium text-slate-600 dark:text-slate-100">{category.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/skills/categories/${category.id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}