'use client'

import { useAuth } from './useAuth'

export function useRole() {
  const { user } = useAuth()

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false
    const rolesArray = Array.isArray(role) ? role : [role]
    return rolesArray.some(r => user.roles?.includes(r))
  }

  const isAdmin = (): boolean => hasRole('admin')
  const isInstructor = (): boolean => hasRole('instructor')
  const isStudent = (): boolean => hasRole('student')

  const canAccess = (requiredRole: string | string[]): boolean => {
    return hasRole(requiredRole)
  }

  return {
    role: user?.roles?.[0],
    hasRole,
    isAdmin,
    isInstructor,
    isStudent,
    canAccess,
  }
}
