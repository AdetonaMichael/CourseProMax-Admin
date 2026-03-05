import type { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const metadata = {
  title: 'My Learning | CourseProMax',
  description: 'View and manage your enrolled courses',
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
