'use client'

import { useUIStore } from '@/store/ui.store'
import { useCallback } from 'react'

export function useNotification() {
  const addToast = useUIStore((state) => state.addToast)

  const success = useCallback(
    (message: string, duration = 3000) => {
      addToast({
        type: 'success',
        message,
        duration,
      })
    },
    [addToast]
  )

  const error = useCallback(
    (message: string, duration = 5000) => {
      addToast({
        type: 'error',
        message,
        duration,
      })
    },
    [addToast]
  )

  const info = useCallback(
    (message: string, duration = 3000) => {
      addToast({
        type: 'info',
        message,
        duration,
      })
    },
    [addToast]
  )

  const warning = useCallback(
    (message: string, duration = 4000) => {
      addToast({
        type: 'warning',
        message,
        duration,
      })
    },
    [addToast]
  )

  return { success, error, info, warning }
}
