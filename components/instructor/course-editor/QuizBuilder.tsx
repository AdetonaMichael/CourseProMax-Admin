'use client'

import React, { useState } from 'react'
import { Lesson, CreateQuizRequest, QuizQuestion, QuizOption } from '@/types'
import { lessonService } from '@/services/lesson.service'
import { X, Plus, Trash2, Loader } from 'lucide-react'

interface QuizBuilderProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  lesson,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreateQuizRequest>({
    title: lesson.title + ' Quiz',
    description: '',
    passing_score: 70,
    time_limit_minutes: 30,
    shuffle_questions: true,
    show_answers: false,
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question_text: '',
    question_type: 'multiple_choice',
    options: [{ text: '', is_correct: false }],
    points: 1,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateQuiz = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Quiz title is required'
    }
    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = 'Quiz must have at least one question'
    }
    if (formData.passing_score && (formData.passing_score < 0 || formData.passing_score > 100)) {
      newErrors.passing_score = 'Passing score must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addQuestion = () => {
    if (!currentQuestion.question_text?.trim()) {
      setError('Question text is required')
      return
    }

    if (currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') {
      const hasCorrect = currentQuestion.options?.some(o => o.is_correct)
      if (!hasCorrect) {
        setError('At least one option must be marked as correct')
        return
      }
    }

    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), { ...currentQuestion } as QuizQuestion],
    }))

    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: [{ text: '', is_correct: false }],
      points: 1,
    })
    setError(null)
  }

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index) || [],
    }))
  }

  const removeOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }))
  }

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), { text: '', is_correct: false }],
    }))
  }

  const updateOption = (index: number, field: 'text' | 'is_correct', value: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateQuiz()) return

    try {
      setLoading(true)
      setError(null)
      await lessonService.addQuizToLesson(lesson.id, {
        questions: formData.questions || [],
      })
      onSave()
      onClose()
    } catch (err) {
      console.error('Failed to save quiz:', err)
      setError('Failed to save quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Build Quiz</h2>
          <button onClick={onClose} disabled={loading} className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6">Lesson: <span className="font-semibold">{lesson.title}</span></p>

          {error && (
            <div className="p-3 mb-6 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Quiz Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <span className="text-red-600 text-xs mt-1">{errors.title}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Passing Score (%)</label>
              <input
                type="number"
                value={formData.passing_score || 70}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                min="0"
                max="100"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100 ${errors.passing_score ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.passing_score && <span className="text-red-600 text-xs mt-1">{errors.passing_score}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Time Limit (minutes)</label>
              <input
                type="number"
                value={formData.time_limit_minutes || 30}
                onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
                min="1"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shuffle_questions || false}
                  onChange={(e) => setFormData({ ...formData, shuffle_questions: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>Shuffle Questions</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_answers || false}
                  onChange={(e) => setFormData({ ...formData, show_answers: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>Show Answers</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Builder</h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Question Type</label>
                <select
                  value={currentQuestion.question_type || 'multiple_choice'}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question_type: e.target.value as any,
                  })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Question *</label>
                <textarea
                  value={currentQuestion.question_text || ''}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                  placeholder="Enter your question"
                  rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-vertical"
                />
              </div>

              {(currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-900">Options</label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <Plus size={14} />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={option.is_correct || false}
                          onChange={(e) => updateOption(idx, 'is_correct', e.target.checked)}
                          className="w-4 h-4 accent-gray-600"
                          title="Mark as correct"
                        />
                        <input
                          type="text"
                          value={option.text || ''}
                          onChange={(e) => updateOption(idx, 'text', e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                        />
                        {(currentQuestion.options?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Points</label>
                <input
                  type="number"
                  value={currentQuestion.points || 1}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition"
              >
                <Plus size={16} className="inline mr-2" />
                Add Question
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Added Questions ({formData.questions?.length || 0})</h4>
              {formData.questions && formData.questions.length > 0 ? (
                formData.questions.map((q, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{idx + 1}. {q.question_text}</p>
                      <p className="text-xs text-gray-600 mt-1">Type: {q.question_type} | Points: {q.points}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No questions added yet</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving Quiz...
                </>
              ) : (
                'Save Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
