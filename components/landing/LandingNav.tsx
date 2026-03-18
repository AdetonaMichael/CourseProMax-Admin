'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/shared/Button'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Download, User, Home as HomeIcon } from 'lucide-react'

export function LandingNav() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const user = session?.user
  const roles = user?.roles || []
  const isAdmin = roles.includes('admin')
  const isInstructor = roles.includes('instructor')
  
  // Determine dashboard path based on role
  const getDashboardPath = () => {
    if (isAdmin) return '/admin'
    if (isInstructor) return '/instructor'
    return '/dashboard'
  }

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/icon.png" alt="CoursePro" className="w-10 h-10 rounded-lg group-hover:shadow-lg transition-shadow" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CoursePro</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-500">Welcome back</p>
                  <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                </div>
              </div>

              {/* Dashboard Button */}
              <Link href={getDashboardPath()} className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity no-underline text-sm font-medium">
                <HomeIcon size={16} className="shrink-0" />
                <span className="hidden sm:inline">Go to {isAdmin ? 'Admin' : isInstructor ? 'Instructor' : ''} Dashboard</span>
              </Link>

              {/* Download Button */}
              <a href="https://tinyurl.com/34sjfar7" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </a>

              {/* Logout Button */}
              <LogoutButton />
            </>
          ) : (
            <>
              {/* Download Button (visible for unauthenticated users) */}
              <a href="https://tinyurl.com/34sjfar7" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </a>

              {/* Auth Buttons */}
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
