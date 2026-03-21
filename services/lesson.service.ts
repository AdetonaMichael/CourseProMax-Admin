'use client'

import { apiClient } from './api-client'
import { Lesson, CreateLessonRequest, UpdateLessonRequest } from '@/types'

class LessonService {
  // ===== ADMIN LESSON METHODS =====
  async createLesson(
    courseId: number,
    data: CreateLessonRequest
  ): Promise<Lesson> {
    try {
      const response = await apiClient.post<Lesson>(
        `/admin/courses/${courseId}/lessons`,
        data
      )
      return response.data
    } catch (error) {
      console.error('Failed to create lesson:', error)
      throw error
    }
  }

  async updateLesson(
    courseId: number,
    lessonId: number,
    data: UpdateLessonRequest
  ): Promise<Lesson> {
    try {
      const response = await apiClient.put<Lesson>(
        `/admin/courses/${courseId}/lessons/${lessonId}`,
        data
      )
      return response.data
    } catch (error) {
      console.error('Failed to update lesson:', error)
      throw error
    }
  }

  async deleteLesson(courseId: number, lessonId: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      throw error
    }
  }

  async getLessonById(courseId: number, lessonId: number): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(
        `/admin/courses/${courseId}/lessons/${lessonId}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch lesson:', error)
      throw error
    }
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(
        `/admin/courses/${courseId}/lessons`
      )
      console.log('🔍 LESSON ENDPOINT RESPONSE:', {
        endpoint: `/admin/courses/${courseId}/lessons`,
        fullResponse: response,
        lessonsData: response.data,
        firstLessonSample: response.data?.[0],
      })
      
      // Handle different response formats to ensure we always return an array
      let lessonsArray: Lesson[] = []
      if (Array.isArray(response.data)) {
        lessonsArray = response.data
      } else if (response.data?.data?.lessons && Array.isArray(response.data.data.lessons)) {
        // Common API format: { data: { lessons: [...], total: 1 } }
        lessonsArray = response.data.data.lessons
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        lessonsArray = response.data.data
      } else if (response.data?.lessons && Array.isArray(response.data.lessons)) {
        lessonsArray = response.data.lessons
      } else if (typeof response.data === 'object' && response.data && Object.keys(response.data).length > 0) {
        // Last resort: if it's an object, try to find an array property
        const firstArrayProp = Object.values(response.data).find((v) => Array.isArray(v))
        lessonsArray = firstArrayProp ? (firstArrayProp as Lesson[]) : []
      }
      
      return lessonsArray
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      throw error
    }
  }

  async addVideoToLesson(lessonId: number, videoData: { video_url: string; title: string }): Promise<any> {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/videos`, videoData)
      return response.data
    } catch (error) {
      console.error('Failed to add video to lesson:', error)
      throw error
    }
  }

  async getQuizByLesson(courseId: number, lessonId: number): Promise<any> {
    try {
      const response = await apiClient.get(
        `/admin/courses/${courseId}/lessons/${lessonId}/quiz`
      )
      console.log('📋 QUIZ FETCH:', { courseId, lessonId, quiz: response.data })
      return response.data
    } catch (error) {
      console.error('Failed to fetch quiz:', error)
      return null
    }
  }

  async createOrUpdateQuiz(
    courseId: number,
    lessonId: number,
    quizData: any,
    isUpdate: boolean = false
  ): Promise<any> {
    try {
      const endpoint = `/admin/courses/${courseId}/lessons/${lessonId}/quiz`
      const response = isUpdate
        ? await apiClient.put(endpoint, quizData)
        : await apiClient.post(endpoint, quizData)
      console.log(`✅ QUIZ ${isUpdate ? 'UPDATED' : 'CREATED'}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Failed to ${isUpdate ? 'update' : 'create'} quiz:`, error)
      throw error
    }
  }

  async deleteQuiz(courseId: number, lessonId: number): Promise<any> {
    try {
      const response = await apiClient.delete(
        `/admin/courses/${courseId}/lessons/${lessonId}/quiz`
      )
      console.log('🗑️ QUIZ DELETED:', response.data)
      return response.data
    } catch (error) {
      console.error('Failed to delete quiz:', error)
      throw error
    }
  }

  async addQuizToLesson(lessonId: number, quizData: { questions: any[] }): Promise<any> {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/quizzes`, quizData)
      return response.data
    } catch (error) {
      console.error('Failed to add quiz to lesson:', error)
      throw error
    }
  }

  // ===== INSTRUCTOR LESSON METHODS =====
  async createLessonInstructor(
    courseId: number,
    data: CreateLessonRequest
  ): Promise<Lesson> {
    try {
      const response = await apiClient.post<Lesson>(
        `/instructor/courses/${courseId}/lessons`,
        data
      )
      return response.data
    } catch (error) {
      console.error('Failed to create lesson (instructor):', error)
      throw error
    }
  }

  async updateLessonInstructor(
    courseId: number,
    lessonId: number,
    data: UpdateLessonRequest
  ): Promise<Lesson> {
    try {
      const response = await apiClient.put<Lesson>(
        `/instructor/courses/${courseId}/lessons/${lessonId}`,
        data
      )
      return response.data
    } catch (error) {
      console.error('Failed to update lesson (instructor):', error)
      throw error
    }
  }

  async deleteLessonInstructor(courseId: number, lessonId: number): Promise<void> {
    try {
      await apiClient.delete(`/instructor/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Failed to delete lesson (instructor):', error)
      throw error
    }
  }

  async getLessonByIdInstructor(courseId: number, lessonId: number): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(
        `/instructor/courses/${courseId}/lessons/${lessonId}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch lesson (instructor):', error)
      throw error
    }
  }

  async getLessonsByCourseInstructor(courseId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(
        `/instructor/courses/${courseId}/lessons`
      )
      console.log('🔍 LESSON ENDPOINT RESPONSE (INSTRUCTOR):', {
        endpoint: `/instructor/courses/${courseId}/lessons`,
        fullResponse: response,
        lessonsData: response.data,
        firstLessonSample: response.data?.[0],
      })
      
      // Handle different response formats to ensure we always return an array
      let lessonsArray: Lesson[] = []
      if (Array.isArray(response.data)) {
        lessonsArray = response.data
      } else if (response.data?.data?.lessons && Array.isArray(response.data.data.lessons)) {
        lessonsArray = response.data.data.lessons
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        lessonsArray = response.data.data
      } else if (response.data?.lessons && Array.isArray(response.data.lessons)) {
        lessonsArray = response.data.lessons
      } else if (typeof response.data === 'object' && response.data && Object.keys(response.data).length > 0) {
        const firstArrayProp = Object.values(response.data).find((v) => Array.isArray(v))
        lessonsArray = firstArrayProp ? (firstArrayProp as Lesson[]) : []
      }
      
      return lessonsArray
    } catch (error) {
      console.error('Failed to fetch lessons (instructor):', error)
      throw error
    }
  }

  // ===== VIDEO DELETION METHODS =====
  async deleteVideoAdmin(courseId: number, lessonId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}/video`)
      return response.data
    } catch (error) {
      console.error('Failed to delete video (admin):', error)
      throw error
    }
  }

  async deleteVideoInstructor(
    courseId: number,
    lessonId: number
  ): Promise<{ status: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/instructor/courses/${courseId}/lessons/${lessonId}/video`)
      return response.data
    } catch (error) {
      console.error('Failed to delete video (instructor):', error)
      throw error
    }
  }
}

export const lessonService = new LessonService()
