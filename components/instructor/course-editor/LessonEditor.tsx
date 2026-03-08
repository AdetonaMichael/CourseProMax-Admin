'use client'

import React, { useState, useEffect } from 'react'
import { Lesson, CreateLessonRequest, LessonType, CourseDifficulty } from '@/types'
import { lessonService } from '@/services/lesson.service'
import { X, Save, Loader } from 'lucide-react'

interface LessonEditorProps {
  courseId: number
  lesson?: Lesson
  isOpen: boolean
  onClose: () => void
  onSave: (lesson: Lesson) => void
}

const LESSON_TYPES: LessonType[] = [
  'video',
  'reading',
  'quiz',
  'assignment',
  'interactive',
  'mixed',
  'resource',
]

const DIFFICULTY_LEVELS: CourseDifficulty[] = ['beginner', 'intermediate', 'advanced']

export const LessonEditor: React.FC<LessonEditorProps> = ({
  courseId,
  lesson,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreateLessonRequest>({
    title: '',
    description: '',
    content: '',
    type: 'video',
    order: 1,
    is_active: true,
    is_preview: false,
    estimated_duration_minutes: 10,
    difficulty: 'beginner',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        type: lesson.type,
        order: lesson.order,
        is_active: lesson.is_active,
        is_preview: lesson.is_preview,
        estimated_duration_minutes: lesson.estimated_duration_minutes,
        difficulty: lesson.difficulty,
        completion_score_required: lesson.completion_score_required,
        bunny_video_id: lesson.bunny_video_id,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        type: 'video',
        order: 1,
        is_active: true,
        is_preview: false,
        estimated_duration_minutes: 10,
        difficulty: 'beginner',
      })
    }
    setErrors({})
    setSuccess(false)
  }, [lesson, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required'
    }
    if (formData.title && formData.title.length > 255) {
      newErrors.title = 'Title cannot exceed 255 characters'
    }
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters'
    }
    if (formData.estimated_duration_minutes && formData.estimated_duration_minutes < 1) {
      newErrors.estimated_duration_minutes = 'Duration must be at least 1 minute'
    }
    if (
      formData.completion_score_required &&
      (formData.completion_score_required < 0 || formData.completion_score_required > 100)
    ) {
      newErrors.completion_score_required = 'Score must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setSuccess(false)

      let savedLesson: Lesson

      if (lesson) {
        savedLesson = await lessonService.updateLesson(courseId, lesson.id, formData)
      } else {
        savedLesson = await lessonService.createLesson(courseId, formData)
      }

      setSuccess(true)
      setTimeout(() => {
        onSave(savedLesson)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Failed to save lesson:', error)
      setErrors({
        submit: 'Failed to save lesson. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any
    const finalValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? (value ? parseInt(value) : undefined) : finalValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">{lesson ? 'Edit Lesson' : 'Create New Lesson'}</h2>
          <button onClick={onClose} disabled={loading} className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="p-3 mb-5 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
              <p>{errors.submit}</p>
            </div>
          )}

          {success && (
            <div className="p-3 mb-5 bg-green-50 text-green-600 border border-green-200 rounded text-sm">
              <p>✓ Lesson saved successfully!</p>
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1.5">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter lesson title"
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <span className="block text-red-600 text-xs mt-1">{errors.title}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-1.5">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-900 mb-1.5">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Enter lesson description"
              disabled={loading}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 resize-vertical ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <span className="block text-red-600 text-xs mt-1">{errors.description}</span>}
          </div>

          <div className="mb-5">
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-1.5">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              placeholder="Enter lesson content or notes"
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 resize-vertical"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-900 mb-1.5">Estimated Duration (min)</label>
              <input
                id="duration"
                type="number"
                name="estimated_duration_minutes"
                value={formData.estimated_duration_minutes || ''}
                onChange={handleInputChange}
                min="1"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 ${errors.estimated_duration_minutes ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.estimated_duration_minutes && <span className="block text-red-600 text-xs mt-1">{errors.estimated_duration_minutes}</span>}
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-900 mb-1.5">Order</label>
              <input
                id="order"
                type="number"
                name="order"
                value={formData.order || ''}
                onChange={handleInputChange}
                min="1"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-900 mb-1.5">Completion Score (%)</label>
              <input
                id="score"
                type="number"
                name="completion_score_required"
                value={formData.completion_score_required || ''}
                onChange={handleInputChange}
                min="0"
                max="100"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 ${errors.completion_score_required ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.completion_score_required && <span className="block text-red-600 text-xs mt-1">{errors.completion_score_required}</span>}
            </div>

            <div>
              <label htmlFor="bunnyId" className="block text-sm font-medium text-gray-900 mb-1.5">Bunny Video ID</label>
              <input
                id="bunnyId"
                type="text"
                name="bunny_video_id"
                value={formData.bunny_video_id || ''}
                onChange={handleInputChange}
                placeholder="e.g., abc123def456"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                disabled={loading}
                className="w-4 h-4 accent-blue-600 disabled:opacity-50"
              />
              <span className="text-gray-700">Published</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="is_preview"
                checked={formData.is_preview}
                onChange={handleInputChange}
                disabled={loading}
                className="w-4 h-4 accent-blue-600 disabled:opacity-50"
              />
              <span className="text-gray-700">Preview Available</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {lesson ? 'Update Lesson' : 'Create Lesson'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
