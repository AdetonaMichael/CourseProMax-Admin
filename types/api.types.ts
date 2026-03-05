export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  message?: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
}
