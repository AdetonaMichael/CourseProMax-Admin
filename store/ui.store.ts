'use client'

import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface UIState {
  toasts: Toast[]
  isModalOpen: boolean
  modalContent: any
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  openModal: (content: any) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isModalOpen: false,
  modalContent: null,

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))

    // Auto-dismiss with default durations if not specified
    const duration = toast.duration ?? (
      toast.type === 'success' ? 3000 :
      toast.type === 'error' ? 5000 :
      toast.type === 'warning' ? 4000 :
      3000
    )

    const timeoutId = setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  openModal: (content) => {
    set({
      isModalOpen: true,
      modalContent: content,
    })
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      modalContent: null,
    })
  },
}))
