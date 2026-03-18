'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { initializeLogRocket, identifyUserInLogRocket } from '@/lib/logrocket'

/**
 * Client component that initializes LogRocket and identifies users
 * This should be used at the root level after AuthProvider
 */
export function LogRocketProvider() {
  const { data: session, status } = useSession()

  // Initialize LogRocket on app mount (once)
  useEffect(() => {
    initializeLogRocket()
  }, [])

  // Identify user when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user
      identifyUserInLogRocket(
        user.id || user.email || 'unknown',
        user.email,
        user.name,
        (user as any).role || 'user'
      )
    }
  }, [status, session])

  // This component doesn't render anything
  return null
}
