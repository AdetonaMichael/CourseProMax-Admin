import type { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const metadata = {
  title: 'Instructor Dashboard | CourseProMax',
  description: 'Instructor dashboard for managing courses',
}

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="instructor">
      {children}
    </ProtectedRoute>
  )
}
