'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRoleSwitch } from '@/hooks/useRoleSwitch';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasMultipleRoles, availableRoles } = useRoleSwitch();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // If user has multiple roles, show a role selector page
      if (hasMultipleRoles) {
        // Stay on this page and show role switcher from header
        return;
      }

      // Single role user - redirect to their dashboard
      const userRole = session?.user?.roles?.[0];
      console.log('[Dashboard] User role:', userRole);

      if (userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'instructor') {
        router.push('/instructor');
      } else {
        // Fallback to admin if role doesn't match
        router.push('/admin');
      }
    }
  }, [status, router, session, hasMultipleRoles]);

  // Show role selector for multi-role users
  if (hasMultipleRoles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your Dashboard</h1>
          <p className="text-gray-600 mb-8">
            You have access to multiple dashboards. Choose which one you'd like to access:
          </p>
          <div className="space-y-3">
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  const dashboardMap: Record<string, string> = {
                    admin: '/admin',
                    instructor: '/instructor',
                    student: '/dashboard',
                    user: '/dashboard',
                  };
                  router.push(dashboardMap[role] || '/dashboard');
                }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  role === 'admin'
                    ? 'bg-red-100 text-red-900 hover:bg-red-200'
                    : role === 'instructor'
                    ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Return null during redirect for single-role users
  return null;
}
