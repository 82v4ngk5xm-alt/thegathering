'use client'

import { AdminPanel } from '@/components/AdminPanel'
import { AdminLogin } from '@/components/AdminLogin'
import { useState, useEffect } from 'react'
import { Metadata } from 'next'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminSecret, setAdminSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Check if user was already logged in (session storage)
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth')
    if (stored) {
      setAdminSecret(stored)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (secret: string) => {
    setAdminSecret(secret)
    setIsAuthenticated(true)
    // Store in session storage (clears when tab closes)
    sessionStorage.setItem('admin_auth', secret)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminSecret('')
    sessionStorage.removeItem('admin_auth')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminPanel adminSecret={adminSecret} onLogout={handleLogout} />
    </main>
  )
}
