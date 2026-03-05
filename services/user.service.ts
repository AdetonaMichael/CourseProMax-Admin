'use client'

import { apiClient } from './api-client'
import { UserProfile, UserListResponse, UpdateUserRequest } from '@/types'

class UserService {
  async getUsers(params?: {
    page?: number
    per_page?: number
    search?: string
    role?: string
  }): Promise<UserListResponse> {
    try {
      const response = await apiClient.get<UserListResponse>('/users', {
        params,
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  async getUserById(id: number): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error)
      throw error
    }
  }

  async updateUser(
    id: number,
    data: UpdateUserRequest
  ): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(`/users/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error)
      throw error
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`)
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error)
      throw error
    }
  }

  async updateUserRole(id: number, role: string): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(`/users/${id}/role`, {
        role,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to update user role:`, error)
      throw error
    }
  }
}

export const userService = new UserService()
