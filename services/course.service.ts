'use client'

import { apiClient } from './api-client'

// Types
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

export interface CourseListItem {
  id: number
  title: string
  description: string
  category_id: number
  category_name: string
  category?: Category  // Full category object from full-profile endpoint
  instructor_name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  duration: string
  thumbnail?: string
  is_active: boolean
  rating: number
  total_students?: number
  students_count?: number  // Backend returns this field
  total_lessons: number
  created_at: string
  updated_at: string
  // Pricing fields from backend
  is_free?: boolean
  is_paid?: boolean
  price_kobo?: number
  price_naira?: number
  price_display?: string
  currency?: string
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
  enrollment_id: number
  user_id: number
  user_name: string
  user_email: string
  user_phone?: string
  enrolled_at: string
  status: 'active' | 'paused' | 'completed' | 'withdrawn'
  progress: number
  lessons_completed: number
  completion_date?: string
}

export interface Review {
  id: number
  user_id: number
  user_name: string
  user_email: string
  rating: number
  comment: string
  status: string
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface Analytics {
  total_enrollments: number
  enrollments_by_status: {
    active: number
    completed: number
    paused: number
    withdrawn: number
  }
  average_completion_percentage: number
  completion_rate: number
  total_revenue: number
  revenue_per_student: number
}

export interface CourseFullProfile extends Course {
  lessons?: Lesson[]
  students?: {
    total: number
    active: number
    completed: number
    paused: number
    withdrawn: number
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
      console.log('[CourseService] Fetching full course profile from backend:', {
        courseId,
        endpoint: `/admin/courses/${courseId}/full-profile`,
        includes: includeParam,
      })
      const response = await apiClient.get(`/admin/courses/${courseId}/full-profile`, {
        params: { includes: includeParam },
      })
      const courseData = response.data.data.course
      console.log('[CourseService] Course profile received from backend:', {
        id: courseData.id,
        title: courseData.title,
        price: courseData.price,
        price_naira: courseData.price_naira,
        is_free: courseData.is_free,
        is_paid: courseData.is_paid,
        price_display: courseData.price_display,
        updated_at: courseData.updated_at,
      })
      return courseData
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
      console.log('[CourseService] Updating pricing for course:', courseId)
      console.log('[CourseService] Price to update (naira):', price)
      
      // Try the dedicated pricing endpoint first
      let response
      try {
        console.log('[CourseService] Trying /admin/courses/{courseId}/pricing endpoint...')
        response = await apiClient.put(`/admin/courses/${courseId}/pricing`, {
          price_naira: price,
        })
        console.log('[CourseService] Pricing endpoint success:', response.data)
      } catch (pricingEndpointError: any) {
        console.warn('[CourseService] Pricing endpoint failed, trying main course update endpoint...')
        console.warn('[CourseService] Pricing endpoint error:', pricingEndpointError.message)
        
        // Fallback: try the main course update endpoint with price
        response = await apiClient.put(`/admin/courses/${courseId}`, {
          price_naira: price,
        })
        console.log('[CourseService] Main endpoint success:', response.data)
      }
      
      const updatedCourse = response.data.data?.course || response.data.data
      console.log('[CourseService] Updated course data:', updatedCourse)
      return updatedCourse
    } catch (error: any) {
      console.error(`[CourseService] Failed to update course pricing ${courseId}:`, error)
      console.error('[CourseService] Error response:', error.response?.data)
      console.error('[CourseService] Error message:', error.message)
      console.error('[CourseService] Error status:', error.status || error.response?.status)
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

