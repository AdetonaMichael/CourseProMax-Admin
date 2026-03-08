'use client'

import { apiClient } from './api-client'
import { Lesson, CreateLessonRequest, UpdateLessonRequest } from '@/types'

class LessonService {
  async createLesson(
    courseId: number,
    data: CreateLessonRequest
  ): Promise<Lesson> {
    try {
      const response = await apiClient.post<Lesson>(
        `/courses/${courseId}/lessons`,
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
        `/courses/${courseId}/lessons/${lessonId}`,
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
      await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      throw error
    }
  }

  async getLessonById(courseId: number, lessonId: number): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(
        `/courses/${courseId}/lessons/${lessonId}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch lesson:', error)
      throw error
    }
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<Lesson[]>(
        `/courses/${courseId}/lessons`
      )
      return response.data
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

  async addQuizToLesson(lessonId: number, quizData: { questions: any[] }): Promise<any> {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/quizzes`, quizData)
      return response.data
    } catch (error) {
      console.error('Failed to add quiz to lesson:', error)
      throw error
    }
  }
}

export const lessonService = new LessonService()
