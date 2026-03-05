'use client'

import { apiClient } from './api-client'
import {
  RegisterRequest,
  RegisterResponse,
  UserProfile,
} from '@/types'
import { setStoredToken } from '@/utils/storage.utils'

interface ApiResponse<T> {
  status: boolean
  success?: boolean
  message: string
  data: T
}

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<ApiResponse<{
        token: string
        user: UserProfile
      }>>('/auth/register', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        password_confirmation: data.password_confirmation
      })
      
      const { token, user } = response.data.data
      
      if (token) {
        setStoredToken(token)
      }
      
      return {
        status: response.data.status,
        message: response.data.message,
        data: {
          token,
          user
        }
      }
    } catch (error: any) {
      const errorMessage = this.extractErrorMessage(error)
      console.error('[AuthService] Registration failed:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me')
      return response.data.data
    } catch (error) {
      console.error('[AuthService] Failed to fetch current user:', error)
      throw error
    }
  }

  private extractErrorMessage(error: any): string {
    // Handle API error response
    if (error.message && typeof error.message === 'string') {
      return error.message
    }

    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (typeof errors === 'object') {
        const messages = Object.values(errors)
          .flat()
          .filter((msg): msg is string => typeof msg === 'string')
        if (messages.length > 0) {
          return messages.join(', ')
        }
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.'
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }

    return error.message || 'An error occurred. Please try again.'
  }
}

export const authService = new AuthService()
