'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

export function SkillCategoryActions({ id }: { id: string }) {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)

  async function remove() {
    if (!confirm('Delete this category? Skills in this category will be unassigned.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/skill-categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      success('Category deleted')
      window.location.reload()
    } catch {
      error('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/skills/categories/${id}`} className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
        <Edit className="h-4 w-4" />
      </Link>
      <button disabled={loading} onClick={remove} className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}