'use client'

import { apiClient } from './api-client'

// Types
export interface CourseListItem {
  id: number
  title: string
  description: string
  category_id: number
  category_name: string
  instructor_name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  duration: string
  thumbnail?: string
  is_active: boolean
  rating: number
  total_students: number
  total_lessons: number
  created_at: string
  updated_at: string
}

export interface Course extends CourseListItem {
  ai_score?: number
  certificate_available?: boolean
}

export interface Lesson {
  id: number
  title: string
  description: string
  type: string
  order: number
  is_active: boolean
  is_preview: boolean
  estimated_duration_minutes: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  completion_score_required: number
  bunny_video_id?: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: number
  user_id: number
  course_id: number
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  status: 'active' | 'paused' | 'completed' | 'withdrawn'
  progress_percentage: number
  lessons_completed: number
  total_lessons: number
  completion_date?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  user_id: number
  course_id: number
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  rating: number
  comment: string
  helpful_count: number
  status?: string
  created_at: string
  updated_at: string
}

export interface Analytics {
  total_enrollments: number
  active_students: number
  completed_students: number
  paused_students: number
  withdrawn_students: number
  average_completion_percentage: number
  total_revenue: number
}

export interface CourseFullProfile extends Course {
  lessons?: Lesson[]
  students?: {
    total: number
    data: Student[]
  }
  reviews?: {
    total: number
    average_rating: number
    rating_breakdown: Record<string, number>
    data: Review[]
  }
  analytics?: Analytics
}

export interface CoursesListResponse {
  courses: CourseListItem[]
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface StudentsListResponse {
  students: Student[]
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface ReviewsListResponse {
  reviews: Review[]
  stats: {
    total_reviews: number
    average_rating: number
    rating_breakdown: Record<string, number>
  }
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface CreateCourseRequest {
  title: string
  category_id: number
  description: string
  instructor_name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  duration?: string
  thumbnail?: string
  ai_score?: number
  is_active?: boolean
  certificate_available?: boolean
}

class CourseService {
  // ----- COURSE LISTING -----
  async getCourses(
    page = 1,
    filters?: {
      per_page?: number
      search?: string
      category_id?: number
      level?: string
      is_active?: boolean
      sort_by?: string
      sort_order?: string
    }
  ): Promise<CoursesListResponse> {
    try {
      const response = await apiClient.get('/admin/courses', {
        params: {
          page,
          per_page: filters?.per_page || 15,
          search: filters?.search,
          category_id: filters?.category_id,
          level: filters?.level,
          is_active: filters?.is_active,
          sort_by: filters?.sort_by || 'created_at',
          sort_order: filters?.sort_order || 'desc',
        },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      throw error
    }
  }

  // ----- COURSE DETAILS -----
  async getCourse(courseId: number): Promise<Course> {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}`)
      return response.data.data.course
    } catch (error) {
      console.error(`Failed to fetch course ${courseId}:`, error)
      throw error
    }
  }

  async getCourseFullProfile(
    courseId: number,
    includes?: string[]
  ): Promise<CourseFullProfile> {
    try {
      const includeParam = includes?.length ? includes.join(',') : 'all'
      const response = await apiClient.get(`/admin/courses/${courseId}/full-profile`, {
        params: { includes: includeParam },
      })
      return response.data.data.course
    } catch (error) {
      console.error(`Failed to fetch course full profile ${courseId}:`, error)
      throw error
    }
  }

  // ----- CREATE COURSE -----
  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.post('/admin/courses', courseData)
      return response.data.data.course
    } catch (error) {
      console.error('Failed to create course:', error)
      throw error
    }
  }

  // ----- UPDATE COURSE -----
  async updateCourse(courseId: number, courseData: Partial<Course>): Promise<Course> {
    try {
      const response = await apiClient.put(`/admin/courses/${courseId}`, courseData)
      return response.data.data.course
    } catch (error) {
      console.error(`Failed to update course ${courseId}:`, error)
      throw error
    }
  }

  // ----- UPDATE COURSE PRICE -----
  async updateCoursePricing(courseId: number, price: number): Promise<Course> {
    try {
      const response = await apiClient.put(`/admin/courses/${courseId}/pricing`, {
        price_naira: price,
      })
      return response.data.data.course
    } catch (error) {
      console.error(`Failed to update course pricing ${courseId}:`, error)
      throw error
    }
  }

  // ----- MAKE COURSE FREE -----
  async makeCourseFree(courseId: number): Promise<Course> {
    try {
      const response = await apiClient.delete(`/admin/courses/${courseId}/pricing`)
      return response.data.data.course
    } catch (error) {
      console.error(`Failed to make course free ${courseId}:`, error)
      throw error
    }
  }

  // ----- DELETE COURSE -----
  async deleteCourse(courseId: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/courses/${courseId}`)
    } catch (error) {
      console.error(`Failed to delete course ${courseId}:`, error)
      throw error
    }
  }

  // ----- LESSON MANAGEMENT -----
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}/lessons`)
      return response.data.data.lessons
    } catch (error) {
      console.error(`Failed to fetch lessons for course ${courseId}:`, error)
      throw error
    }
  }

  async addLesson(
    courseId: number,
    lessonData: {
      title: string
      description: string
      type?: string
      order: number
      bunny_video_id?: string
      estimated_duration_minutes: number
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
      completion_score_required: number
      is_active?: boolean
      is_preview?: boolean
    }
  ): Promise<Lesson> {
    try {
      const response = await apiClient.post(
        `/admin/courses/${courseId}/lessons`,
        lessonData
      )
      return response.data.data.lesson
    } catch (error) {
      console.error(`Failed to add lesson to course ${courseId}:`, error)
      throw error
    }
  }

  async updateLesson(
    courseId: number,
    lessonId: number,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> {
    try {
      const response = await apiClient.put(
        `/admin/courses/${courseId}/lessons/${lessonId}`,
        lessonData
      )
      return response.data.data.lesson
    } catch (error) {
      console.error(`Failed to update lesson ${lessonId}:`, error)
      throw error
    }
  }

  async deleteLesson(courseId: number, lessonId: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      console.error(`Failed to delete lesson ${lessonId}:`, error)
      throw error
    }
  }

  // ----- STUDENT MANAGEMENT -----
  async getCourseStudents(
    courseId: number,
    page = 1,
    filters?: {
      per_page?: number
      search?: string
      status?: string
      sort_by?: string
      sort_order?: string
    }
  ): Promise<StudentsListResponse> {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}/students`, {
        params: {
          page,
          per_page: filters?.per_page || 20,
          search: filters?.search,
          status: filters?.status,
          sort_by: filters?.sort_by || 'created_at',
          sort_order: filters?.sort_order || 'desc',
        },
      })
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch students for course ${courseId}:`, error)
      throw error
    }
  }

  async updateStudentStatus(
    courseId: number,
    enrollmentId: number,
    status: 'active' | 'paused' | 'completed' | 'withdrawn',
    progressPercentage?: number
  ): Promise<Student> {
    try {
      const response = await apiClient.put(
        `/admin/courses/${courseId}/students/${enrollmentId}`,
        {
          status,
          ...(progressPercentage !== undefined && { progress_percentage: progressPercentage }),
        }
      )
      return response.data.data.enrollment
    } catch (error) {
      console.error(`Failed to update student status:`, error)
      throw error
    }
  }

  // ----- REVIEWS MANAGEMENT -----
  async getCourseReviews(
    courseId: number,
    page = 1,
    filters?: {
      per_page?: number
      rating?: number
      sort_by?: string
      sort_order?: string
    }
  ): Promise<ReviewsListResponse> {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}/reviews`, {
        params: {
          page,
          per_page: filters?.per_page || 20,
          rating: filters?.rating,
          sort_by: filters?.sort_by || 'created_at',
          sort_order: filters?.sort_order || 'desc',
        },
      })
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch reviews for course ${courseId}:`, error)
      throw error
    }
  }

  async updateReview(
    courseId: number,
    reviewId: number,
    reviewData: {
      comment?: string
      status?: string
    }
  ): Promise<Review> {
    try {
      const response = await apiClient.put(
        `/admin/courses/${courseId}/reviews/${reviewId}`,
        reviewData
      )
      return response.data.data.review
    } catch (error) {
      console.error(`Failed to update review ${reviewId}:`, error)
      throw error
    }
  }

  async deleteReview(courseId: number, reviewId: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/courses/${courseId}/reviews/${reviewId}`)
    } catch (error) {
      console.error(`Failed to delete review ${reviewId}:`, error)
      throw error
    }
  }
}

export const courseService = new CourseService()

