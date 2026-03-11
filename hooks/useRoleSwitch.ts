'use client'

import { useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export interface RoleSwitchOptions {
  role: string
  skipNavigation?: boolean
}

export function useRoleSwitch() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  // Get all available roles for the current user
  const availableRoles = useCallback((): string[] => {
    return session?.user?.roles || []
  }, [session?.user?.roles])

  // Validate if user has a specific role
  const hasRole = useCallback((role: string): boolean => {
    const roles = availableRoles()
    return roles.includes(role)
  }, [availableRoles])

  // Get stored role from localStorage with validation
  const getStoredRole = useCallback((): string | null => {
    try {
      if (typeof window === 'undefined') return null
      const stored = localStorage.getItem('current_role')
      if (stored && hasRole(stored)) {
        return stored
      }
      // Clear invalid stored role
      localStorage.removeItem('current_role')
      return null
    } catch (error) {
      console.error('[useRoleSwitch] Error reading stored role:', error)
      return null
    }
  }, [hasRole])

  // Switch to a different role
  const switchRole = useCallback(
    async (options: RoleSwitchOptions): Promise<boolean> => {
      const { role, skipNavigation = false } = options

      // Validate user has the role
      if (!hasRole(role)) {
        console.error(`[useRoleSwitch] User does not have role: ${role}`)
        return false
      }

      try {
        setIsSwitching(true)

        // Store role securely in localStorage
        localStorage.setItem('current_role', role)
        localStorage.setItem('role_switched_at', new Date().toISOString())

        // Update state
        setCurrentRole(role)

        console.log(`[useRoleSwitch] Successfully switched to role: ${role}`)

        // Navigate to appropriate dashboard if not skipped
        if (!skipNavigation) {
          const dashboardMap: Record<string, string> = {
            admin: '/admin',
            instructor: '/instructor',
            student: '/dashboard',
            user: '/dashboard',
          }

          const destination = dashboardMap[role] || '/dashboard'
          router.push(destination)
        }

        return true
      } catch (error) {
        console.error('[useRoleSwitch] Error switching role:', error)
        return false
      } finally {
        setIsSwitching(false)
      }
    },
    [hasRole, router]
  )

  // Get current active role (from stored or default)
  const getCurrentRole = useCallback((): string => {
    if (currentRole) return currentRole

    const storedRole = getStoredRole()
    if (storedRole) {
      setCurrentRole(storedRole)
      return storedRole
    }

    // Default to first available role
    const roles = availableRoles()
    if (roles.length > 0) {
      const defaultRole = roles[0]
      localStorage.setItem('current_role', defaultRole)
      setCurrentRole(defaultRole)
      return defaultRole
    }

    return 'user'
  }, [currentRole, getStoredRole, availableRoles])

  // Check if user has multiple roles
  const hasMultipleRoles = useCallback((): boolean => {
    return availableRoles().length > 1
  }, [availableRoles])

  // Clear stored role (for logout)
  const clearRole = useCallback(() => {
    try {
      localStorage.removeItem('current_role')
      localStorage.removeItem('role_switched_at')
      setCurrentRole(null)
    } catch (error) {
      console.error('[useRoleSwitch] Error clearing role:', error)
    }
  }, [])

  return {
    currentRole: getCurrentRole(),
    availableRoles: availableRoles(),
    hasRole,
    hasMultipleRoles: hasMultipleRoles(),
    switchRole,
    clearRole,
    isSwitching,
  }
}
