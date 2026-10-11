import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, FolderGit2, Edit, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createServerClientSupabase } from '@/supabase/server'
import { SkillCategoryActions } from './SkillCategoryActions'

export const metadata: Metadata = {
  title: 'Skill Categories',
  description: 'Manage skill categories.',
}

async function getSkillCategories() {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export default async function SkillCategoriesPage() {
  const categories = await getSkillCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Skill Categories</h1>
          <p className="text-slate-600 dark:text-slate-400">Organize your skills into categories.</p>
        </div>
        <Link href="/admin/skills/categories/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4 space-y-3">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderGit2 className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No categories yet</p>
              <Link href="/admin/skills/categories/create">
                <Button variant="outline" size="sm" className="mt-3">Create your first category</Button>
              </Link>
            </div>
          ) : (
            categories.map(category => (
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
                  <SkillCategoryActions id={category.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}