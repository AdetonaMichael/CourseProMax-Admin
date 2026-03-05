'use client'

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getStoredToken, setStoredToken, clearAuthStorage } from '@/utils/storage.utils'
import { ApiError } from '@/types'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // DO NOT send cookies - we use Bearer token based auth only
      withCredentials: false,
    })

    // Request interceptor - Add Bearer token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.debug('[API Client] 🔵 REQUEST INTERCEPTOR FIRED')
        console.debug('[API Client] Base URL:', this.baseURL)
        console.debug('[API Client] Request URL:', config.url)
        
        const token = getStoredToken()
        console.debug('[API Client] Checking localStorage for token...')
        console.debug('[API Client] Token exists:', !!token)
        if (token) {
          console.debug('[API Client] Token preview:', token.substring(0, 30) + '...')
          console.debug('[API Client] Token length:', token.length)
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.debug('[API Client] ✅ Authorization header set')
        } else {
          console.warn('[API Client] ❌ NO TOKEN FOUND - Request will likely fail with 401')
        }
        
        console.debug('[API Client] Final headers:', config.headers)
        return config
      },
      (error) => {
        console.error('[API Client] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.debug('[API Client] Success response:', response.config.url, response.status)
        return response
      },
      (error: AxiosError<any>) => {
        console.error('[API Client] Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        })

        // Handle unauthorized errors
        if (error.response?.status === 401) {
          console.warn('[API Client] Unauthorized - clearing auth storage')
          clearAuthStorage()
        }

        // Format error response
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status || 0,
          errors: error.response?.data?.errors || error.response?.data?.data?.errors,
        }

        return Promise.reject(apiError)
      }
    )
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }
}

export const apiClient = new ApiClient()