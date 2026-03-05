'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Redirect based on user role
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
  }, [status, router, session]);

  // Return null during redirect
  return null;
}
