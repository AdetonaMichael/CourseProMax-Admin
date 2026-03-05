import type { UserProfile } from './user.types'

export interface LoginRequest {
  email: string
  password: string
  channel?: string
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    user: UserProfile
    login_channel?: string
    location?: {
      has_location: boolean
      latitude: string
      longitude: string
      accuracy: string
      updated_at?: string
    }
  }
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  phone_number: string
}

export interface RegisterResponse {
  status: boolean
  message: string
  data: {
    token: string
    user: UserProfile
  }
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
}
