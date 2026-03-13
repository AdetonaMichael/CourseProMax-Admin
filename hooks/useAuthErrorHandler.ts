'use client'

import { useCallback, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Hook to handle 401 authentication errors globally
 * Ensures user is logged out and redirected to login page
 */
export function useAuthErrorHandler() {
  const { status } = useSession()
  const router = useRouter()
  const signOutTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleAuthError = useCallback(
    async (error: any, errorMessage: string = 'Session expired') => {
      const statusCode = error?.status || error?.response?.status

      if (statusCode === 401 || statusCode === 403) {
        console.error('[Auth Error Handler] Handling 401/403 error:', {
          statusCode,
          message: errorMessage,
        })

        // Clear any pending timeouts
        if (signOutTimeoutRef.current) {
          clearTimeout(signOutTimeoutRef.current)
        }

        // Sign out and redirect to login with error message
        signOutTimeoutRef.current = setTimeout(async () => {
          try {
            await signOut({
              redirect: false,
              callbackUrl: '/login',
            })
            router.push(`/login?error=${encodeURIComponent(errorMessage)}`)
          } catch (err) {
            console.error('[Auth Error Handler] Failed to sign out:', err)
            // Fallback redirect
            router.push('/login?error=session_expired')
          }
        }, 300) // Small delay to ensure cleanup

        return true
      }

      return false
    },
    [router, status]
  )

  return { handleAuthError }
}
