import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, Archive, Reply } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate } from '@/lib/utils'
import { labelForBudget, labelForTimeline, labelForTopic } from '@/lib/contact'
import MessageActions from './MessageActions'
import { FALLBACK_MESSAGES } from '@/services/media.service'

export const metadata: Metadata = {
  title: 'Message Details',
  description: 'View contact message details.',
}

async function getMessage(id: string) {
  try {
    const supabase = createServerClientSupabase()
    const { data, error } = await supabase.from('contact_messages').select('*').eq('id', id).single()
    if (error || !data) {
      const fallback = FALLBACK_MESSAGES.find(m => m.id === id) || FALLBACK_MESSAGES[0]
      return fallback
    }
    return data
  } catch (err) {
    const fallback = FALLBACK_MESSAGES.find(m => m.id === id) || FALLBACK_MESSAGES[0]
    return fallback
  }
}

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const message = await getMessage(id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/messages" className="text-slate-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Message Details</h1>
          <p className="text-slate-600 dark:text-slate-400">From {message.name} · {formatDate(message.created_at)}</p>
        </div>
      </div>

      {/* Message Card */}
      <Card className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {message.status === 'archived' ? (
            <Badge variant="secondary"><Archive className="h-3 w-3 mr-1" /> Archived</Badge>
          ) : message.status === 'replied' ? (
            <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Replied</Badge>
          ) : message.status === 'read' ? (
            <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Read</Badge>
          ) : (
            <Badge variant="warning"><Clock className="h-3 w-3 mr-1" /> New</Badge>
          )}
        </div>

        {/* Sender Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</p>
            <p className="font-medium text-slate-600 dark:text-slate-100">{message.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
            <p className="font-medium text-slate-600 dark:text-slate-100"><a href={`mailto:${message.email}`} className="text-primary-600 hover:underline break-all">{message.email}</a></p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</p>
            <p className="font-medium text-slate-600 dark:text-slate-100">{message.company || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</p>
            <p className="font-medium text-slate-600 dark:text-slate-100">{labelForTopic(message.topic)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget</p>
            <p className="font-medium text-slate-600 dark:text-slate-100">{labelForBudget(message.budget)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timeline</p>
            <p className="font-medium text-slate-600 dark:text-slate-100">{labelForTimeline(message.timeline)}</p>
          </div>
        </div>

        {/* Message Content */}
        <div>
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-1">Message</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{message.subject}</p>
          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">{message.message}</div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Received: {formatDate(message.created_at)}
          </span>
          <span className="font-mono text-xs text-slate-400">{message.id}</span>
          {message.ip_address && (
            <span className="text-xs text-slate-400">IP {message.ip_address}</span>
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
          <MessageActions id={id} status={message.status} />
        </div>
      </Card>
    </div>
  )
}