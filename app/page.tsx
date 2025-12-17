import { ScriptureDisplay } from '@/components/ScriptureDisplay'
import { CommentsDisplay } from '@/components/CommentsDisplay'
import { getCommentsForScripture } from '@/lib/scripture'
import { Metadata } from 'next'
import { Scripture } from '@/types'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering - don't prerender this page statically
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Don't cache

export const metadata: Metadata = {
  title: 'Scripture of the Day - The Gathering',
  description: 'Read encouraging scripture daily and connect with our community',
  openGraph: {
    title: 'Scripture of the Day - The Gathering',
    description: 'Read encouraging scripture daily and connect with our community',
    url: 'https://www.thegathering.today',
    type: 'website',
  },
}

async function getTodayScripture(): Promise<Scripture | null> {
  try {
    // Create Supabase client directly instead of fetching through HTTP
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )

    const { data: scriptures, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[HomePage] Supabase error:', error.message)
      return null
    }

    if (!scriptures || scriptures.length === 0) {
      console.error('[HomePage] No scriptures found in database')
      return null
    }

    // Calculate which scripture to show based on days since epoch
    const today = new Date()
    const epoch = new Date('2025-01-01')
    const daysSinceEpoch = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24))
    const scriptureIndex = daysSinceEpoch % scriptures.length
    const todayScripture = scriptures[scriptureIndex]

    return todayScripture as Scripture
  } catch (error) {
    console.error('[HomePage] Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

export default async function HomePage() {
  try {
    const scripture = await getTodayScripture()

    if (!scripture) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to The Gathering</h1>
            <p className="text-lg text-gray-600 mb-6">Scripture of the Day</p>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
              <p className="text-gray-600 mb-4">Setting up your scripture database...</p>
              <p className="text-sm text-gray-500">Please refresh the page in a moment.</p>
            </div>
          </div>
        </main>
      )
    }

    const comments = await getCommentsForScripture(scripture.id)

    return (
      <main>
        <ScriptureDisplay scripture={scripture} />
        <CommentsDisplay scriptureId={scripture.id} comments={comments} />
      </main>
    )
  } catch (error) {
    console.error('[HomePage] Error loading page:', error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">The Gathering</h1>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <p className="text-gray-700 mb-4">Loading scripture...</p>
            <p className="text-sm text-gray-500">If this persists, please check your database connection.</p>
          </div>
        </div>
      </main>
    )
  }
}
