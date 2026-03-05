import type { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const metadata = {
  title: 'Admin Dashboard | CourseProMax',
  description: 'Administration dashboard for CourseProMax',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}
