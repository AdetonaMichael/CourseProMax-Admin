'use client'

import { useAuth } from './useAuth'
import { ROLE_PERMISSIONS } from '@/types'

export function usePermission() {
  const { user } = useAuth()

  const hasPermission = (permission: string): boolean => {
    if (!user?.roles || user.roles.length === 0) return false
    
    // Check if any of the user's roles has the permission
    return user.roles.some(role => {
      const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]
      return rolePermissions?.has(permission) || false
    })
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((perm) => hasPermission(perm))
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((perm) => hasPermission(perm))
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  }
}
