'use client'

import { signOut as nextAuthSignOut } from 'next-auth/react'
import { clearAuthStorage } from '@/utils/storage.utils'

/**
 * Comprehensive logout function that ensures all auth data is cleared
 * - Clears NextAuth session
 * - Clears localStorage tokens
 * - Clears sessionStorage
 * - Redirects to login page
 */
export async function logout() {
  try {
    console.log('[Logout] Starting comprehensive logout...')
    
    // 1. Clear all client-side storage
    clearAuthStorage()
    
    // 2. Clear NextAuth session and sign out
    console.log('[Logout] Signing out via NextAuth...')
    await nextAuthSignOut({
      redirect: false, // We'll handle redirect manually
    })
    
    // 3. Force page reload to ensure all state is reset
    // This ensures cookies are cleared and any cached data is invalidated
    if (typeof window !== 'undefined') {
      console.log('[Logout] Redirecting to login page...')
      window.location.href = '/login?logout=true'
    }
  } catch (error) {
    console.error('[Logout] Error during logout:', error)
    // Fallback: redirect anyway
    if (typeof window !== 'undefined') {
      window.location.href = '/login?logout=true'
    }
  }
}

/**
 * Silent logout handler - doesn't show any UI, just clears everything
 * Used when session expires or 401 is received from API
 */
export async function silentLogout() {
  try {
    // Clear storage
    clearAuthStorage()
    
    // Sign out (non-blocking)
    nextAuthSignOut({ redirect: false })
    
    // Redirect silently
    if (typeof window !== 'undefined') {
      window.location.href = '/login?error=session_expired'
    }
  } catch (error) {
    console.error('[Silent Logout] Error:', error)
  }
}
