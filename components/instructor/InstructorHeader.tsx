'use client'

import { useAuth } from '@/hooks/useAuth'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'

export function InstructorHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <RoleSwitcher compact={true} />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 uppercase">{user?.roles?.[0]}</p>
          </div>
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
        </div>
      </div>
    </header>
  )
}
