'use client'

import React, { useState } from 'react';
import { VideoEditor } from './VideoEditor';
import { QuizEditor } from './QuizEditor';
import { QuizEditorModal } from './QuizEditorModal';
import { Video, HelpCircle, Trash2, BookOpen, GripVertical, CheckCircle2, Edit2 } from 'lucide-react';
import { useConfirmation } from '@/components/shared/ConfirmationDialog';

interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
  estimated_duration_minutes: number;
  difficulty: string;
  is_active: boolean;
  is_preview: boolean;
  bunny_video_id?: string;
  type?: string;
  completion_score_required?: string | number;
}

export const LessonList = ({
  lessons = [],
  courseId,
  hideAddButton,
}: {
  lessons?: Lesson[];
  courseId?: number;
  hideAddButton?: boolean;
}) => {
  const { confirm } = useConfirmation()
  const [selectedLesson, setSelectedLesson]   = useState<Lesson | null>(null)
  const [showVideoEditor, setShowVideoEditor] = useState(false)
  const [showQuizEditor, setShowQuizEditor]   = useState(false)
  const [showQuizModal, setShowQuizModal]     = useState(false)
  const [refreshTrigger, setRefreshTrigger]   = useState(0)

  const handleAddVideo = (lesson: Lesson) => { setSelectedLesson(lesson); setShowVideoEditor(true) }
  const handleAddQuiz  = (lesson: Lesson) => { setSelectedLesson(lesson); setShowQuizEditor(true)  }
  const handleEditQuiz = (lesson: Lesson) => { setSelectedLesson(lesson); setShowQuizModal(true) }

  const handleDeleteLesson = async (lessonId: number) => {
    const confirmed = await confirm({
      title:       'Delete Lesson',
      description: 'Are you sure you want to delete this lesson? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText:  'Cancel',
      isDangerous: true,
    })
    if (confirmed) console.log('Delete lesson:', lessonId)
  }

  const difficultyStyle = (d: string) => {
    switch (d.toLowerCase()) {
      case 'beginner':     return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'intermediate': return 'bg-gray-200 text-gray-700 border-gray-300'
      case 'advanced':     return 'bg-gray-800 text-white border-gray-700'
      default:             return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // Empty state
  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-gray-200 border-dashed rounded-2xl text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <BookOpen size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No lessons yet</p>
        <p className="text-xs text-gray-400 font-light max-w-xs">
          Add your first lesson to start building this course curriculum.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="group flex items-start gap-4 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            {/* Drag handle + order */}
            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
              <GripVertical size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors cursor-grab" />
              <span className="text-xs font-bold text-gray-400 w-5 text-center">{lesson.order}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="text-sm font-semibold text-black leading-snug truncate">
                  {lesson.title}
                </h4>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2 mb-3">
                {lesson.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-600 font-medium">
                  {lesson.estimated_duration_minutes}m
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${difficultyStyle(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                  lesson.is_active
                    ? 'bg-gray-900 text-white border-gray-800'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {lesson.is_active ? 'Active' : 'Inactive'}
                </span>
                {lesson.is_preview && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-xs font-medium">
                    Free Preview
                  </span>
                )}
                
                {/* Content Type Indicators */}
                {(lesson.bunny_video_id && lesson.bunny_video_id !== "0" && lesson.bunny_video_id.trim() !== "") && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-md text-xs font-semibold">
                    <Video size={12} />
                    Has Video
                  </span>
                )}
                {(lesson.type === 'quiz' || (lesson.completion_score_required && parseFloat(lesson.completion_score_required.toString()) > 0)) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-md text-xs font-semibold">
                    <CheckCircle2 size={12} />
                    Has Quiz
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
              <button
                onClick={() => handleAddVideo(lesson)}
                title="Add Video"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
              >
                <Video size={13} />
                <span className="hidden sm:inline">Video</span>
              </button>

              {/* Quiz Button - Changes based on whether quiz exists */}
              {(lesson.type === 'quiz' || (lesson.completion_score_required && parseFloat(lesson.completion_score_required.toString()) > 0)) ? (
                <button
                  onClick={() => handleEditQuiz(lesson)}
                  title="Edit Quiz"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={13} />
                  <span className="hidden sm:inline">Edit Quiz</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAddQuiz(lesson)}
                  title="Add Quiz"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  <HelpCircle size={13} />
                  <span className="hidden sm:inline">Quiz</span>
                </button>
              )}

              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                title="Delete Lesson"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 border border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Quiz Editor Modal - New multi-step form */}
      {showQuizModal && selectedLesson && courseId && (
        <QuizEditorModal
          courseId={courseId}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false)
            setSelectedLesson(null)
            setRefreshTrigger(prev => prev + 1)
          }}
          onSaved={() => {
            setRefreshTrigger(prev => prev + 1)
          }}
        />
      )}

      {/* Video Editor Modal */}
      {showVideoEditor && selectedLesson && courseId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-gray-100">
            <VideoEditor
              courseId={courseId}
              lesson={selectedLesson}
              onClose={() => { setShowVideoEditor(false); setSelectedLesson(null) }}
              onVideoChange={() => window.location.reload()}
            />
          </div>
        </div>
      )}

      {/* Legacy Quiz Editor Modal (kept for backward compatibility) */}
      {showQuizEditor && selectedLesson && courseId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-gray-100">
            <QuizEditor
              courseId={courseId}
              lessonId={selectedLesson.id}
              lesson={selectedLesson}
              onClose={() => { setShowQuizEditor(false); setSelectedLesson(null) }}
            />
          </div>
        </div>
      )}
    </>
  )
}