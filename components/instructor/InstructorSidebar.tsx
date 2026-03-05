'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'

const INSTRUCTOR_MENU_ITEMS = [
  { label: 'Dashboard', href: '/instructor', icon: '📊' },
  { label: 'My Courses', href: '/instructor/courses', icon: '📚' },
  { label: 'Profile', href: '/instructor/profile', icon: '👤' },
  { label: 'Help', href: '/instructor/help', icon: '❓' },
]

export function InstructorSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">CoursePro</h1>
        <p className="text-sm text-gray-400 mt-1">Instructor Portal</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {INSTRUCTOR_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Button
          onClick={logout}
          variant="danger"
          size="md"
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
