import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import { UserProfile } from '@/types'
import { extractErrorFromResponse, cleanJSONResponse } from '@/lib/error-handler'

declare module 'next-auth' {
  interface Session {
    user?: UserProfile & {
      emailVerified?: string | null
    }
    accessToken?: string
  }
  
  interface User {
    accessToken?: string
    [key: string]: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    user?: UserProfile
  }
}

console.log('[Auth] NextAuth configuration loading...')
console.log('[Auth] Environment check:')
console.log('[Auth]   NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✓' : '✗')
console.log('[Auth]   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓' : '✗')
console.log('[Auth]   NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL ? '✓' : '✗')

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        channel: { label: 'Channel', type: 'text' },
      },
      async authorize(credentials: any) {
        console.log('[Auth] ===== AUTHORIZE CALLED =====')
        console.log('[Auth] Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password, channel: credentials?.channel })
        
        if (!credentials?.email || !credentials?.password) {
          const errorMsg = 'Email and password are required'
          console.error('[Auth] Missing credentials validation failed')
          throw new Error(errorMsg)
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1'
          console.log('[Auth] API_URL:', apiUrl)
          console.log('[Auth] NEXTAUTH_URL env:', process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET')
          console.log('[Auth] NEXTAUTH_SECRET env:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
          console.log('[Auth] Attempting login to:', `${apiUrl}/auth/login`)
          
          const response = await fetch(
            `${apiUrl}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                channel: credentials.channel || 'web',
              }),
            }
          )

          console.log('[Auth] API Response Status:', response.status, response.statusText)

          if (!response.ok) {
            // Use the error handler to parse the error properly
            const parsedError = await extractErrorFromResponse(response)
            console.error('[Auth] Login failed:', {
              statusCode: parsedError.statusCode,
              message: parsedError.message,
              isValidation: parsedError.isValidationError,
              fieldErrors: parsedError.fieldErrors,
            })
            
            throw new Error(parsedError.message)
          }

          // Parse successful response
          const responseText = await response.text()
          console.log('[Auth] Raw response text:', responseText.substring(0, 500))
          
          let data
          try {
            // Strip any non-JSON characters from the beginning (e.g., "ss{" -> "{")
            const cleanedText = cleanJSONResponse(responseText)
            data = JSON.parse(cleanedText)
          } catch (parseErr) {
            const errorMsg = `API response is not valid JSON: ${responseText.substring(0, 100)}`
            console.error('[Auth] JSON parsing error:', errorMsg, parseErr)
            throw new Error(errorMsg)
          }

          if (!data.data || !data.data.user || !data.data.token) {
            const errorMsg = 'Invalid response from server. Please contact support.'
            console.error('[Auth] Invalid response structure:', JSON.stringify(data).substring(0, 200))
            throw new Error(errorMsg)
          }

          console.log('[Auth] Login successful for user:', data.data.user.email)

          return {
            id: String(data.data.user.id),
            email: data.data.user.email,
            name: `${data.data.user.first_name} ${data.data.user.last_name}`,
            image: null,
            ...data.data.user,
            accessToken: data.data.token,
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Authentication failed'
          console.error('[Auth] ===== AUTHORIZE ERROR =====')
          console.error('[Auth] Error message:', errorMsg)
          console.error('[Auth] Error type:', typeof error)
          console.error('[Auth] Error object:', error)
          console.error('[Auth] Error keys:', Object.keys(error))
          if (error.cause) {
            console.error('[Auth] Error cause:', error.cause)
          }
          if (error.stack) {
            console.error('[Auth] Error stack:', error.stack)
          }
          throw new Error(errorMsg)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('[Auth] JWT callback - user:', !!user, 'token email:', token.email)
      
      if (user) {
        token.accessToken = (user as any).accessToken
        token.user = {
          id: (user as any).id,
          first_name: (user as any).first_name,
          last_name: (user as any).last_name,
          email: (user as any).email,
          phone_number: (user as any).phone_number,
          email_verified_at: (user as any).email_verified_at,
          phone_verified_at: (user as any).phone_verified_at,
          isPhoneVerified: (user as any).isPhoneVerified,
          isEmailVerified: (user as any).isEmailVerified,
          created_at: (user as any).created_at,
          updated_at: (user as any).updated_at,
          roles: (user as any).roles || [],
          permissions: (user as any).permissions || [],
          balance: (user as any).balance,
          formatted_balance: (user as any).formatted_balance,
          avatar_url: (user as any).avatar_url,
          bio: (user as any).bio,
          status: (user as any).status,
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      console.log('[Auth] Session callback - user:', !!token.user)
      
      if (token.user && session.user) {
        session.user = token.user as any
        session.accessToken = token.accessToken
      }
      
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logging
})
