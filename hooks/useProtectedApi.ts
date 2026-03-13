'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clearAuthStorage } from '@/utils/storage.utils'

/**
 * Hook for making protected API calls
 * Automatically handles 401 responses by logging out and redirecting
 */
export function useProtectedApi() {
  const router = useRouter()
  const isHandlingLogout = useRef(false)

  const handleUnauthorized = useCallback(async () => {
    // Prevent multiple simultaneous logouts
    if (isHandlingLogout.current) {
      return
    }
    isHandlingLogout.current = true

    try {
      console.warn('[Protected API] 401 Unauthorized - logging out user')
      
      // Clear local storage
      clearAuthStorage()
      
      // Sign out via NextAuth
      await signOut({
        redirect: false,
      })
      
      // Redirect to login
      router.push('/login?error=session_expired')
    } catch (error) {
      console.error('[Protected API] Error during logout:', error)
      // Fallback: redirect directly
      window.location.href = '/login?error=session_expired'
    } finally {
      isHandlingLogout.current = false
    }
  }, [router])

  const makeRequest = useCallback(
    async <T,>(
      fetchFn: () => Promise<T>,
      options?: {
        onError?: (error: any) => void
        retryCount?: number
      }
    ): Promise<T | null> => {
      try {
        const result = await fetchFn()
        return result
      } catch (error: any) {
        // Check for 401 Unauthorized
        if (error?.status === 401 || error?.response?.status === 401) {
          await handleUnauthorized()
          return null
        }

        // Retry logic if needed
        if (options?.retryCount && options.retryCount > 0) {
          console.warn('[Protected API] Retrying request...')
          const delay = Math.pow(2, 3 - options.retryCount) * 1000 // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          return makeRequest(fetchFn, { ...options, retryCount: options.retryCount - 1 })
        }

        // Call error handler if provided
        options?.onError?.(error)
        throw error
      }
    },
    [handleUnauthorized]
  )

  return {
    makeRequest,
    handleUnauthorized,
  }
}
