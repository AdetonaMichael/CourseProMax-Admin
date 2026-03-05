'use client'

import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface UIState {
  toasts: Toast[]
  isModalOpen: boolean
  modalContent: any
  addToast: (toast: Omit<Toast, 'id'>) => void
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

    if (toast.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, toast.duration)
    }
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
