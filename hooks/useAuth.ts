'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { RegisterRequest } from '@/types'
import { authService } from '@/services/auth.service'
import { setStoredToken } from '@/utils/storage.utils'

function redirectByRole(role: string, router: any) {
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
  const [loginError, setLoginError] = useState<string | null>(null)

  const login = useCallback(
    async (email: string, password: string, channel: string = 'web') => {
      setLoginError(null)
      try {
        console.log('[useAuth] Attempting login for:', email)
        
        const result = await signIn('credentials', {
          email,
          password,
          channel,
          redirect: false,
        })

        console.log('[useAuth] signIn result:', { ok: result?.ok, error: result?.error, status: result?.status })

        if (!result?.ok || result?.error) {
          // NextAuth error messages are in result.error - format them nicely
          let errorMsg = result?.error || 'Login failed'
          
          // Map common NextAuth errors to user-friendly messages
          if (errorMsg === 'CredentialsSignin') {
            errorMsg = 'Invalid email or password'
          }
          
          setLoginError(errorMsg)
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
          freshSessionData = await sessionResponse.json()
          
          console.log('[useAuth] Fresh session data retrieved')
          console.log('[useAuth] Token in fresh session:', !!freshSessionData?.accessToken)
          
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
              const role = freshSessionData.user.roles[0]
              redirectByRole(role, router)
            } else {
              redirectByRole('user', router)
            }
          } catch (err) {
            console.error('[useAuth] Error during redirect:', err)
            redirectByRole('user', router)
          }
        }, 200)
      } catch (error: any) {
        const errorMsg = error.message || 'Login failed. Please try again.'
        console.error('[useAuth] Login error:', errorMsg)
        setLoginError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [router, update]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
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
        throw new Error(errorMsg)
      }
    },
    [login]
  )

  const logout = useCallback(async () => {
    console.log('[useAuth] Logging out...')
    await signOut({ redirect: true, callbackUrl: '/login' })
  }, [])

  return {
    user: session?.user || null,
    token: session?.accessToken || null,
    isAuthenticated,
    isLoading,
    error: loginError,
    login,
    register,
    logout,
  }
}
