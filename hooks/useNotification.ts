'use client'

import { useUIStore } from '@/store/ui.store'
import { useCallback } from 'react'

export interface AlertOptions {
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useNotification() {
  const addToast = useUIStore((state) => state.addToast)

  const success = useCallback(
    (message: string, options?: AlertOptions) => {
      return addToast({
        type: 'success',
        message,
        duration: options?.duration ?? 3000,
        action: options?.action,
      })
    },
    [addToast]
  )

  const error = useCallback(
    (message: string, options?: AlertOptions) => {
      return addToast({
        type: 'error',
        message,
        duration: options?.duration ?? 5000,
        action: options?.action,
      })
    },
    [addToast]
  )

  const info = useCallback(
    (message: string, options?: AlertOptions) => {
      return addToast({
        type: 'info',
        message,
        duration: options?.duration ?? 3000,
        action: options?.action,
      })
    },
    [addToast]
  )

  const warning = useCallback(
    (message: string, options?: AlertOptions) => {
      return addToast({
        type: 'warning',
        message,
        duration: options?.duration ?? 4000,
        action: options?.action,
      })
    },
    [addToast]
  )

  return { success, error, info, warning }
}
