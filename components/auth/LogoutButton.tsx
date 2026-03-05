'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'

export function LogoutButton() {
  const { logout, isLoading } = useAuth()

  return (
    <Button
      onClick={() => logout()}
      isLoading={isLoading}
      variant="secondary"
      size="sm"
    >
      Logout
    </Button>
  )
}
