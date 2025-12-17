import { supabase } from './supabase'
import { Scripture, Comment } from '@/types'
import { format } from 'date-fns'

/**
 * Get the scripture for today based on date rotation
 * Cycles through scriptures sequentially, one per day
 */
export async function getTodayScripture(): Promise<Scripture | null> {
  try {
    console.log('[getTodayScripture] Starting fetch...')
    
    // Get all scriptures ordered by display order
    const { data: scriptures, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('display_order', { ascending: true })

    console.log('[getTodayScripture] Response:', { 
      scripturesCount: scriptures?.length, 
      error: error?.message || 'none' 
    })

    if (error) throw error
    if (!scriptures || scriptures.length === 0) {
      console.log('[getTodayScripture] No scriptures found')
      return null
    }

    // Calculate which scripture to show based on days since epoch
    const today = new Date()
    const epoch = new Date('2025-01-01')
    const daysSinceEpoch = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24))
    const scriptureIndex = daysSinceEpoch % scriptures.length

    console.log('[getTodayScripture] Returning scripture at index:', scriptureIndex)
    return scriptures[scriptureIndex] as Scripture
  } catch (error) {
    console.error('[getTodayScripture] Error:', error)
    return null
  }
}

/**
 * Get scripture by ID
 */
export async function getScriptureById(id: string): Promise<Scripture | null> {
  try {
    const { data, error } = await supabase
      .from('scriptures')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Scripture
  } catch (error) {
    console.error('Error fetching scripture:', error)
    return null
  }
}

/**
 * Get approved comments for a scripture
 */
export async function getCommentsForScripture(scriptureId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('scripture_id', scriptureId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as Comment[]
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

/**
 * Add a new comment
 */
export async function addComment(
  scriptureId: string,
  authorName: string,
  authorEmail: string,
  text: string
): Promise<Comment | null> {
  try {
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

    if (error) throw error
    return data as Comment
  } catch (error) {
    console.error('Error adding comment:', error)
    return null
  }
}

/**
 * Get all scriptures (for admin)
 */
export async function getAllScriptures(): Promise<Scripture[]> {
  try {
    const { data, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return (data || []) as Scripture[]
  } catch (error) {
    console.error('Error fetching scriptures:', error)
    return []
  }
}

/**
 * Get all pending comments (for admin)
 */
export async function getPendingComments(): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data || []) as Comment[]
  } catch (error) {
    console.error('Error fetching pending comments:', error)
    return []
  }
}

/**
 * Approve a comment (admin only)
 */
export async function approveComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ is_approved: true })
      .eq('id', commentId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error approving comment:', error)
    return false
  }
}

/**
 * Delete a comment (admin only)
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting comment:', error)
    return false
  }
}

/**
 * Update scripture with background image URL
 */
export async function updateScriptureImage(scriptureId: string, imageUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scriptures')
      .update({ background_image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq('id', scriptureId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating scripture image:', error)
    return false
  }
}
