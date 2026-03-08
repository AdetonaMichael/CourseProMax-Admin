import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[Diagnostics] Checking auth configuration...')
    
    // Check environment variables
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    console.log('[Diagnostics] Environment variables:')
    console.log('  NEXTAUTH_URL:', nextAuthUrl ? '✓ SET' : '✗ MISSING')
    console.log('  NEXTAUTH_SECRET:', nextAuthSecret ? '✓ SET' : '✗ MISSING')
    console.log('  NEXT_PUBLIC_API_URL:', apiUrl ? '✓ SET' : '✗ MISSING')
    
    // Try to get session
    const session = await auth()
    
    return NextResponse.json({
      status: 'ok',
      environment: {
        nextAuthUrl: nextAuthUrl ? 'SET' : 'MISSING',
        nextAuthSecret: nextAuthSecret ? 'SET' : 'MISSING',
        apiUrl: apiUrl || 'NOT SET',
        nodeEnv: process.env.NODE_ENV,
      },
      session: session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED',
    })
  } catch (err) {
    console.error('[Diagnostics] Error:', err)
    return NextResponse.json({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
