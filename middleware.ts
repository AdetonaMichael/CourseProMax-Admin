import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/admin', '/instructor', '/dashboard']
const publicRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()
  
  // Only authenticated if session exists AND has a valid user with an ID and email
  const isAuthenticated = !!(session?.user?.id && session?.user?.email && session?.user)

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  
  // 1. CRITICAL: Redirect unauthenticated users FIRST - before any other checks
  if (isProtectedRoute && !isAuthenticated) {
    console.log('[Middleware] 🚫 Unauthenticated access attempt to protected route:', pathname)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Redirect authenticated users away from login/register to prevent ping-pongs
  if (isAuthenticated && publicRoutes.some(route => pathname.startsWith(route))) {
    const role = session.user?.roles?.[0]
    let redirectPath = '/dashboard'
    
    if (role === 'admin') {
      redirectPath = '/admin'
    } else if (role === 'instructor') {
      redirectPath = '/instructor'
    }

    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // 3. Role-based route protection - ensure users only access routes they have permissions for
  if (isAuthenticated) {
    // Admin route protection - only users with 'admin' role can access /admin/**
    if (pathname.startsWith('/admin')) {
      const isAdmin = session.user?.roles?.includes('admin')
      if (!isAdmin) {
        console.log('[Middleware] 🚫 Non-admin access attempt to /admin:', session.user?.email)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Instructor route protection - only users with 'instructor' role can access /instructor/**
    if (pathname.startsWith('/instructor')) {
      const isInstructor = session.user?.roles?.includes('instructor')
      if (!isInstructor) {
        console.log('[Middleware] 🚫 Non-instructor access attempt to /instructor:', session.user?.email)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static assets and next internals
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
