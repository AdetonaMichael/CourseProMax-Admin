export type UserRole = 'admin' | 'instructor' | 'student' | 'user'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface UserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  email_verified_at?: string | null
  phone_verified_at?: string | null
  isPhoneVerified?: boolean
  isEmailVerified?: boolean
  created_at: string
  updated_at?: string
  roles?: string[]
  permissions?: string[]
  balance?: number
  formatted_balance?: string
  avatar_url?: string
  bio?: string
  status?: UserStatus
}

export interface UserListResponse {
  data: UserProfile[]
  pagination: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  phone_number?: string
  bio?: string
  avatar_url?: string
}
