'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRoleSwitch } from '@/hooks/useRoleSwitch'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

/**
 * Role-aware route protector component
 * - Ensures user is authenticated
 * - Validates user has required role(s)
 * - Redirects to appropriate dashboard if role doesn't match
 */
export function RoleProtectedRoute({
  children,
  requiredRoles = [],
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { currentRole, hasRole } = useRoleSwitch()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    if (status === 'loading') {
      return // Still loading session
    }

    if (status === 'unauthenticated') {
      // Redirect to login
      signIn()
      return
    }

    if (status === 'authenticated' && session?.user) {
      // Check if user has required roles
      if (requiredRoles.length === 0) {
        // No specific roles required
        setIsAuthorized(true)
        setIsLoading(false)
        return
      }

      // Validate user has at least one of the required roles
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role))

      if (hasRequiredRole) {
        // User has required role
        setIsAuthorized(true)
        setIsLoading(false)
      } else {
        // User doesn't have required role - redirect to their first available dashboard
        const userRoles = session.user.roles || []
        if (userRoles.length > 0) {
          const dashboardMap: Record<string, string> = {
            admin: '/admin',
            instructor: '/instructor',
            student: '/dashboard',
            user: '/dashboard',
          }
          const destination = dashboardMap[userRoles[0]] || '/dashboard'
          router.push(destination)
        } else {
          router.push('/dashboard')
        }
      }
    }
  }, [status, session, currentRole, requiredRoles, hasRole, router])

  // Loading state
  if (isLoading || status === 'loading') {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    )
  }

  // Authorized
  return <>{children}</>
}
