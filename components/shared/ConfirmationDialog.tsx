'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'

interface ConfirmationOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

interface ConfirmationDialogContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(undefined)

export const useConfirmation = () => {
  const context = useContext(ConfirmationDialogContext)
  if (!context) {
    throw new Error('useConfirmation must be used within ConfirmationDialogProvider')
  }
  return context
}

interface DialogState {
  isOpen: boolean
  options: ConfirmationOptions
  resolve?: (value: boolean) => void
}

export const ConfirmationDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    options: {},
  })

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = () => {
    if (dialog.resolve) {
      dialog.resolve(true)
    }
    setDialog({ isOpen: false, options: {} })
  }

  const handleCancel = () => {
    if (dialog.resolve) {
      dialog.resolve(false)
    }
    setDialog({ isOpen: false, options: {} })
  }

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      {children}
      {dialog.isOpen && (
        <ConfirmationDialog
          options={dialog.options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationDialogContext.Provider>
  )
}

function ConfirmationDialog({
  options,
  onConfirm,
  onCancel,
}: {
  options: ConfirmationOptions
  onConfirm: () => void
  onCancel: () => void
}) {
  const {
    title = 'Confirm Action',
    description = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDangerous = false,
  } = options

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`flex items-start p-6 border-b ${isDangerous ? 'border-red-200' : 'border-gray-200'}`}>
          {isDangerous && (
            <div className="flex-shrink-0 mr-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          )}
          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${isDangerous ? 'text-red-900' : 'text-gray-900'}`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-sm">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
              ${isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
