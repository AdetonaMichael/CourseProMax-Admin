export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  enrollment_date: string
  completion_date?: string
  progress_percentage: number
  is_completed: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  course?: {
    id: number
    title: string
  }
}

export interface LessonProgress {
  id: number
  user_id: number
  lesson_id: number
  is_completed: boolean
  completed_at?: string
  score?: number
}

export interface EnrollmentStats {
  total_enrolled: number
  active_learners: number
  completed_courses: number
  average_completion_time: number
}
