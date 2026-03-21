'use client'

import React, { useState, useEffect } from 'react'
import { Lesson } from '@/types'
import { lessonService } from '@/services/lesson.service'
import { Trash2, Edit, Play, HelpCircle, Plus, Video, CheckCircle2 } from 'lucide-react'
import { useConfirmation } from '@/components/shared/ConfirmationDialog'
import Image from 'next/image'

interface LessonListProps {
  courseId: number
  onEditLesson: (lesson: Lesson) => void
  onDeleteLesson: (lessonId: number) => void
  onAddLesson: () => void
  onManageVideos: (lesson: Lesson) => void
  onManageQuiz: (lesson: Lesson) => void
  refreshTrigger?: number
  hideAddButton?: boolean
}

export const LessonList: React.FC<LessonListProps> = ({
  courseId,
  onEditLesson,
  onDeleteLesson,
  onAddLesson,
  onManageVideos,
  onManageQuiz,
  refreshTrigger,
  hideAddButton,
}) => {
  const { confirm } = useConfirmation()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await lessonService.getLessonsByCourseInstructor(courseId)
      console.log('📋 LessonList received lessons:', data)
      setLessons(data)
    } catch (err) {
      console.error('Failed to fetch lessons:', err)
      setError('Failed to load lessons. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [courseId, refreshTrigger])

  const handleDelete = async (lessonId: number) => {
    const confirmed = await confirm({
      title: 'Delete Lesson',
      description: 'Are you sure you want to delete this lesson? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
    })

    if (confirmed) {
      try {
        await lessonService.deleteLessonInstructor(courseId, lessonId)
        setLessons(lessons.filter(l => l.id !== lessonId))
        onDeleteLesson(lessonId)
      } catch (err) {
        console.error('Failed to delete lesson:', err)
        setError('Failed to delete lesson. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading lessons...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-8 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 mb-3 text-sm">{error}</p>
        <button onClick={fetchLessons} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition">
          Retry
        </button>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4"><Image src="/icon.png" alt="Lesson" width={64} height={64} /></div>
        <h3 className="text-lg text-gray-900 mb-2">No Lessons Yet</h3>
        <p className="text-gray-600 mb-6 text-sm">Create your first lesson to get started.</p>
        <button onClick={onAddLesson} className="flex items-center gap-2 px-4 py-2 bg-black  text-white rounded-lg hover:bg-gray-700 transition transform hover:-translate-y-0.5">
          <Plus size={20} />
          Add First Lesson
        </button>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-6">
      {!hideAddButton && (
        <div className="flex justify-between items-center gap-4 mb-6 flex-wrap sm:flex-nowrap">
          <h2 className="text-2xl font-semibold text-gray-900">Course Lessons</h2>
          <button onClick={onAddLesson} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition transform hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={20} />
            Add Lesson
          </button>
        </div>
      )}

      <div className="flex md:grid overflow-x-auto md:overflow-visible gap-5 md:grid-cols-2 lg:grid-cols-3 pb-4">
        {lessons.map((lesson) => {
          // Check for video: has bunny_video_id OR type is 'video'
          const hasVideo = (!!lesson.bunny_video_id && lesson.bunny_video_id.trim() !== '') || lesson.type === 'video'
          
          // Check for quiz: type is 'quiz' OR has completion_score_required > 0
          const completionScore = lesson.completion_score_required 
            ? parseFloat(lesson.completion_score_required.toString()) 
            : 0
          const hasQuiz = lesson.type === 'quiz' || completionScore > 0
          
          console.log(`📊 Lesson "${lesson.title}":`, {
            bunny_video_id: lesson.bunny_video_id,
            type: lesson.type,
            completion_score_required: lesson.completion_score_required,
            hasVideo,
            hasQuiz,
          })
          
          return (
            <div key={lesson.id} className="flex-shrink-0 w-full md:w-auto">
          <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-5 transition-all hover:border-gray-300 hover:shadow-md\">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                {/* Content Indicators */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {hasVideo && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200">
                      <Video size={14} />
                      Video
                    </div>
                  )}
                  {hasQuiz && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200">
                      <CheckCircle2 size={14} />
                      Quiz
                    </div>
                  )}
                </div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase whitespace-nowrap flex-shrink-0 bg-gray-100 text-gray-700 border border-gray-200">
                {lesson.type}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {lesson.description || 'No description provided'}
            </p>

            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-gray-200 text-xs">
              {lesson.estimated_duration_minutes && (
                <span className="text-gray-600">⏱️ {lesson.estimated_duration_minutes} mins</span>
              )}
              {lesson.difficulty && (
                <span className="text-amber-600">🎯 {lesson.difficulty}</span>
              )}
              <span className={lesson.is_active ? 'text-green-600 font-medium' : 'text-gray-400'}>
                {lesson.is_active ? '✓ Published' : '○ Draft'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onManageVideos(lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 transition text-xs font-medium"
                title="Manage Videos"
              >
                <Play size={16} />
                Videos
              </button>
              <button
                onClick={() => onManageQuiz(lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 transition text-xs font-medium"
                title="Manage Quiz"
              >
                <HelpCircle size={16} />
                Quiz
              </button>
              <button
                onClick={() => onEditLesson(lesson)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 transition text-xs font-medium"
                title="Edit Lesson"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition text-xs font-medium"
                title="Delete Lesson"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
