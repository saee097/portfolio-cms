'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

export function MessageActions({ id, status }: { id: string; status: string }) {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)

  async function patch(body: Record<string, unknown>) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to update')
      success('Message updated')
    } catch {
      error('Failed to update message')
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    if (!confirm('Delete this message?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      success('Message deleted')
      window.location.reload()
    } catch {
      error('Failed to delete message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status !== 'read' && status !== 'replied' && status !== 'archived' && (
        <Button type="button" variant="outline" disabled={loading} onClick={() => patch({ status: 'read' })}>
          <Edit className="h-4 w-4 mr-2" />
          Mark as Read
        </Button>
      )}
      {status !== 'replied' && status !== 'archived' && (
        <Button type="button" variant="outline" disabled={loading} onClick={() => patch({ status: 'replied' })}>
          <Edit className="h-4 w-4 mr-2" />
          Mark as Replied
        </Button>
      )}
      {status !== 'archived' && (
        <Button type="button" variant="outline" disabled={loading} onClick={() => patch({ status: 'archived' })}>
          <Trash2 className="h-4 w-4 mr-2" />
          Archive
        </Button>
      )}
      <Button type="button" variant="destructive" disabled={loading} onClick={remove}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

export default MessageActions