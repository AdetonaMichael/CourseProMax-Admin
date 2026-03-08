/**
 * Handles API error responses with proper status code detection and field-level error extraction
 */
export interface ErrorResponse {
  status?: boolean
  success?: boolean
  statusCode?: number
  message?: string
  error?: string
  errors?: Record<string, string[]>
  data?: any
}

/**
 * Strips invalid prefixes from JSON strings (e.g., "ss{...}" -> "{...}")
 */
export function cleanJSONResponse(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    console.debug('[cleanJSONResponse] Stripped prefix from response')
    return jsonMatch[0]
  }
  return text
}

export interface ParsedAuthError {
  message: string
  statusCode: number
  fieldErrors?: Record<string, string> // field -> first error message
  isValidationError: boolean
  isUnauthorized: boolean
  isServerError: boolean
}

export function parseAuthError(error: any): ParsedAuthError {
  const statusCode = error?.statusCode || error?.status || 500
  const isValidationError = statusCode === 422
  const isUnauthorized = statusCode === 401
  const isServerError = statusCode === 500

  let message = error?.message || 'An error occurred'
  const fieldErrors: Record<string, string> = {}

  // Handle validation errors (422)
  if (isValidationError && error?.errors) {
    const errors = error.errors
    if (typeof errors === 'object' && !Array.isArray(errors)) {
      Object.entries(errors).forEach(([field, messages]: [string, any]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0]
        }
      })
    }
    // If we have field errors, use the first one as the message
    if (Object.keys(fieldErrors).length > 0) {
      message = Object.values(fieldErrors)[0]
    }
  }

  // Handle unauthorized errors (401)
  if (isUnauthorized) {
    message = error?.message || 'Invalid email or password'
  }

  // Handle server errors (500)
  if (isServerError) {
    message = `Server error: ${error?.message || 'Something went wrong'}`
  }

  return {
    message,
    statusCode,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    isValidationError,
    isUnauthorized,
    isServerError,
  }
}

/**
 * Extracts error details from a fetch response
 */
export async function extractErrorFromResponse(response: Response): Promise<ParsedAuthError> {
  const statusCode = response.status
  
  let errorData: ErrorResponse = {
    message: response.statusText || 'An error occurred',
    statusCode,
  }

  try {
    let text = await response.text()
    console.log('[extractErrorFromResponse] Raw response:', text.substring(0, 300))
    
    if (text) {
      // Strip any non-JSON characters from the beginning (e.g., "ss{" -> "{")
      text = cleanJSONResponse(text)
      errorData = JSON.parse(text)
    }
  } catch (parseErr) {
    console.error('[extractErrorFromResponse] Failed to parse error response:', parseErr)
    errorData.message = `Server error: ${response.statusText}`
  }

  // Ensure statusCode is set
  if (!errorData.statusCode) {
    errorData.statusCode = statusCode
  }

  return parseAuthError(errorData)
}
