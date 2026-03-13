'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      const userRoles = session.user.roles || [];
      
      // Single role users: redirect to their dashboard
      if (userRoles.length === 1) {
        const role = userRoles[0];
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'instructor') {
          router.push('/instructor');
        }
        return;
      }

      // Multi-role users: stay on dashboard and show role selector
      // (will render below)
    }
  }, [status, session?.user, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated (middleware will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  // If not a valid authenticated session (no user ID or email), return null
  if (!session?.user?.id || !session?.user?.email) {
    return null;
  }

  // Multi-role users get role selector
  const userRoles = session?.user?.roles || [];
  if (userRoles.length > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your Dashboard</h1>
          <p className="text-gray-600 mb-8">
            You have access to multiple dashboards. Choose which one you'd like to access:
          </p>
          <div className="space-y-3">
            {userRoles.includes('admin') && (
              <button
                onClick={() => router.push('/admin')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Admin Dashboard
              </button>
            )}
            {userRoles.includes('instructor') && (
              <button
                onClick={() => router.push('/instructor')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Instructor Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
