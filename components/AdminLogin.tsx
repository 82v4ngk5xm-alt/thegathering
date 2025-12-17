'use client'

import React, { useState } from 'react'

interface AdminLoginProps {
  onLogin: (secret: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!secret.trim()) {
      setError('Please enter the admin secret key')
      return
    }

    onLogin(secret)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Admin Access</h1>
          <p className="text-gray-600 text-center mb-6">Enter your secret key to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm border border-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your secret key is stored in your environment variables (.env.local)
          </p>
        </div>
      </div>
    </main>
  )
}
