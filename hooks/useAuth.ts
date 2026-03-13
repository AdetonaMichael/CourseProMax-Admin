'use client'

import { useCallback, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { RegisterRequest } from '@/types'
import { authService } from '@/services/auth.service'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  const login = useCallback(
    async (email: string, password: string, channel: string = 'web') => {
      setIsSubmitting(true)
      setLoginError(null)
      setFieldErrors({})
      setStatusCode(null)

      try {
        const result = await signIn('credentials', {
          email,
          password,
          channel,
          redirect: false,
        })

        if (!result?.ok || result?.error) {
          let errorMsg = result?.error || 'Login failed'
          
          // Convert NextAuth error codes to user-friendly messages
          if (errorMsg === 'CredentialsSignin') {
            errorMsg = 'Invalid email or password'
          }
          
          setLoginError(errorMsg)
          setStatusCode(result?.status || 401)
          throw new Error(errorMsg)
        }

        // Update session to ensure we have the latest data
        await update()
        setIsSubmitting(false)
        
      } catch (error: any) {
        setIsSubmitting(false)
        const errorMsg = error.message || 'Login failed. Please try again.'
        setLoginError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [update]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      setIsSubmitting(true)
      setLoginError(null)

      try {
        await authService.register(data)
        
        // Auto login after registration
        await login(data.email, data.password, 'web')
      } catch (error: any) {
        setIsSubmitting(false)
        const errorMsg = error.message || 'Registration failed. Please try again.'
        setLoginError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [login]
  )

  const logout = useCallback(async () => {
    setIsSubmitting(true)
    await signOut({ redirect: false })
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
