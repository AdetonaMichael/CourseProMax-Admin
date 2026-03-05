const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY || 'auth_token'

/**
 * Store authentication token in localStorage
 */
export function setStoredToken(token: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      console.debug('[Storage] 💾 Token saved to localStorage - key:', TOKEN_KEY, 'length:', token.length)
    }
  } catch (error) {
    console.error('[Storage] Failed to store token:', error)
  }
}

/**
 * Get authentication token from localStorage
 */
export function getStoredToken(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY)
      console.debug('[Storage] 📖 Retrieved token from localStorage - key:', TOKEN_KEY, 'exists:', !!token, 'length:', token?.length || 0)
      return token
    }
  } catch (error) {
    console.error('[Storage] Failed to retrieve token:', error)
  }
  return null
}

/**
 * Clear all auth data from storage
 */
export function clearAuthStorage(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (error) {
    console.error('[Storage] Failed to clear storage:', error)
  }
}

/**
 * Check if token exists
 */
export function hasStoredToken(): boolean {
  return !!getStoredToken()
}
