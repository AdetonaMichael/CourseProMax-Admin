/**
 * Security Verification Utilities
 * Use these functions in browser console to verify authentication is working correctly
 */

// Log current authentication status
export function checkAuthStatus() {
  console.log('=== AUTHENTICATION STATUS ===')
  
  // Check localStorage
  const token = localStorage.getItem('auth_token')
  console.log('📦 localStorage auth_token:', token ? '✅ EXISTS' : '❌ MISSING')
  if (token) {
    console.log('   Token preview:', token.substring(0, 30) + '...')
    console.log('   Token length:', token.length)
  }
  
  // Check sessionStorage
  const sessionLength = sessionStorage.length
  console.log('📦 sessionStorage items:', sessionLength)
  
  // Check cookies
  const cookies = document.cookie.split(';').map(c => c.trim())
  console.log('🍪 Cookies:', cookies.length > 0 ? cookies : 'None')
  
  // Check for NextAuth session
  const nextAuthSession = localStorage.getItem('next-auth.session-token')
  console.log('🔐 NextAuth session token:', nextAuthSession ? '✅ EXISTS' : '❌ MISSING')
  
  // Check for other auth keys
  console.log('🔍 Other auth keys:')
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.includes('auth') || key.includes('token') || key.includes('role') || key.includes('session'))) {
      console.log(`   - ${key}: ${localStorage.getItem(key)?.substring(0, 30)}...`)
    }
  }
}

// Clear all auth data
export function clearAllAuth() {
  console.log('🧹 Clearing all authentication data...')
  
  // Clear localStorage
  const keysToDelete = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.includes('auth') || key.includes('token') || key.includes('role') || key.includes('session'))) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => {
    localStorage.removeItem(key)
    console.log(`   ✅ Removed: ${key}`)
  })
  
  // Clear sessionStorage
  sessionStorage.clear()
  console.log('   ✅ Cleared sessionStorage')
  
  console.log('✨ All authentication data cleared')
  console.log('🔄 Redirecting to login...')
  window.location.href = '/login'
}

// Test API authentication
export async function testApiAuth() {
  console.log('🧪 Testing API authentication...')
  
  const token = localStorage.getItem('auth_token')
  if (!token) {
    console.error('❌ No token found in localStorage')
    return
  }
  
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('📡 API Response Status:', response.status, response.statusText)
    const data = await response.json()
    console.log('📡 API Response:', data)
    
    if (response.status === 401) {
      console.error('❌ API returned 401 Unauthorized - session is invalid or expired')
      console.log('🧹 Clearing all auth data...')
      clearAllAuth()
    }
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

// Simulate logout
export async function simulateLogout() {
  console.log('🔓 Simulating logout...')
  clearAllAuth()
}

// Check middleware protection
export function checkMiddlewareProtection() {
  const currentPath = window.location.pathname
  console.log('📍 Current path:', currentPath)
  
  const protectedRoutes = ['/admin', '/instructor', '/dashboard']
  const isProtected = protectedRoutes.some(route => currentPath.startsWith(route))
  
  console.log(`🔒 Is protected route: ${isProtected ? '✅ YES' : '❌ NO'}`)
  
  if (isProtected) {
    console.log('⚠️  This route should redirect unauthenticated users to /login')
  }
}

console.log(`
╔════════════════════════════════════════════════════════════╗
║         SECURITY VERIFICATION UTILITIES LOADED             ║
╠════════════════════════════════════════════════════════════╣
║ Available commands:                                        ║
║  • checkAuthStatus()        - Check current auth status   ║
║  • clearAllAuth()           - Clear all auth data         ║
║  • testApiAuth()            - Test API authentication     ║
║  • simulateLogout()         - Simulate logout             ║
║  • checkMiddlewareProtection() - Check route protection   ║
╚════════════════════════════════════════════════════════════╝
`)
