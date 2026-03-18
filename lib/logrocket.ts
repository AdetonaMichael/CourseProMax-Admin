import LogRocket from 'logrocket'

const LOGROCKET_APP_ID = 'vznozl/coursepromax-web'
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Initialize LogRocket only in production environment
 */
export const initializeLogRocket = () => {
  if (!isProduction) {
    console.log('[LogRocket] Skipped initialization (development environment)')
    return
  }

  try {
    LogRocket.init(LOGROCKET_APP_ID, {
      console: {
        shouldAggregateConsoleErrors: true,
      },
      network: {
        requestSanitizer: (request) => {
          // Don't log auth tokens or sensitive headers
          if (request.headers) {
            delete request.headers['Authorization']
          }
          return request
        },
        responseSanitizer: (response) => {
          return response
        },
      },
    })

    console.log('[LogRocket] Initialized successfully in production')
  } catch (error) {
    console.error('[LogRocket] Failed to initialize:', error)
  }
}

/**
 * Identify the current user in LogRocket
 * Call this after user authentication
 */
export const identifyUserInLogRocket = (
  userId: string,
  email?: string,
  name?: string,
  role?: string
) => {
  if (!isProduction) {
    console.log('[LogRocket] User identification skipped (development environment)')
    return
  }

  try {
    const userData: Record<string, string | number | boolean> = {
      environment: process.env.NODE_ENV || 'development',
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    }

    if (email) userData.email = email
    if (name) userData.name = name
    if (role) userData.role = role

    LogRocket.identify(userId, userData)

    console.log('[LogRocket] User identified:', { userId, email, role })
  } catch (error) {
    console.error('[LogRocket] Failed to identify user:', error)
  }
}

/**
 * Log custom events to LogRocket
 */
export const logRocketEvent = (eventName: string, data?: Record<string, any>) => {
  if (!isProduction) {
    console.log(`[LogRocket] Event skipped (development): ${eventName}`, data)
    return
  }

  try {
    // Create a custom error object for the event
    const eventError = new Error(`[CustomEvent] ${eventName}`)
    LogRocket.captureException(eventError, {
      tags: {
        eventType: 'custom',
      },
      extra: data || {},
    })
  } catch (error) {
    console.error('[LogRocket] Failed to log event:', error)
  }
}

/**
 * Capture an error to LogRocket
 */
export const captureLogRocketError = (error: Error | string, context?: Record<string, any>) => {
  if (!isProduction) {
    console.error('[LogRocket] Error skipped (development):', error, context)
    return
  }

  try {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    LogRocket.captureException(errorObj, {
      extra: context,
    })

    console.error('[LogRocket] Error captured:', errorObj, context)
  } catch (err) {
    console.error('[LogRocket] Failed to capture error:', err)
  }
}

export default LogRocket
