'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'

const ADMIN_MENU_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Courses', href: '/admin/courses', icon: '📚' },
  { label: 'Enrollments', href: '/admin/enrollments', icon: '📋' },
  { label: 'Categories', href: '/admin/categories', icon: '📁' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">CoursePro</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {ADMIN_MENU_ITEMS.map((item) => {
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
