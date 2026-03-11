'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'
import {
  LayoutDashboard,
  BookOpen,
  User,
  HelpCircle,
  LogOut,
  Users,
  DollarSign,
  Settings,
  Award,
} from 'lucide-react'

const INSTRUCTOR_MENU_ITEMS = [
  { label: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'Enrollments', href: '/instructor/enrollments', icon: Users },
  { label: 'Earnings', href: '/instructor/earnings', icon: DollarSign },
  { label: 'Certificates', href: '/instructor/certificates', icon: Award },
  { label: 'Profile', href: '/instructor/profile', icon: User },
  { label: 'Settings', href: '/instructor/settings', icon: Settings },
  { label: 'Help', href: '/instructor/help', icon: HelpCircle },
]

export function InstructorSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <Image 
          src="/icon.png" 
          alt="CoursePro" 
          width={40} 
          height={40}
          className="rounded-lg flex-shrink-0" 
          priority
        />
        <div className="min-w-0">
          <h1 className="text-xl font-bold">CourseProMax</h1>
          <p className="text-xs text-gray-400 whitespace-nowrap">Instructor Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {INSTRUCTOR_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
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
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
