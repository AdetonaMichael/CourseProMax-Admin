'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'

interface PromptOptions {
  title?: string
  message: string
  placeholder?: string
  defaultValue?: string
}

interface PromptDialogContextType {
  prompt: (options: PromptOptions) => Promise<string | null>
}

const PromptDialogContext = createContext<PromptDialogContextType | undefined>(undefined)

export const usePrompt = () => {
  const context = useContext(PromptDialogContext)
  if (!context) {
    throw new Error('usePrompt must be used within PromptDialogProvider')
  }
  return context
}

interface DialogState {
  isOpen: boolean
  options: PromptOptions
  resolve?: (value: string | null) => void
}

export const PromptDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    options: { message: '' },
  })
  const [inputValue, setInputValue] = useState('')

  const prompt = useCallback((options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setInputValue(options.defaultValue || '')
      setDialog({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = () => {
    if (dialog.resolve) {
      dialog.resolve(inputValue)
    }
    setDialog({ isOpen: false, options: { message: '' } })
    setInputValue('')
  }

  const handleCancel = () => {
    if (dialog.resolve) {
      dialog.resolve(null)
    }
    setDialog({ isOpen: false, options: { message: '' } })
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <PromptDialogContext.Provider value={{ prompt }}>
      {children}
      {dialog.isOpen && (
        <PromptDialog
          options={dialog.options}
          value={inputValue}
          onChange={setInputValue}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onKeyDown={handleKeyDown}
        />
      )}
    </PromptDialogContext.Provider>
  )
}

function PromptDialog({
  options,
  value,
  onChange,
  onConfirm,
  onCancel,
  onKeyDown,
}: {
  options: PromptOptions
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  const { title = 'Enter Information', message, placeholder } = options

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
        <div className="flex items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
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
          <p className="text-gray-700 text-sm mb-4">{message}</p>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
