import { LessonType, CourseDifficulty } from './course.types'

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
