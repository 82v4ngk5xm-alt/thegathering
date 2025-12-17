export interface Scripture {
  id: string
  book: string
  chapter: number
  verses: string
  text: string
  translation: string
  display_order: number
  background_image_url?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  scripture_id: string
  author_name: string
  author_email: string
  text: string
  is_approved: boolean
  created_at: string
}

export interface DailyScripture {
  scripture: Scripture
  comments: Comment[]
  totalComments: number
}
