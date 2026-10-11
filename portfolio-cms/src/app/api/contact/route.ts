import { NextRequest, NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/supabase/server'
import { contactMessageSchema } from '@/lib/validations'
import { submitContactMessage } from '@/services/media.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = contactMessageSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const message = await submitContactMessage(validation.data, ipAddress, userAgent)

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    )
  }
}