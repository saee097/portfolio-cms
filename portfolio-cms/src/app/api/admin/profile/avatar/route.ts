import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 })
    }

    // Upload to storage
    const fileExt = file.name.split('.').pop()
    const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { upsert: true })
    
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)

    // Update profile with new avatar
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    
    if (updateError) throw updateError

    return NextResponse.json({ avatar_url: publicUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('role, avatar_url').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Remove from storage if exists
    if (profile.avatar_url) {
      try {
        const url = new URL(profile.avatar_url)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts.slice(pathParts.indexOf('media') + 1).join('/')
        await supabase.storage.from('media').remove([fileName])
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError)
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    
    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting avatar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}