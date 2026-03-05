'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface ProtectedPageProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AdminProtector({ children, requiredRoles = ['admin'] }: ProtectedPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else if (status === 'authenticated' && requiredRoles.length > 0) {
      const userRoles = session?.user?.roles || []
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
      
      if (!hasRequiredRole) {
        router.replace('/dashboard')
      }
    }
  }, [status, session, router, requiredRoles])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return <>{children}</>
  }

  return null
}
