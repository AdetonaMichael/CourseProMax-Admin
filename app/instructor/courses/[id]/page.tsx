'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Lesson } from '@/types'
import { courseService } from '@/services/course.service'
import { LessonList } from '@/components/instructor/course-editor/LessonList'
import { LessonEditor } from '@/components/instructor/course-editor/LessonEditor'
import { VideoManager } from '@/components/instructor/course-editor/VideoManager'
import { QuizBuilder } from '@/components/instructor/course-editor/QuizBuilder'
import { ChevronDown, ChevronUp, Book, Users, Star, Clock } from 'lucide-react'

interface CourseDetails {
  id: number
  title: string
  description: string
  thumbnail?: string
  price: number
  level: string
  total_lessons: number
  students_count: number
  rating: number
  created_at: string
  category_name?: string
}

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = parseInt(params?.id as string) || 0

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState<string | null>(null)

  const [addLessonExpanded, setAddLessonExpanded] = useState(false)
  const [editorModalOpen, setEditorModalOpen] = useState(false)
  const [videoManagerOpen, setVideoManagerOpen] = useState(false)
  const [quizBuilderOpen, setQuizBuilderOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setCourseLoading(true)
      setCourseError(null)
      const details = await courseService.getCourseFullProfile(courseId)
      setCourse(details as any)
    } catch (err) {
      console.error('Failed to fetch course details:', err)
      setCourseError('Failed to load course details')
    } finally {
      setCourseLoading(false)
    }
  }

  const handleAddLesson = () => {
    setSelectedLesson(undefined)
    setAddLessonExpanded(false)
    setEditorModalOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setEditorModalOpen(true)
  }

  const handleSaveLesson = (lesson: Lesson) => {
    setRefreshTrigger(prev => prev + 1)
    setEditorModalOpen(false)
  }

  const handleDeleteLesson = (lessonId: number) => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleManageVideos = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setVideoManagerOpen(true)
  }

  const handleManageQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setQuizBuilderOpen(true)
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600">{courseError || 'Course not found'}</p>
            <button
              onClick={fetchCourseDetails}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                {course.category_name && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Category:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{course.category_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Level:</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{course.level}</span>
                </div>
              </div>
            </div>

            {course.thumbnail && (
              <div className="hidden lg:block flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-48 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Book className="text-blue-600" size={24} />
              <div>
                <p className="text-xs text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{course.total_lessons}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="text-purple-600" size={24} />
              <div>
                <p className="text-xs text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{course.students_count}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Star className="text-yellow-600" size={24} />
              <div>
                <p className="text-xs text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{course.rating.toFixed(1)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-xs text-gray-600">Price</p>
                <p className="text-2xl font-bold text-gray-900">₦{course.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Lesson Inline Form Section */}
        <div className="mb-8">
          <button
            onClick={() => setAddLessonExpanded(!addLessonExpanded)}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Add New Lesson</p>
                <p className="text-sm text-gray-600">Click to create a new lesson for this course</p>
              </div>
            </div>
            {addLessonExpanded ? (
              <ChevronUp className="text-blue-600" size={24} />
            ) : (
              <ChevronDown className="text-gray-400 group-hover:text-blue-600" size={24} />
            )}
          </button>

          {/* Expanded Inline Lesson Form */}
          {addLessonExpanded && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Lesson</h3>
                <p className="text-sm text-gray-600">Fill in the lesson details below</p>
              </div>

              <LessonEditorInline
                courseId={courseId}
                onCancel={() => setAddLessonExpanded(false)}
                onSave={() => {
                  setAddLessonExpanded(false)
                  setRefreshTrigger(prev => prev + 1)
                }}
              />
            </div>
          )}
        </div>

        {/* Lessons List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Book size={28} />
              Course Lessons
            </h2>
          </div>

          <div className="p-6">
            <LessonList
              courseId={courseId}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onAddLesson={handleAddLesson}
              onManageVideos={handleManageVideos}
              onManageQuiz={handleManageQuiz}
              refreshTrigger={refreshTrigger}
              hideAddButton={true}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {editorModalOpen && (
        <LessonEditor
          courseId={courseId}
          lesson={selectedLesson}
          isOpen={editorModalOpen}
          onClose={() => setEditorModalOpen(false)}
          onSave={handleSaveLesson}
        />
      )}

      {videoManagerOpen && selectedLesson && (
        <VideoManager
          lesson={selectedLesson}
          isOpen={videoManagerOpen}
          onClose={() => setVideoManagerOpen(false)}
          onSave={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}

      {quizBuilderOpen && selectedLesson && (
        <QuizBuilder
          lesson={selectedLesson}
          isOpen={quizBuilderOpen}
          onClose={() => setQuizBuilderOpen(false)}
          onSave={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </div>
  )
}

// Inline Lesson Editor Component
const LessonEditorInline: React.FC<{
  courseId: number
  onCancel: () => void
  onSave: () => void
}> = ({ courseId, onCancel, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    content: '',
    type: 'video' as any,
    order: 1,
    is_active: true,
    is_preview: false,
    estimated_duration_minutes: 10,
    difficulty: 'beginner' as any,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const { lessonService } = await import('@/services/lesson.service')
      await lessonService.createLesson(courseId, formData)
      onSave()
    } catch (err) {
      console.error('Failed to create lesson:', err)
      setErrors({ submit: 'Failed to create lesson' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : undefined) : finalValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const LESSON_TYPES = ['video', 'reading', 'quiz', 'assignment', 'interactive', 'mixed', 'resource']
  const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced']

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.submit && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter lesson title"
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <span className="text-red-600 text-xs mt-1">{errors.title}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          >
            {LESSON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Duration (minutes)</label>
          <input
            type="number"
            name="estimated_duration_minutes"
            value={formData.estimated_duration_minutes || ''}
            onChange={handleInputChange}
            min="1"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          placeholder="Enter lesson description"
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 resize-vertical"
        />
      </div>

      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            disabled={loading}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700">Publish</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="is_preview"
            checked={formData.is_preview}
            onChange={handleInputChange}
            disabled={loading}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700">Preview Available</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition"
        >
          {loading ? 'Creating...' : 'Create Lesson'}
        </button>
      </div>
    </form>
  )
}
