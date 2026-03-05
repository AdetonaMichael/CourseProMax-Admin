'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import CourseForm from '@/components/admin/course-management/CourseForm'
import { Course, courseService } from '@/services/course.service'

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await courseService.getCourse(parseInt(courseId))
        setCourse(data)
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load course'
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  const handleFormSubmit = (updatedCourse: Course) => {
    setCourse(updatedCourse)
    setSuccess(true)

    setTimeout(() => {
      router.push(`/admin/courses/${courseId}`)
    }, 2000)
  }

  const handleFormError = (error: string) => {
    console.error('Course update error:', error)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="edit-course-page">
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading course details...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="edit-course-page">
              <div className="page-header">
                <button
                  onClick={() => router.back()}
                  className="back-button"
                  title="Go back"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
                <h1>Edit Course</h1>
              </div>

              <div className="error-state">
                <p className="error-message">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="retry-button"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="edit-course-page">
            <div className="page-header">
              <button
                onClick={() => router.back()}
                className="back-button"
                title="Go back"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h1>Edit Course: {course?.title}</h1>
            </div>

            {success && course && (
              <div className="success-message">
                <CheckCircle size={20} />
                <div>
                  <p>Course updated successfully!</p>
                  <small>Redirecting to course details...</small>
                </div>
              </div>
            )}

            {!success && course && (
              <CourseForm
                course={course}
                onSubmit={handleFormSubmit}
                onError={handleFormError}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
