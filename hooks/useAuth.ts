'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { RegisterRequest } from '@/types'
import { authService } from '@/services/auth.service'
import { setStoredToken } from '@/utils/storage.utils'
import { cleanJSONResponse } from '@/lib/error-handler'

function redirectByRole(role: string, router: any, hasMultipleRoles: boolean = false) {
  // If user has multiple roles, stay on a neutral page to show role switcher
  if (hasMultipleRoles) {
    router.push('/dashboard')
    return
  }

  // Otherwise redirect to role-specific dashboard
  switch (role) {
    case 'admin':
      router.push('/admin')
      break
    case 'instructor':
      router.push('/instructor')
      break
    case 'user':
    default:
      router.push('/dashboard')
      break
  }
}

export function useAuth() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const login = useCallback(
    async (email: string, password: string, channel: string = 'web') => {
      setIsSubmitting(true)
      setLoginError(null)
      setFieldErrors({})
      setStatusCode(null)
      try {
        console.log('[useAuth] Attempting login for:', email)
        console.log('[useAuth] signIn params:', { email, channel, redirect: false })
        
        const result = await signIn('credentials', {
          email,
          password,
          channel,
          redirect: false,
        })

        console.log('[useAuth] signIn result:', { ok: result?.ok, error: result?.error, status: result?.status })
        console.log('[useAuth] Full signIn result object:', JSON.stringify(result, null, 2))

        if (!result?.ok || result?.error) {
          // Handle login error with fallback for NextAuth errors
          let errorMsg = result?.error || 'Login failed'
          
          // Convert NextAuth error codes to user-friendly messages
          if (errorMsg === 'CredentialsSignin') {
            errorMsg = 'Invalid email or password'
          }
          
          setLoginError(errorMsg)
          setFieldErrors({})
          setStatusCode(result?.status || 401)
          setIsSubmitting(false)
          throw new Error(errorMsg)
        }

        console.log('[useAuth] Login successful, updating session...')
        
        // Update session
        const updatedSession = await update()
        console.log('[useAuth] Session updated:', !!updatedSession)
        
        // CRITICAL: Directly fetch fresh session to ensure we have the token
        let freshSessionData: any = null
        try {
          const sessionResponse = await fetch('/api/auth/session')
          const sessionText = await sessionResponse.text()
          console.log('[useAuth] Session API raw response:', sessionText.substring(0, 300))
          
          try {
            const cleanedText = cleanJSONResponse(sessionText)
            freshSessionData = JSON.parse(cleanedText)
          } catch (parseErr) {
            console.error('[useAuth] Failed to parse session response:', parseErr)
            console.error('[useAuth] Response was:', sessionText.substring(0, 200))
            throw new Error('Failed to parse session data')
          }

          if (freshSessionData?.accessToken) {
            console.log('[useAuth] 💾 Saving token to localStorage...')
            setStoredToken(freshSessionData.accessToken)
            console.log('[useAuth] ✅ Token successfully saved to localStorage')
            
            // Verify
            const verify = localStorage.getItem('auth_token')
            console.log('[useAuth] 🔍 Verification - token in localStorage:', !!verify, 'length:', verify?.length)
          } else {
            console.error('[useAuth] ❌ No token in fresh session!', freshSessionData)
          }
        } catch (sessionErr) {
          console.error('[useAuth] Error fetching fresh session:', sessionErr)
        }
        
        // Redirect after a brief delay to ensure token is saved
        setTimeout(() => {
          try {
            if (freshSessionData?.user?.roles?.length > 0) {
              const roles = freshSessionData.user.roles
              const hasMultipleRoles = roles.length > 1
              
              // Set initial role for role switcher
              const initialRole = roles[0]
              localStorage.setItem('current_role', initialRole)
              localStorage.setItem('role_switched_at', new Date().toISOString())
              
              console.log('[useAuth] 🔄 Initial role set:', initialRole)
              console.log('[useAuth] 📊 User has', roles.length, 'role(s):', roles.join(', '))
              
              redirectByRole(initialRole, router, hasMultipleRoles)
            } else {
              redirectByRole('user', router, false)
            }
          } catch (err) {
            console.error('[useAuth] Error during redirect:', err)
            redirectByRole('user', router, false)
          }
        }, 200)
      } catch (error: any) {
        const errorMsg = error.message || 'Login failed. Please try again.'
        
        // Log more details
        if (error.stack) {
          console.error('[useAuth] Error stack:', error.stack)
        }
        
        setLoginError(errorMsg)
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
    },
    [router, update]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      setIsSubmitting(true)
      setLoginError(null)
      try {
        console.log('[useAuth] Attempting registration for:', data.email)
        
        await authService.register(data)
        
        console.log('[useAuth] Registration successful, attempting auto-login...')
        
        // Auto login after registration
        await login(data.email, data.password, 'web')
      } catch (error: any) {
        const errorMsg = error.message || 'Registration failed. Please try again.'
        console.error('[useAuth] Registration error:', errorMsg)
        setLoginError(errorMsg)
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
    },
    [login]
  )

  const logout = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // Clear role switching data before logout
      localStorage.removeItem('current_role')
      localStorage.removeItem('role_switched_at')
      console.log('[useAuth] Logging out and clearing role data...')
    } catch (error) {
      console.error('[useAuth] Error clearing role data:', error)
    }
    await signOut({ redirect: true, callbackUrl: '/login' })
    setIsSubmitting(false)
  }, [])

  return {
    user: session?.user || null,
    token: session?.accessToken || null,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error: loginError,
    fieldErrors,
    statusCode,
    login,
    register,
    logout,
  }
}
