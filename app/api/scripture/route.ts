import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use SERVICE_KEY on the backend - this can bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

export async function GET() {
  try {
    const { data: scriptures, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[API] Error fetching scriptures:', error)
      return NextResponse.json(
        { error: 'Failed to fetch scriptures' },
        { status: 500 }
      )
    }

    if (!scriptures || scriptures.length === 0) {
      return NextResponse.json(
        { error: 'No scriptures found' },
        { status: 404 }
      )
    }

    // Calculate which scripture to show based on days since epoch
    const today = new Date()
    const epoch = new Date('2025-01-01')
    const daysSinceEpoch = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24))
    const scriptureIndex = daysSinceEpoch % scriptures.length
    const todayScripture = scriptures[scriptureIndex]

    return NextResponse.json({
      scripture: todayScripture,
      totalScriptures: scriptures.length,
      daysSinceEpoch,
      index: scriptureIndex,
    })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
