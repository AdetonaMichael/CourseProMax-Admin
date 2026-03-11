'use client'

import React, { useState } from 'react'
import { useRoleSwitch } from '@/hooks/useRoleSwitch'
import { ChevronDown, Shield, Briefcase, BookOpen } from 'lucide-react'

interface RoleSwitcherProps {
  className?: string
  compact?: boolean
}

const roleConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  admin: {
    label: 'Admin',
    icon: <Shield size={16} />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  instructor: {
    label: 'Instructor',
    icon: <BookOpen size={16} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  student: {
    label: 'Student',
    icon: <Briefcase size={16} />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  user: {
    label: 'User',
    icon: <Briefcase size={16} />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
}

export function RoleSwitcher({ className = '', compact = false }: RoleSwitcherProps) {
  const { currentRole, availableRoles, switchRole, hasMultipleRoles, isSwitching } = useRoleSwitch()
  const [isOpen, setIsOpen] = useState(false)

  if (!hasMultipleRoles) {
    return null
  }

  const config = roleConfig[currentRole] || roleConfig.user

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          isOpen
            ? 'bg-gray-100 border-gray-300'
            : 'bg-white border-gray-200 hover:border-gray-300'
        } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''} ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        <span className={`${config.color}`}>{config.icon}</span>
        <span className="font-medium text-gray-700">{config.label}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widening">
              Switch Role
            </p>

            {availableRoles.map((role) => {
              const roleInfo = roleConfig[role] || roleConfig.user
              const isActive = role === currentRole

              return (
                <button
                  key={role}
                  onClick={async () => {
                    await switchRole({ role, skipNavigation: false })
                    setIsOpen(false)
                  }}
                  disabled={isSwitching}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
                    isActive
                      ? `${roleInfo.bgColor} ${roleInfo.color} font-medium`
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={roleInfo.color}>{roleInfo.icon}</span>
                  <span>{roleInfo.label}</span>
                  {isActive && <span className="ml-auto text-xs">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
