'use client'

import { useUIStore } from '@/store/ui.store'

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)
  const removeToast = useUIStore((state) => state.removeToast)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg text-white shadow-lg animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
