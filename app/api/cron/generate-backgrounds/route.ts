import { NextRequest, NextResponse } from 'next/server'
import { getAllScriptures, updateScriptureImage } from '@/lib/scripture'
import { getUnsplashBackground } from '@/lib/image-generation'
// import { generateScriptureBackground } from '@/lib/image-generation'  // TODO: Enable when Replicate API is configured

export const dynamic = 'force-dynamic'

/**
 * Cron endpoint to generate AI backgrounds for scriptures
 * Can be triggered by Vercel Cron or external service
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const scriptures = await getAllScriptures()

    // Filter scriptures without background images
    const scripturesNeedingImages = scriptures.filter((s) => !s.background_image_url)

    if (scripturesNeedingImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All scriptures have background images',
      })
    }

    const results = []

    // Generate or fetch backgrounds for each scripture
    for (const scripture of scripturesNeedingImages.slice(0, 5)) {
      try {
        // Try to generate AI image
        let imageUrl: string

        if (process.env.REPLICATE_API_TOKEN) {
          try {
            // TODO: Enable AI generation when Replicate is configured
            // imageUrl = await generateScriptureBackground({
            //   book: scripture.book,
            //   chapter: scripture.chapter,
            //   verses: scripture.verses,
            // })
            imageUrl = getUnsplashBackground(scripture.book)
          } catch (error) {
            console.log('AI generation failed, using fallback:', error)
            imageUrl = getUnsplashBackground(scripture.book)
          }
        } else {
          // No Replicate token, use Unsplash fallback
          imageUrl = getUnsplashBackground(scripture.book)
        }

        // Update database
        await updateScriptureImage(scripture.id, imageUrl)

        results.push({
          scriptureId: scripture.id,
          reference: `${scripture.book} ${scripture.chapter}:${scripture.verses}`,
          success: true,
          imageUrl,
        })
      } catch (error) {
        console.error(`Error generating image for ${scripture.book} ${scripture.chapter}:`, error)
        results.push({
          scriptureId: scripture.id,
          reference: `${scripture.book} ${scripture.chapter}:${scripture.verses}`,
          success: false,
          error: String(error),
        })
      }

      // Rate limit: wait between requests
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} scriptures`,
      results,
    })
  } catch (error) {
    console.error('Error in background generation cron:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
