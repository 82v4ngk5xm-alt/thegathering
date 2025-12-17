import { ScriptureDisplay } from '@/components/ScriptureDisplay'
import { CommentsDisplay } from '@/components/CommentsDisplay'
import { getCommentsForScripture } from '@/lib/scripture'
import { Metadata } from 'next'
import { Scripture } from '@/types'

export const revalidate = 3600 // Revalidate once per hour

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
    console.log('[HomePage] Fetching today scripture from API...')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/scripture`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('[HomePage] API returned status:', response.status)
      return null
    }

    const data = await response.json()
    console.log('[HomePage] API returned scripture:', {
      book: data.scripture?.book,
      chapter: data.scripture?.chapter,
      display_order: data.scripture?.display_order
    })
    
    return data.scripture || null
  } catch (error) {
    console.error('[HomePage] Error fetching scripture:', error)
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
        <CommentsDisplay scriptureId={scripture.id} comments={comments} totalComments={comments.length} />
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
