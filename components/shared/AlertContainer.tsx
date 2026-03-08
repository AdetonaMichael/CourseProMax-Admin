'use client'

import React, { useState, useCallback } from 'react'
import { AlertCircle, Check, AlertTriangle, InfoIcon, X } from 'lucide-react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface AlertConfig {
  id: string
  type: AlertType
  message: string
  title?: string
  duration?: number | null
  actions?: React.ReactNode
}

type AlertListener = (alerts: AlertConfig[]) => void

let alertId = 0
const listeners: Set<AlertListener> = new Set()
let alerts: AlertConfig[] = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...alerts]))
}

export const alertManager = {
  subscribe: (listener: AlertListener) => {
    listeners.add(listener)
    listener([...alerts])
    return () => {
      listeners.delete(listener)
    }
  },

  show: (type: AlertType, message: string, options?: { title?: string; duration?: number | null }) => {
    const id = `alert-${alertId++}`
    const alert: AlertConfig = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration !== undefined ? options.duration : 3000,
    }

    alerts.push(alert)
    notifyListeners()

    if (alert.duration) {
      setTimeout(() => {
        alertManager.dismiss(id)
      }, alert.duration)
    }

    return id
  },

  dismiss: (id: string) => {
    alerts = alerts.filter((a) => a.id !== id)
    notifyListeners()
  },

  success: (message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.show('success', message, { title: options?.title || 'Success', duration: options?.duration })
  },

  error: (message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.show('error', message, { title: options?.title || 'Error', duration: options?.duration })
  },

  warning: (message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.show('warning', message, { title: options?.title || 'Warning', duration: options?.duration })
  },

  info: (message: string, options?: { title?: string; duration?: number | null }) => {
    return alertManager.show('info', message, { title: options?.title || 'Information', duration: options?.duration })
  },

  clear: () => {
    alerts = []
    notifyListeners()
  },
}

const getIcon = (type: AlertType) => {
  switch (type) {
    case 'success':
      return <Check className="w-5 h-5" />
    case 'error':
      return <AlertCircle className="w-5 h-5" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />
    case 'info':
      return <InfoIcon className="w-5 h-5" />
  }
}

const getColors = (type: AlertType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
      }
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
      }
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
      }
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
      }
  }
}

function AlertItem({ alert, onDismiss }: { alert: AlertConfig; onDismiss: () => void }) {
  const colors = getColors(alert.type)

  return (
    <div
      className={`
        ${colors.bg} ${colors.border} ${colors.text}
        border rounded-lg shadow-md p-4 mb-3 flex items-start gap-3
        animate-in fade-in slide-in-from-top-2 duration-300
      `}
    >
      <div className={`mt-0.5 flex-shrink-0 ${colors.icon}`}>{getIcon(alert.type)}</div>
      <div className="flex-1">
        {alert.title && <p className="font-semibold text-sm">{alert.title}</p>}
        <p className={alert.title ? 'text-sm mt-1' : 'text-sm'}>{alert.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`ml-2 flex-shrink-0 ${colors.icon} hover:opacity-70 transition-opacity`}
        aria-label="Dismiss alert"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export function AlertContainer() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([])

  React.useEffect(() => {
    return alertManager.subscribe(setAlerts)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full max-h-screen overflow-y-auto">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={() => alertManager.dismiss(alert.id)}
        />
      ))}
    </div>
  )
}
