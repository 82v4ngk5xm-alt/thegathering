import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Comment } from '@/types'

// Use SERVICE_KEY to ensure we can fetch all approved comments
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

export async function GET(
  request: NextRequest,
  { params }: { params: { scriptureId: string } }
) {
  try {
    const { scriptureId } = params
    console.log('[Comments API] URL:', request.url)
    console.log('[Comments API] Params:', params)
    console.log('[Comments API] ScriptureId:', scriptureId)

    if (!scriptureId) {
      console.log('[Comments API] No scriptureId provided')
      return NextResponse.json({ error: 'Scripture ID is required' }, { status: 400 })
    }

    console.log('[Comments API] Querying comments for:', scriptureId)
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('scripture_id', scriptureId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    console.log('[Comments API] Query result:', { count: comments?.length, error: error?.message })

    if (error) throw error

    return NextResponse.json({
      comments: (comments || []) as Comment[],
      totalComments: (comments || []).length,
    })
  } catch (error) {
    console.error('[Comments API] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}
