import { NextRequest, NextResponse } from 'next/server'
import { getTodayScripture, getCommentsForScripture } from '@/lib/scripture'

export const revalidate = 86400 // Revalidate once per day

export async function GET(request: NextRequest) {
  try {
    const scripture = await getTodayScripture()

    if (!scripture) {
      return NextResponse.json({ error: 'No scripture found' }, { status: 404 })
    }

    const comments = await getCommentsForScripture(scripture.id)

    return NextResponse.json({
      scripture,
      comments,
      totalComments: comments.length,
    })
  } catch (error) {
    console.error('Error in scripture API:', error)
    return NextResponse.json({ error: 'Failed to fetch scripture' }, { status: 500 })
  }
}
