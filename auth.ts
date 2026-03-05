import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import { UserProfile } from '@/types'

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[Auth] Missing email or password')
          throw new Error('Email and password are required')
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1'
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

          const data = await response.json()
          console.log('[Auth] API Response:', { status: response.status, statusText: response.statusText, hasData: !!data })

          if (!response.ok) {
            const errorMsg = data?.message || response.statusText || 'Login failed'
            console.error('[Auth] Login failed with status', response.status, ':', errorMsg)
            throw new Error(errorMsg)
          }

          if (!data.data || !data.data.user || !data.data.token) {
            console.error('[Auth] Invalid response structure:', JSON.stringify(data).substring(0, 200))
            throw new Error('Invalid response from server. Please contact support.')
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
          console.error('[Auth] Authorization error:', errorMsg)
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
