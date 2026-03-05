'use client'

import { create } from 'zustand'
import { AuthState, UserProfile } from '@/types'
import { getStoredToken, clearAuthStorage } from '@/utils/storage.utils'
import { authService } from '@/services/auth.service'

interface AuthStore extends AuthState {
  setUser: (user: UserProfile | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeAuth: () => Promise<void>
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  refreshToken: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setToken: (token) => {
    set({ token, isAuthenticated: !!token })
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  initializeAuth: async () => {
    // Skip if already initialized
    if (get().user !== null) return
    
    set({ isLoading: true })
    try {
      const token = getStoredToken()
      if (token) {
        const user = await authService.getCurrentUser()
        set({ user, token, isAuthenticated: true, isLoading: false })
      } else {
        set({ isAuthenticated: false, isLoading: false })
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
      })
      clearAuthStorage()
    }
  },

  clearAuth: () => {
    clearAuthStorage()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },
}))
