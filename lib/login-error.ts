// Global error storage for login failures
// This is necessary because NextAuth doesn't pass error messages from authorize callback to the client
let lastLoginError: { 
  message: string
  statusCode: number
  fieldErrors?: Record<string, string>
  timestamp: number 
} | null = null

export function setLoginError(message: string, statusCode: number = 401, fieldErrors?: Record<string, string>) {
  console.log('[LoginErrorStore] Setting error:', { message, statusCode, fieldErrors })
  lastLoginError = { message, statusCode, fieldErrors, timestamp: Date.now() }
}

export function getLoginError() {
  // Only return error if it happened within the last 10 seconds
  if (lastLoginError && Date.now() - lastLoginError.timestamp < 10000) {
    console.log('[LoginErrorStore] Retrieving error:', lastLoginError)
    return lastLoginError
  }
  return null
}

export function clearLoginError() {
  console.log('[LoginErrorStore] Clearing error')
  lastLoginError = null
}

