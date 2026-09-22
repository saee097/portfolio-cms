import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Mail, Reply, CheckCircle, Clock, Archive, Trash2, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Message Details',
  description: 'View message details.',
}

async function getMessage(id: string) {
  const supabase = createServerClientSupabase()
  const { data, error } = await supabase.from('messages').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const message = await getMessage(params.id)

  // Mark as read if unread
  if (!message.read) {
    const supabase = createServerClientSupabase()
    await supabase.from('messages').update({ read: true }).eq('id', params.id)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/messages" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Message Details</h1>
          <p className="text-slate-600 dark:text-slate-400">From {message.name} · {formatDate(message.created_at)}</p>
        </div>
      </div>

      {/* Message Card */}
      <Card className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {message.archived ? (
            <Badge variant="secondary"><Archive className="h-3 w-3 mr-1" /> Archived</Badge>
          ) : message.read ? (
            <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Read</Badge>
          ) : (
            <Badge variant="warning"><Clock className="h-3 w-3 mr-1" /> Unread</Badge>
          )}
        </div>

        {/* Sender Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{message.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
            <p className="font-medium text-slate-900 dark:text-slate-100"><a href={`mailto:${message.email}`} className="text-primary-600 hover:underline">{message.email}</a></p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{message.subject}</p>
          </div>
        </div>

        {/* Message Content */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Message</h3>
          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">{message.message}</div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Received: {formatDate(message.created_at)}
          </span>
          {message.read_at && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Read: {formatDate(message.read_at)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/admin/messages">
            <Button variant="outline">Back to Messages</Button>
          </Link>
          <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
            <Button>
              <Reply className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
          </a>
          {!message.read && !message.archived && (
            <form action={`/api/admin/messages/${params.id}`} method="POST">
              <input type="hidden" name="_method" value="PATCH" />
              <input type="hidden" name="read" value="true" />
              <Button type="submit">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
            </form>
          )}
          {!message.archived && (
            <form action={`/api/admin/messages/${params.id}`} method="POST">
              <input type="hidden" name="_method" value="PATCH" />
              <input type="hidden" name="archived" value="true" />
              <Button type="submit" variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </form>
          )}
          <form action={`/api/admin/messages/${params.id}`} method="POST" onSubmit={(e) => { if (!confirm('Delete this message?')) e.preventDefault() }}>
            <input type="hidden" name="_method" value="DELETE" />
            <Button type="submit" variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}