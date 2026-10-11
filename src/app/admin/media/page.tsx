import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, Search, Trash2, Copy, Download, Eye, MoreHorizontal, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { createServerClientSupabase } from '@/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Media Library',
  description: 'Manage uploaded media files.',
}

async function getMediaFiles(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createServerClientSupabase()
  const page = parseInt(searchParams.page as string) || 1
  const pageSize = parseInt(searchParams.pageSize as string) || 24
  const search = searchParams.search as string || ''
  const type = searchParams.type as string || ''

  let query = supabase.from('media').select('*', { count: 'exact' })

  if (type === 'image') query = query.like('mime_type', 'image/%')
  else if (type === 'video') query = query.like('mime_type', 'video/%')
  else if (type === 'document') query = query.like('mime_type', 'application/%')

  if (search) {
    query = query.or(`file_name.ilike.%${search}%,alt_text.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
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

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-green-500" />
  if (mimeType.startsWith('video/')) return <ImageIcon className="h-8 w-8 text-purple-500" />
  if (mimeType.startsWith('application/pdf')) return <ImageIcon className="h-8 w-8 text-red-500" />
  return <ImageIcon className="h-8 w-8 text-slate-500" />
}

function isImage(mimeType: string) {
  return mimeType.startsWith('image/')
}

export default async function MediaPage({ searchParams: sp }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await sp
  const mediaData = await getMediaFiles(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-100">Media Library</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your uploaded files.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,application/pdf"
            onChange={async (e) => {
              const files = Array.from(e.target.files || [])
              const supabase = createServerClientSupabase()
              for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                  .from('media')
                  .upload(fileName, file)
                if (!uploadError) {
                  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
                  await supabase.from('media').insert({
                    file_name: file.name,
                    file_url: publicUrl,
                    mime_type: file.type,
                    file_size: file.size,
                    alt_text: '',
                    width: 0,
                    height: 0,
                  })
                }
              }
              window.location.reload()
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">{mediaData.count}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Files</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {mediaData.data.filter(m => m.mime_type.startsWith('image/')).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Images</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {mediaData.data.filter(m => m.mime_type.startsWith('video/')).length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Videos</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            {formatFileSize(mediaData.data.reduce((sum, m) => sum + m.file_size, 0))}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Size</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="flex flex-col md:flex-row gap-4" method="GET">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input name="search" placeholder="Search files..." defaultValue={searchParams.search as string || ''} className="pl-10" />
          </div>
          <select name="type" className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100" defaultValue={searchParams.type as string || ''}>
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </form>
      </Card>

      {/* Media Grid */}
      <Card className="p-0 overflow-hidden">
        {mediaData.data.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-100 mb-2">No files found</h3>
            <p className="text-slate-500 dark:text-slate-400">Upload your first file to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-4 gap-4">
            {mediaData.data.map((file) => (
              <div key={file.id} className="relative group bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="aspect-square relative bg-slate-100 dark:bg-slate-700">
                  {isImage(file.mime_type) ? (
                    <Image
                      src={file.file_url}
                      alt={file.alt_text || file.file_name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getFileIcon(file.mime_type)}
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-100 truncate" title={file.file_name}>
                    {file.file_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(file.file_size)} · {formatDate(file.created_at)}
                  </p>
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={() => navigator.clipboard.writeText(file.file_url)}
                      className="flex-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 flex items-center justify-center gap-1"
                      title="Copy URL"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 flex items-center justify-center gap-1" title="Open">
                      <ExternalLink className="h-3 w-3" />
                      <span>Open</span>
                    </a>
                    <form action="/api/admin/media" method="POST" onSubmit={(e) => { if (!confirm('Delete this file?')) e.preventDefault() }}>
                      <input type="hidden" name="_method" value="DELETE" />
                      <input type="hidden" name="id" value={file.id} />
                      <input type="hidden" name="file_url" value={file.file_url} />
                      <button type="submit" className="flex-1 text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center justify-center gap-1" title="Delete">
                        <Trash2 className="h-3 w-3" />
                        <span>Del</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {mediaData.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page {mediaData.page} of {mediaData.totalPages} ({mediaData.count} total)
            </p>
            <div className="flex gap-2">
              {mediaData.page > 1 && (
                <a href={`?page=${mediaData.page - 1}&search=${searchParams.search || ''}&type=${searchParams.type || ''}`}>
                  <Button variant="outline" size="sm">Previous</Button>
                </a>
              )}
              {mediaData.page < mediaData.totalPages && (
                <a href={`?page=${mediaData.page + 1}&search=${searchParams.search || ''}&type=${searchParams.type || ''}`}>
                  <Button variant="outline" size="sm">Next</Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}