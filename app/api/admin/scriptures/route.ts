import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Scripture } from '@/types'

// Use SERVICE_KEY for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

// Middleware to check admin auth
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET_KEY

  if (!authHeader || !adminSecret) {
    return false
  }

  return authHeader === `Bearer ${adminSecret}`
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: scriptures, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return NextResponse.json({ scriptures: (scriptures || []) as Scripture[] })
  } catch (error) {
    console.error('[Scriptures Admin API] Error fetching scriptures:', error)
    return NextResponse.json({ error: 'Failed to fetch scriptures' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { book, chapter, verses, text, translation = 'NLT', display_order } = body

    // Validation
    if (!book || !chapter || !verses || !text || display_order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: book, chapter, verses, text, display_order' },
        { status: 400 }
      )
    }

    if (text.length < 10) {
      return NextResponse.json(
        { error: 'Scripture text must be at least 10 characters' },
        { status: 400 }
      )
    }

    const { data: scripture, error } = await supabase
      .from('scriptures')
      .insert([
        {
          book,
          chapter: parseInt(chapter),
          verses,
          text,
          translation,
          display_order: parseInt(display_order),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[Scriptures Admin API] Insert error:', error)
      // Check if it's a duplicate display_order
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Display order ${display_order} already exists. Please use a unique number.` },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { message: 'Scripture added successfully', scripture: scripture as Scripture },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Scriptures Admin API] Error:', error)
    return NextResponse.json({ error: 'Failed to add scripture' }, { status: 500 })
  }
}
