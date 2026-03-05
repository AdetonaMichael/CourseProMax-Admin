'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string | string[]
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { hasRole } = useRole()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback || <UnauthorizedPage />}</>
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">403</h1>
      <p className="text-gray-600 mt-4">You don't have permission to access this page</p>
    </div>
  )
}
