'use client'

import React, { useState, useEffect } from 'react'
import { Comment } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface CommentsDisplayProps {
  scriptureId: string
  comments: Comment[]
  totalComments: number
}

export function CommentsDisplay({ scriptureId, comments: initialComments, totalComments }: CommentsDisplayProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    text: '',
  })

  // Fetch approved comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${scriptureId}`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }
    
    fetchComments()
  }, [scriptureId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptureId,
          ...formData,
        }),
      })

      if (response.ok) {
        setFormData({ authorName: '', authorEmail: '', text: '' })
        setShowForm(false)
        alert('Thank you! Your comment has been submitted for moderation.')
      } else {
        alert('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Error submitting comment')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Community Reflections</h2>
        <p className="text-gray-600 mb-8">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </p>

        {/* Comments List */}
        <div className="space-y-6 mb-8">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-brand-blue pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{comment.author_name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Comment Form Toggle */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Share Your Reflection
          </button>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Share Your Thoughts</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reflection</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Share how this scripture speaks to you..."
                  required
                  minLength={5}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.text.length}/1000 characters</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-blue hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-600">
                Comments are reviewed before posting to maintain a respectful community.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
