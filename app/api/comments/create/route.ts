import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Comment } from '@/types'

// Use SERVICE_KEY on the backend - this can bypass RLS for insert operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scriptureId, authorName, authorEmail, text } = body

    if (!scriptureId || !authorName || !authorEmail || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic validation
    if (text.length < 5 || text.length > 1000) {
      return NextResponse.json({ error: 'Comment must be between 5 and 1000 characters' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          scripture_id: scriptureId,
          author_name: authorName,
          author_email: authorEmail,
          text: text,
          is_approved: false, // Comments need moderation
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Comment submitted for moderation', comment: data as Comment },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
