export type LessonType = 'video' | 'reading' | 'quiz' | 'assignment' | 'interactive' | 'mixed' | 'resource'

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Lesson {
  id: number
  course_id: number
  title: string
  description?: string
  content?: string
  type: LessonType
  order: number
  is_active: boolean
  is_preview: boolean
  estimated_duration_minutes?: number
  difficulty?: CourseDifficulty
  completion_score_required?: number
  bunny_video_id?: string
  stream_url?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: number
  title: string
  description: string
  instructor_id: number
  category_id: number
  thumbnail_url?: string
  price: number
  is_published: boolean
  total_lessons: number
  total_enrollments: number
  created_at: string
  updated_at: string
  lessons?: Lesson[]
}

export interface CourseListResponse {
  data: Course[]
  pagination: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface CreateCourseRequest {
  title: string
  description: string
  category_id: number
  price: number
  thumbnail_url?: string
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  is_published?: boolean
}
