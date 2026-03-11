'use client'

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { getStoredToken, setStoredToken, clearAuthStorage } from '@/utils/storage.utils'
import { ApiError } from '@/types'
import {
  APIResponse,
  PaginatedResponse,
  extractData,
  extractPagination,
  extractRateLimitInfo,
  HTTP_STATUS,
  ERROR_MESSAGES,
  isRateLimitApproaching,
} from '@/utils/api-helpers'

export interface RequestOptions extends AxiosRequestConfig {
  skipErrorHandling?: boolean;
  retryAttempts?: number;
}

class ApiClient {
  private client: AxiosInstance
  private baseURL: string
  private retryAttempts: number = 3
  private retryDelay: number = 1000
  private rateLimitInfo: any = null
  private onRateLimitWarning?: (remaining: number) => void
  private onRateLimitExceeded?: () => void

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

  /**
   * Set rate limit warning callback
   */
  public onRateLimitWarningCallback(callback: (remaining: number) => void): void {
    this.onRateLimitWarning = callback;
  }

  /**
   * Set rate limit exceeded callback
   */
  public onRateLimitExceededCallback(callback: () => void): void {
    this.onRateLimitExceeded = callback;
  }

  /**
   * Get current rate limit info
   */
  public getRateLimitInfo() {
    return this.rateLimitInfo;
  }

  /**
   * Check if can make request based on rate limit
   */
  public canMakeRequest(): boolean {
    return !this.rateLimitInfo || this.rateLimitInfo.remaining > 0;
  }

  /**
   * Get remaining requests
   */
  public getRemainingRequests(): number {
    return this.rateLimitInfo?.remaining ?? Infinity;
  }

  /**
   * Get rate limit reset time
   */
  public getRateLimitReset(): Date | null {
    if (!this.rateLimitInfo?.reset) return null;
    return new Date(this.rateLimitInfo.reset * 1000);
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest(
    fn: () => Promise<any>,
    attempts: number = this.retryAttempts
  ): Promise<any> {
    try {
      return await fn();
    } catch (error: any) {
      if (
        attempts > 0 &&
        (error.response?.status === 429 || error.code === 'ECONNABORTED')
      ) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(fn, attempts - 1);
      }
      throw error;
    }
  }

  /**
   * Generic GET with automatic response formatting
   */
  public async getFormatted<T = any>(
    url: string,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.retryRequest(
        () => this.client.get(url, options)
      );

      // Extract rate limit info
      const rateLimitInfo = extractRateLimitInfo(response.headers);
      if (rateLimitInfo) {
        this.rateLimitInfo = rateLimitInfo;
        if (isRateLimitApproaching(rateLimitInfo)) {
          this.onRateLimitWarning?.(rateLimitInfo.remaining);
        }
      }

      return {
        status: true,
        success: true,
        message: response.data?.message || 'Success',
        data: extractData<T>(response.data),
      };
    } catch (error) {
      throw this.handleError(error, options?.skipErrorHandling);
    }
  }

  /**
   * Generic POST with automatic response formatting
   */
  public async postFormatted<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.retryRequest(
        () => this.client.post(url, data, options)
      );

      // Extract rate limit info
      const rateLimitInfo = extractRateLimitInfo(response.headers);
      if (rateLimitInfo) {
        this.rateLimitInfo = rateLimitInfo;
      }

      return {
        status: true,
        success: true,
        message: response.data?.message || 'Created successfully',
        data: extractData<T>(response.data),
      };
    } catch (error) {
      throw this.handleError(error, options?.skipErrorHandling);
    }
  }

  /**
   * Generic PUT with automatic response formatting
   */
  public async putFormatted<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.retryRequest(
        () => this.client.put(url, data, options)
      );

      const rateLimitInfo = extractRateLimitInfo(response.headers);
      if (rateLimitInfo) {
        this.rateLimitInfo = rateLimitInfo;
      }

      return {
        status: true,
        success: true,
        message: response.data?.message || 'Updated successfully',
        data: extractData<T>(response.data),
      };
    } catch (error) {
      throw this.handleError(error, options?.skipErrorHandling);
    }
  }

  /**
   * Generic DELETE with automatic response formatting
   */
  public async deleteFormatted<T = any>(
    url: string,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.retryRequest(
        () => this.client.delete(url, options)
      );

      const rateLimitInfo = extractRateLimitInfo(response.headers);
      if (rateLimitInfo) {
        this.rateLimitInfo = rateLimitInfo;
      }

      return {
        status: true,
        success: true,
        message: response.data?.message || 'Deleted successfully',
        data: extractData<T>(response.data),
      };
    } catch (error) {
      throw this.handleError(error, options?.skipErrorHandling);
    }
  }

  /**
   * Paginated GET request
   */
  public async getPaginated<T = any>(
    url: string,
    page: number = 1,
    perPage: number = 20,
    options?: RequestOptions
  ): Promise<APIResponse<PaginatedResponse<T>>> {
    const sanitizedPage = Math.max(1, page);
    const sanitizedPerPage = Math.min(Math.max(1, perPage), 100);

    try {
      const response = await this.retryRequest(
        () =>
          this.client.get(url, {
            ...options,
            params: {
              ...options?.params,
              page: sanitizedPage,
              per_page: sanitizedPerPage,
            },
          })
      );

      const rateLimitInfo = extractRateLimitInfo(response.headers);
      if (rateLimitInfo) {
        this.rateLimitInfo = rateLimitInfo;
      }

      const pagination = extractPagination(response.data);
      const items = response.data?.data?.items || response.data?.data || [];

      return {
        status: true,
        success: true,
        message: response.data?.message || 'Success',
        data: {
          items: Array.isArray(items) ? items : [items],
          pagination: pagination || {
            current_page: sanitizedPage,
            per_page: sanitizedPerPage,
            total: items.length,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          },
        },
      };
    } catch (error) {
      throw this.handleError(error, options?.skipErrorHandling);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: any, skipErrorHandling: boolean = false): any {
    console.error('[API Client Error]', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (skipErrorHandling) {
      throw error;
    }

    if (!error.response) {
      return {
        status: false,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        errors: { network: [error.message] },
      };
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        clearAuthStorage();
        return {
          status: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
          errors: { auth: ['Invalid or expired token'] },
        };
      case HTTP_STATUS.FORBIDDEN:
        return {
          status: false,
          message: ERROR_MESSAGES.FORBIDDEN,
          errors: { permission: ['Access denied'] },
        };
      case HTTP_STATUS.NOT_FOUND:
        return {
          status: false,
          message: data?.message || ERROR_MESSAGES.NOT_FOUND,
          errors: { resource: ['Not found'] },
        };
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        this.onRateLimitExceeded?.();
        return {
          status: false,
          message: ERROR_MESSAGES.RATE_LIMIT,
          errors: { rate_limit: ['Too many requests'] },
          retry_after: error.response.headers['retry-after'],
        };
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return {
          status: false,
          message: data?.message || ERROR_MESSAGES.VALIDATION_FAILED,
          errors: data?.errors || {},
        };
      case HTTP_STATUS.SERVER_ERROR:
        return {
          status: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
          errors: { server: ['Internal server error'] },
        };
      default:
        return {
          status: false,
          message: data?.message || error.message || 'Unknown error',
          errors: data?.errors || { unknown: [error.message] },
        };
    }
  }

  /**
   * Reset instance
   */
  public reset(): void {
    this.rateLimitInfo = null;
  }
}

export const apiClient = new ApiClient()