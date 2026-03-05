'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface InstructorLayoutProps {
  children: ReactNode;
}

export function InstructorLayout({ children }: InstructorLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    { href: '/instructor', label: 'Dashboard', icon: '📊' },
    { href: '/instructor/courses', label: 'My Courses', icon: '📚' },
    { href: '/instructor/enrollments', label: 'Enrollments', icon: '👥' },
    { href: '/instructor/earnings', label: 'Earnings', icon: '💰' },
    { href: '/instructor/profile', label: 'Profile', icon: '👤' },
    { href: '/instructor/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/instructor') return pathname === '/instructor';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col border-r border-gray-700">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">CourseProMax</h1>
          <p className="text-sm text-gray-400 mt-1">Instructor Hub</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {session?.user?.email?.[0].toUpperCase() || 'I'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.first_name || 'Instructor'}
              </p>
              <p className="text-xs text-gray-400">Instructor</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your courses and students</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
