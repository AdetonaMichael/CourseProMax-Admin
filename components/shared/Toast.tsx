'use client'

import { useEffect, useState } from 'react'
import { useUIStore, Toast as ToastType } from '@/store/ui.store'
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const alertIcons = {
  success: <Check className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

const alertStyles = {
  success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
  error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
  warning: 'bg-amber-50 border-l-4 border-amber-500 text-amber-800',
  info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
}

function Toast(toast: ToastType) {
  const { id, type, message, action } = toast
  const removeToast = useUIStore((state) => state.removeToast)
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      removeToast(id)
    }, 300)
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-lg shadow-lg
          backdrop-blur-sm max-w-sm
          ${alertStyles[type]}
        `}
        role="alert"
      >
        <div className={`flex-shrink-0 ${iconStyles[type]}`}>
          {alertIcons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium break-words">{message}</p>
          {action && (
            <button
              onClick={() => {
                action.onClick()
                handleClose()
              }}
              className="mt-2 text-sm font-medium underline hover:opacity-75 transition-opacity"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-3 max-w-md pointer-events-auto"
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
