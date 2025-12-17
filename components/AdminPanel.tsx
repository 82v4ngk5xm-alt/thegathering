'use client'

import React, { useEffect, useState } from 'react'
import { Scripture, Comment } from '@/types'

interface AdminPanelProps {
  adminSecret: string
  onLogout?: () => void
}

export function AdminPanel({ adminSecret, onLogout }: AdminPanelProps) {
  const [pendingComments, setPendingComments] = useState<Comment[]>([])
  const [allScriptures, setAllScriptures] = useState<Scripture[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('comments')
  const [formData, setFormData] = useState({
    book: '',
    chapter: '',
    verses: '',
    text: '',
    translation: 'NLT',
    display_order: '',
  })
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchPendingComments()
    if (activeTab === 'scriptures') {
      fetchScriptures()
    }
  }, [activeTab])

  const fetchPendingComments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/comments', {
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPendingComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching pending comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchScriptures = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/scriptures', {
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAllScriptures(data.scriptures)
      }
    } catch (error) {
      console.error('Error fetching scriptures:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ commentId, action: 'approve' }),
      })

      if (response.ok) {
        setPendingComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ commentId, action: 'delete' }),
      })

      if (response.ok) {
        setPendingComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleScriptureFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddScripture = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)

    try {
      const response = await fetch('/api/admin/scriptures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormMessage({ type: 'success', text: 'Scripture added successfully!' })
        setFormData({
          book: '',
          chapter: '',
          verses: '',
          text: '',
          translation: 'NLT',
          display_order: '',
        })
        // Refresh scriptures list
        fetchScriptures()
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to add scripture' })
      }
    } catch (error) {
      console.error('Error adding scripture:', error)
      setFormMessage({ type: 'error', text: 'Error adding scripture' })
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 font-semibold ${
              activeTab === 'comments'
                ? 'border-b-2 border-brand-blue text-brand-blue'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending Comments ({pendingComments.length})
          </button>
          <button
            onClick={() => setActiveTab('scriptures')}
            className={`pb-3 font-semibold ${
              activeTab === 'scriptures'
                ? 'border-b-2 border-brand-blue text-brand-blue'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Scriptures
          </button>
        </div>

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : pendingComments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending comments</p>
            ) : (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{comment.author_name}</p>
                        <p className="text-sm text-gray-500">{comment.author_email}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4">{comment.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scriptures Tab */}
        {activeTab === 'scriptures' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Scripture Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Scripture</h2>
              <form onSubmit={handleAddScripture} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book *</label>
                  <input
                    type="text"
                    name="book"
                    value={formData.book}
                    onChange={handleScriptureFormChange}
                    placeholder="e.g., Philippians"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter *</label>
                    <input
                      type="number"
                      name="chapter"
                      value={formData.chapter}
                      onChange={handleScriptureFormChange}
                      placeholder="e.g., 4"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verses *</label>
                    <input
                      type="text"
                      name="verses"
                      value={formData.verses}
                      onChange={handleScriptureFormChange}
                      placeholder="e.g., 4-7"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scripture Text *</label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleScriptureFormChange}
                    placeholder="Enter the full scripture text..."
                    required
                    minLength={10}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Translation</label>
                    <select
                      name="translation"
                      value={formData.translation}
                      onChange={handleScriptureFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    >
                      <option value="NLT">NLT</option>
                      <option value="NIV">NIV</option>
                      <option value="KJV">KJV</option>
                      <option value="ESV">ESV</option>
                      <option value="NRSV">NRSV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order *</label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleScriptureFormChange}
                      placeholder="e.g., 10"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {formMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      formMessage.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {formMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Add Scripture
                </button>
              </form>
            </div>

            {/* Scriptures List */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Scriptures ({allScriptures.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Loading scriptures...</p>
                ) : allScriptures.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No scriptures added yet</p>
                ) : (
                  allScriptures.map((scripture) => (
                    <div key={scripture.id} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {scripture.book} {scripture.chapter}:{scripture.verses}
                          </p>
                          <p className="text-xs text-gray-500">{scripture.translation}</p>
                        </div>
                        <span className="bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded">
                          Order: {scripture.display_order}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{scripture.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
