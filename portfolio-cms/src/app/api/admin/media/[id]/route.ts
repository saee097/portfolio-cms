import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClientSupabase()
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
    if (!profile || !['super_admin', 'admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('file_url')

    // Delete from database
    const { error: dbError } = await supabase.from('media').delete().eq('id', id)
    if (dbError) throw dbError

    // Delete from storage if file_url provided
    if (fileUrl) {
      try {
        const url = new URL(fileUrl)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        await supabase.storage.from('media').remove([fileName])
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}