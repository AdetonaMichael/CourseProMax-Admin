'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

interface SessionErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorState {
  hasError: boolean
  error: Error | null
  isSessionError: boolean
}

/**
 * Enhanced error boundary that handles session expiration and authentication errors
 * Automatically redirects to login on 401 errors
 */
export class SessionErrorBoundary extends React.Component<
  SessionErrorBoundaryProps,
  ErrorState
> {
  private redirectTimer: NodeJS.Timeout | undefined

  constructor(props: SessionErrorBoundaryProps) {
    super(props)
    this.redirectTimer = undefined
    this.state = {
      hasError: false,
      error: null,
      isSessionError: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    const isSessionError =
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('session') ||
      error.message?.includes('SESSION_EXPIRED')

    return {
      hasError: true,
      error,
      isSessionError,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[SessionErrorBoundary] Error caught:', error, errorInfo)

    if (this.state.isSessionError && !this.redirectTimer) {
      // Redirect to login after a short delay
      this.redirectTimer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=session_expired'
        }
      }, 1500)
    }
  }

  componentWillUnmount() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    const { hasError, error, isSessionError } = this.state

    if (hasError) {
      if (isSessionError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Expired</h2>
              <p className="text-gray-600 text-sm mb-6">
                Your session has expired. You'll be redirected to login shortly.
              </p>
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Redirecting...</span>
              </div>
            </div>
          </div>
        )
      }

      // Generic error
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm">
            <div className="mb-4 flex justify-center">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              {error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
