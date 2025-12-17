import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

interface ImageGenerationOptions {
  book: string
  chapter: number
  verses: string
  theme?: string
}

/**
 * Generate AI background image for a scripture using Replicate
 * Uses Stable Diffusion to create inspiring, relevant backgrounds
 */
export async function generateScriptureBackground(options: ImageGenerationOptions): Promise<string> {
  const { book, chapter, verses, theme = 'spiritual' } = options

  try {
    const prompt = `A beautiful, inspiring religious background image for ${book} ${chapter}:${verses} (${theme} theme). Serene, peaceful, uplifting atmosphere. Suitable for a website header. Professional, calming colors. Abstract or nature-based. No text. High quality.`

    const output = await replicate.run('stability-ai/stable-diffusion', {
      input: {
        prompt: prompt,
        num_outputs: 1,
        image_dimensions: '1280x720',
        num_inference_steps: 50,
      },
    })

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string
    }

    throw new Error('No image generated')
  } catch (error) {
    console.error('Error generating scripture background:', error)
    throw error
  }
}

/**
 * Fallback to unsplash for default backgrounds if AI generation fails
 */
export function getUnsplashBackground(keyword: string): string {
  const keywords = ['serene', 'peaceful', 'spiritual', 'nature', 'sunrise', 'light', 'hope']
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
  return `https://images.unsplash.com/random?query=${keyword || randomKeyword}&w=1280&h=720&fit=crop`
}
