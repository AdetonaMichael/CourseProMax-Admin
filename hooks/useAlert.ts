import { useState, useCallback } from 'react'
import { alertManager } from '@/components/shared/AlertContainer'

export const useAlert = () => {
  const show = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.show(type, message, options)
  }, [])

  const success = useCallback((message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.success(message, options)
  }, [])

  const error = useCallback((message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.error(message, options)
  }, [])

  const warning = useCallback((message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.warning(message, options)
  }, [])

  const info = useCallback((message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.info(message, options)
  }, [])

  const dismiss = useCallback((id: string) => {
    alertManager.dismiss(id)
  }, [])

  const clear = useCallback(() => {
    alertManager.clear()
  }, [])

  return { show, success, error, warning, info, dismiss, clear }
}
