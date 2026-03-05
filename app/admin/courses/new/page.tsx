'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import CourseForm from '@/components/admin/course-management/CourseForm'
import { Course } from '@/services/course.service'
import './page.css'

export default function NewCoursePage() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [createdCourse, setCreatedCourse] = useState<Course | null>(null)

  const handleFormSubmit = (course: Course) => {
    setCreatedCourse(course)
    setSuccess(true)

    setTimeout(() => {
      router.push(`/admin/courses/${course.id}`)
    }, 2000)
  }

  const handleError = (error: string) => {
    console.error('Course creation error:', error)
  }

  return (
    <div className="new-course-page">
      <div className="page-header">
        <button
          onClick={() => router.back()}
          className="back-button"
          title="Go back"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1>Create New Course</h1>
      </div>

      {success && createdCourse && (
        <div className="success-message">
          <CheckCircle size={20} />
          <div>
            <p>Course created successfully!</p>
            <small>Redirecting to course details...</small>
          </div>
        </div>
      )}

      {!success && <CourseForm onSubmit={handleFormSubmit} onError={handleError} />}
    </div>
  )
}
