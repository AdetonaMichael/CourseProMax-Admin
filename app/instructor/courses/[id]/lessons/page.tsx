'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * This page has been deprecated.
 * Lesson management functionality has been integrated into the course details page.
 * This page will automatically redirect to the course details page.
 */
export default function LessonsPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id

  useEffect(() => {
    if (courseId) {
      router.replace(`/instructor/courses/${courseId}`)
    }
  }, [courseId, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600 mb-2">Redirecting to course details...</p>
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
