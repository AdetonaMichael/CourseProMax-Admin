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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1'
          
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              channel: credentials.channel || 'web',
            }),
          })

          if (!response.ok) {
            const parsedError = await extractErrorFromResponse(response)
            throw new Error(parsedError.message)
          }

          const responseText = await response.text()
          const cleanedText = cleanJSONResponse(responseText)
          const data = JSON.parse(cleanedText)

          if (!data.data?.user || !data.data?.token) {
            throw new Error('Invalid response from server')
          }

          // Return user object with token
          return {
            id: String(data.data.user.id),
            email: data.data.user.email,
            name: `${data.data.user.first_name} ${data.data.user.last_name}`,
            image: null,
            ...data.data.user,
            accessToken: data.data.token,
          }
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Only populate on initial login when user object is available
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
      // Return null if there's no valid user data in token
      if (!token.user || !token.user.id) {
        return null as any
      }
      
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
  debug: false,
})
