'use client'

import React, { useState } from 'react'
import { X, AlertCircle, Loader2, Clock, BarChart2, Eye, Info } from 'lucide-react'
import { createLesson, handleInstructorAPIError } from '@/services/instructor.service'
import { useNotification } from '@/hooks/useNotification'
import { LessonType, Lesson } from '@/types/course.types'

interface InlineLessonEditorProps {
  courseId: number
  onClose: () => void
  onSave?: () => void
}

export const InlineLessonEditor: React.FC<InlineLessonEditorProps> = ({ courseId, onClose, onSave }) => {
  const notification = useNotification()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('video')
  const [order, setOrder] = useState(1)
  const [estimatedDuration, setEstimatedDuration] = useState(30)
  const [difficulty, setDifficulty] = useState('beginner')
  const [isPreview, setIsPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Lesson title is required')
      return
    }
    if (title.length > 255) {
      setError('Lesson title cannot exceed 255 characters')
      return
    }
    if (!description.trim()) {
      setError('Lesson description is required')
      return
    }
    if (description.length > 5000) {
      setError('Lesson description cannot exceed 5000 characters')
      return
    }

    try {
      setSaving(true)
      const lessonData: Partial<Lesson> = {
        title: title.trim(),
        description: description.trim(),
        type: type as "video" | "reading" | "quiz" | "assignment" | "interactive" | "mixed" | "resource",
        order: order,
        estimated_duration_minutes: estimatedDuration,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        is_preview: isPreview,
        is_active: true,
      }

      await createLesson(courseId, lessonData)
      notification.success('Lesson created successfully!')
      
      // Reset form
      setTitle('')
      setDescription('')
      setType('video')
      setOrder(1)
      setEstimatedDuration(30)
      setDifficulty('beginner')
      setIsPreview(false)
      
      if (onSave) {
        onSave()
      }
      onClose()
    } catch (err: any) {
      const errorObj = handleInstructorAPIError(err)
      setError(errorObj.message || err.message || 'Error creating lesson. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = `
    w-full px-3 py-2.5 text-sm text-black bg-gray-50 border border-gray-200 rounded-lg
    outline-none transition-all duration-200
    focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
    placeholder:text-gray-300
  `

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-lg font-black text-black tracking-tight leading-none"
          >
            Create Lesson
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-light">Add a new lesson to this course</p>
        </div>
        <button
          onClick={onClose}
          disabled={saving}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-5 flex items-start gap-3 px-4 py-3 rounded-lg border bg-red-50 border-red-200 text-red-800">
          <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Error</p>
            <p className="text-sm font-light">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Lesson Title <span className="text-red-400">*</span>
            </label>
            <span className={`text-xs font-medium ${title.length > 240 ? 'text-red-500' : 'text-gray-400'}`}>
              {title.length}/255
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={255}
            placeholder="e.g. Introduction to Variables"
            disabled={saving}
            className={`${inputClass} ${title.length > 240 ? 'border-red-200 bg-red-50' : ''} disabled:opacity-50`}
          />
          {title.length > 240 && (
            <p className="text-xs text-red-500 font-medium">Maximum 255 characters ({255 - title.length} remaining)</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Description <span className="text-red-400">*</span>
            </label>
            <span className={`text-xs font-medium ${description.length > 4700 ? 'text-red-500' : 'text-gray-400'}`}>
              {description.length}/5000
            </span>
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What will students learn in this lesson?"
            maxLength={5000}
            rows={3}
            disabled={saving}
            className={`${inputClass} resize-none ${description.length > 4700 ? 'border-red-200 bg-red-50' : ''} disabled:opacity-50`}
          />
          {description.length > 4700 && (
            <p className="text-xs text-red-500 font-medium">Maximum 5000 characters ({5000 - description.length} remaining)</p>
          )}
        </div>

        {/* Type + Order */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              disabled={saving}
              className={`${inputClass} cursor-pointer disabled:opacity-50`}
            >
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="interactive">Interactive</option>
              <option value="mixed">Mixed</option>
              <option value="resource">Resource</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Order <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={e => setOrder(parseInt(e.target.value) || 1)}
              disabled={saving}
              className={`${inputClass} disabled:opacity-50`}
            />
          </div>
        </div>

        {/* Duration + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide flex items-center gap-1">
              <Clock size={11} className="text-gray-400" /> Duration (mins)
            </label>
            <input
              type="number"
              min="1"
              value={estimatedDuration}
              onChange={e => setEstimatedDuration(parseInt(e.target.value) || 30)}
              disabled={saving}
              className={`${inputClass} disabled:opacity-50`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide flex items-center gap-1">
              <BarChart2 size={11} className="text-gray-400" /> Difficulty
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              disabled={saving}
              className={`${inputClass} cursor-pointer disabled:opacity-50`}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Preview toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative shrink-0">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={e => setIsPreview(e.target.checked)}
              disabled={saving}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-black transition-colors duration-200 peer-disabled:opacity-50" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4 peer-disabled:opacity-50" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 leading-none mb-0.5">Free Preview</p>
            <p className="text-xs text-gray-400 font-light">Students can access this lesson without enrolling</p>
          </div>
        </label>

        {/* Info note */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg">
          <Info size={13} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            After creating the lesson, you can attach videos and quizzes from the lesson list.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-black rounded-lg hover:opacity-80 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating...
              </>
            ) : (
              'Create Lesson'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
