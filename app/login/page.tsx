'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.roles?.[0] || 'user'
      switch (role) {
        case 'admin':
          router.replace('/admin')
          break
        case 'instructor':
          router.replace('/instructor')
          break
        default:
          router.replace('/dashboard')
      }
    }
  }, [status, session, router])

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  // Only show login form if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }

  return null
}
