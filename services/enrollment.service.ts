'use client'

import { apiClient } from './api-client'
import { Enrollment, LessonProgress } from '@/types'

class EnrollmentService {
  async getEnrollments(params?: {
    page?: number
    per_page?: number
    course_id?: number
    user_id?: number
  }): Promise<any> {
    try {
      const response = await apiClient.get('/enrollments', { params })
      return response.data
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
      throw error
    }
  }

  async enrollCourse(courseId: number): Promise<Enrollment> {
    try {
      const response = await apiClient.post<Enrollment>(`/courses/${courseId}/enroll`)
      return response.data
    } catch (error) {
      console.error('Failed to enroll in course:', error)
      throw error
    }
  }

  async getEnrollmentProgress(enrollmentId: number): Promise<LessonProgress[]> {
    try {
      const response = await apiClient.get<LessonProgress[]>(
        `/enrollments/${enrollmentId}/progress`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch enrollment progress:', error)
      throw error
    }
  }

  async markLessonComplete(lessonId: number): Promise<LessonProgress> {
    try {
      const response = await apiClient.post<LessonProgress>(
        `/lessons/${lessonId}/complete`
      )
      return response.data
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
      throw error
    }
  }
}

export const enrollmentService = new EnrollmentService()
