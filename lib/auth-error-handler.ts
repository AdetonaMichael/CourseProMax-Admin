'use client'

import { signOut } from 'next-auth/react'
import { clearAuthStorage } from '@/utils/storage.utils'

/**
 * Handles authentication errors globally
 * Triggers sign-out and redirects to login on 401 error
 */
export async function handleAuthenticationError(
  statusCode: number,
  errorMessage: string = 'Authentication failed'
) {
  if (statusCode === 401 || statusCode === 403) {
    console.error('[Auth Error Handler] Handling unauthorized access:', {
      statusCode,
      errorMessage,
    })

    // Clear local storage
    clearAuthStorage()

    // Sign out via NextAuth - this will invalidate the session
    await signOut({
      redirect: true,
      callbackUrl: '/login?error=session_expired',
    })

    return false
  }

  return true
}

/**
 * Validates if user session is still valid on backend
 * Used after login or before sensitive operations
 */
export async function validateUserSession() {
  try {
    // This will check if the current user still exists on backend
    const response = await fetch('/api/auth/session')
    if (!response.ok) {
      throw new Error('Session validation failed')
    }

    const session = await response.json()
    if (!session || !session.user) {
      await handleAuthenticationError(401, 'User session is invalid')
      return null
    }

    return session
  } catch (error) {
    console.error('[Auth Validator] Failed to validate session:', error)
    await handleAuthenticationError(401, 'Failed to validate session')
    return null
  }
}
