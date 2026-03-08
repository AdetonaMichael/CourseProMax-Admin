import { LessonType, CourseDifficulty, Lesson } from './course.types'

export interface CreateLessonRequest {
  title: string
  description?: string
  content?: string
  type: LessonType
  order?: number
  is_active?: boolean
  is_preview?: boolean
  estimated_duration_minutes?: number
  difficulty?: CourseDifficulty
  completion_score_required?: number
  bunny_video_id?: string
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

// Video types
export interface Video {
  id: number
  lesson_id: number
  title: string
  video_url: string
  duration_seconds?: number
  thumbnails?: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CreateVideoRequest {
  title: string
  video_url: string
  duration_seconds?: number
  order?: number
  is_published?: boolean
}

export interface UpdateVideoRequest extends Partial<CreateVideoRequest> {}

// Quiz types
export interface QuizOption {
  id?: number
  text: string
  is_correct: boolean
}

export interface QuizQuestion {
  id?: number
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: QuizOption[]
  correct_answer?: string
  explanation?: string
  points?: number
  order?: number
}

export interface Quiz {
  id: number
  lesson_id: number
  title?: string
  description?: string
  passing_score: number
  questions: QuizQuestion[]
  time_limit_minutes?: number
  shuffle_questions?: boolean
  show_answers?: boolean
  created_at: string
  updated_at: string
}

export interface CreateQuizRequest {
  title?: string
  description?: string
  passing_score?: number
  time_limit_minutes?: number
  shuffle_questions?: boolean
  show_answers?: boolean
  questions: QuizQuestion[]
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {}

// API Response types
export interface LessonWithDetails extends Lesson {
  videos?: Video[]
  quizzes?: Quiz[]
}

export interface LessonResponse {
  data: Lesson
  message?: string
}

export interface LessonListResponse {
  data: Lesson[]
  pagination?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
