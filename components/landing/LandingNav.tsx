'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/shared/Button'
import { LogoutButton } from '@/components/auth/LogoutButton'

export function LandingNav() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/icon.png" alt="CoursePro" className="w-10 h-10 rounded-lg group-hover:shadow-lg transition-shadow" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CoursePro</span>
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{session?.user?.first_name || 'User'}</span>
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
