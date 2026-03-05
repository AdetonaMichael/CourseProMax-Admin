'use client'

import { useState, useCallback } from 'react'
import { ApiError } from '@/types'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
}

export function useApi<T>(
  apiFn: () => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiFn()
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err: any) {
      const apiError: ApiError = {
        message: err?.message || 'An error occurred',
        status: err?.status || 0,
        errors: err?.errors,
      }
      setError(apiError)
      options?.onError?.(apiError)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [apiFn, options])

  return {
    data,
    isLoading,
    error,
    execute,
  }
}
