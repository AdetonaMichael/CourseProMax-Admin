'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiClient } from '@/services/api-client'
import { useAlert } from '@/hooks/useAlert'

interface QuestionOption {
  label: string
  is_correct: boolean
}

interface Question {
  question: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'
  options?: QuestionOption[]
  correct_answer?: string
  points: number
  explanation: string
}

interface QuizEditorModalProps {
  courseId: number
  lessonId: number
  lessonTitle: string
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  isOpen,
  onClose,
  onSaved,
}) => {
  const alert = useAlert()
  const [step, setStep] = useState<'settings' | 'questions' | 'review'>('settings')

  // Quiz settings
  const [time_limit, setTimeLimit] = useState<number | null>(30)
  const [passing_score, setPassingScore] = useState(70)
  const [shuffle_questions, setShuffleQuestions] = useState(false)
  const [show_answers, setShowAnswers] = useState(true)
  const [allow_retake, setAllowRetake] = useState(true)

  // Questions
  const [questions, setQuestions] = useState<Question[]>([])

  // State
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Fetch existing quiz on mount
  useEffect(() => {
    if (isOpen) {
      loadQuizData()
    }
  }, [isOpen, courseId, lessonId])

  const loadQuizData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch from lesson endpoint instead of quiz endpoint
      const response = await apiClient.get(`/lessons/${lessonId}`)
      
      console.log('📋 Lesson with Quiz Response:', response.data)

      if (response.data?.data?.lesson) {
        const lesson = response.data.data.lesson
        const metadata = lesson.metadata
        
        // Extract quiz settings
        if (metadata?.quiz_data) {
          setPassingScore(metadata.quiz_data.passing_score ?? 70)
          setTimeLimit(metadata.quiz_data.time_limit_minutes ?? null)
          setShuffleQuestions(metadata.quiz_data.shuffle_questions ?? false)
          setShowAnswers(metadata.quiz_data.show_feedback ?? true)
          setAllowRetake(true) // Default since not in quiz_data
        }
        
        // Extract and transform questions from metadata.questions
        if (Array.isArray(metadata?.questions) && metadata.questions.length > 0) {
          console.log(`✅ EDIT MODE - Loaded ${metadata.questions.length} questions`)
          
          // Transform legacy format to expected API format
          const transformedQuestions = metadata.questions.map((q: any) => {
            const questionType = q.type
              ?.replace('multiple-choice', 'multiple_choice')
              ?.replace('true-false', 'true_false')
              ?.replace('short-answer', 'short_answer') || 'multiple_choice'
            
            const transformedQuestion: Question = {
              question: q.question,
              question_type: questionType as any,
              points: q.points || 5,
              explanation: q.explanation || '',
            }
            
            // Handle different question types
            if (questionType === 'multiple_choice') {
              // Transform options array with correct_answer index to options with is_correct flag
              transformedQuestion.options = q.options.map((label: string, idx: number) => ({
                label,
                is_correct: idx === q.correct_answer
              }))
            } else if (questionType === 'true_false') {
              // Transform true/false answers
              transformedQuestion.options = [
                { label: 'True', is_correct: q.correct_answer === true || q.correct_answer === 'true' },
                { label: 'False', is_correct: q.correct_answer === false || q.correct_answer === 'false' }
              ]
            } else if (questionType === 'short_answer') {
              // For short answers, store correct_answer as string or array
              transformedQuestion.correct_answer = Array.isArray(q.correct_answer) 
                ? q.correct_answer[0] 
                : q.correct_answer
            }
            
            return transformedQuestion
          })
          
          setQuestions(transformedQuestions)
          setIsEditMode(true)
        } else {
          console.log('➕ CREATE MODE - No questions in metadata')
          setQuestions([])
          setIsEditMode(false)
        }
      } else {
        console.log('➕ CREATE MODE - Invalid lesson response')
        setQuestions([])
        setIsEditMode(false)
      }
      setStep('settings')
    } catch (err: any) {
      console.error('Error loading lesson:', err.message)
      console.log('➕ CREATE MODE - Error loading lesson')
      setQuestions([])
      setIsEditMode(false)
      setStep('settings')
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      question_type: 'multiple_choice',
      options: [
        { label: '', is_correct: false },
        { label: '', is_correct: false },
      ],
      points: 5,
      explanation: '',
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, label: string, isCorrect?: boolean) => {
    const updated = [...questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    updated[questionIndex].options![optionIndex] = {
      label,
      is_correct: isCorrect !== undefined ? isCorrect : updated[questionIndex].options![optionIndex].is_correct,
    }
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index)
    setQuestions(updated)
  }

  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    updated[questionIndex].options!.push({ label: '', is_correct: false })
    setQuestions(updated)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    if (updated[questionIndex].options && updated[questionIndex].options!.length > 2) {
      updated[questionIndex].options = updated[questionIndex].options!.filter((_, i) => i !== optionIndex)
      setQuestions(updated)
    }
  }

  const validateQuiz = (): boolean => {
    if (questions.length === 0) {
      setError('At least one question is required')
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`)
        return false
      }

      if (q.question_type === 'multiple_choice' || q.question_type === 'true_false') {
        if (!q.options || q.options.length === 0) {
          setError(`Question ${i + 1} must have options`)
          return false
        }
        if (q.options.some(opt => !opt.label.trim())) {
          setError(`All options in Question ${i + 1} must have text`)
          return false
        }
        const hasCorrect = q.options.some(opt => opt.is_correct)
        if (!hasCorrect) {
          setError(`Question ${i + 1} must have a correct answer`)
          return false
        }
      }
    }

    return true
  }

  const handleSave = async () => {
    if (!validateQuiz()) return

    try {
      setSaving(true)
      setError(null)

      const quizPayload = {
        questions: questions.map(q => ({
          question: q.question,
          question_type: q.question_type,
          ...(q.options && { options: q.options }),
          points: q.points,
          explanation: q.explanation,
        })),
        time_limit: time_limit,
        passing_score: passing_score,
        shuffle_questions: shuffle_questions,
        show_answers: show_answers,
        allow_retake: allow_retake,
      }

      console.log('📤 Saving quiz:', quizPayload)

      const response = await apiClient[isEditMode ? 'put' : 'post'](
        `/admin/courses/${courseId}/lessons/${lessonId}/quiz`,
        quizPayload
      )

      console.log('✅ Quiz response:', response.data)

      // Backend returns status: true or success: true
      if (response.data?.success || response.data?.status) {
        alert.success(`Quiz ${isEditMode ? 'updated' : 'created'} successfully!`)
        onSaved?.()
        onClose()
      } else {
        setError(response.data?.message || 'Failed to save quiz')
      }
    } catch (err: any) {
      console.error('Failed to save quiz:', err)
      
      if (err.response?.data?.data) {
        const errors = err.response.data.data
        const errorMessages = Object.entries(errors)
          .map(([key, value]: [string, any]) => {
            if (Array.isArray(value)) return value.join(', ')
            return value
          })
          .join('\n')
        setError(errorMessages)
      } else {
        setError(err.message || 'Failed to save quiz')
      }
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {isEditMode ? '✏️ Edit Quiz' : '➕ Create New Quiz'}
            </h2>
            <p className="text-xs text-gray-600 mt-1">Step {step === 'settings' ? 1 : step === 'questions' ? 2 : 3} of 3 • {isEditMode ? 'Editing existing quiz' : 'Creating new quiz'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Step 1: Settings */}
          {step === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={passing_score}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={time_limit || ''}
                    onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffle_questions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Shuffle questions for each attempt</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={show_answers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Show correct answers after submission</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allow_retake}
                    onChange={(e) => setAllowRetake(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Allow students to retake quiz</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 'questions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">
                  Questions ({questions.length})
                </h3>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  <Plus size={18} />
                  Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No questions added yet</p>
                  <button
                    onClick={addQuestion}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                  >
                    <Plus size={18} />
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, idx) => (
                    <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-black">Question {idx + 1}</h4>
                        <button
                          onClick={() => removeQuestion(idx)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                          rows={2}
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={question.question_type}
                            onChange={(e) => {
                              updateQuestion(idx, 'question_type', e.target.value)
                              if (e.target.value === 'true_false') {
                                updateQuestion(idx, 'options', [
                                  { label: 'True', is_correct: false },
                                  { label: 'False', is_correct: false },
                                ])
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                          >
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="short_answer">Short Answer</option>
                            <option value="essay">Essay</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={(e) => updateQuestion(idx, 'points', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                          />
                        </div>
                      </div>

                      {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Options
                            </label>
                            {question.question_type === 'multiple_choice' && (
                              <button
                                onClick={() => addOption(idx)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                + Add Option
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {question.options?.map((option, optIdx) => (
                              <div key={optIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option.label}
                                  onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                                  placeholder={`Option ${optIdx + 1}`}
                                />
                                <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                  <input
                                    type="radio"
                                    name={`correct-${idx}`}
                                    checked={option.is_correct}
                                    onChange={() => {
                                      const updated = [...questions]
                                      updated[idx].options!.forEach((o, i) => {
                                        o.is_correct = i === optIdx
                                      })
                                      setQuestions(updated)
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-xs font-medium text-gray-700">Correct</span>
                                </label>
                                {question.question_type === 'multiple_choice' && question.options!.length > 2 && (
                                  <button
                                    onClick={() => removeOption(idx, optIdx)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(question.question_type === 'short_answer' || question.question_type === 'essay') && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer {question.question_type === 'essay' && '(for reference)'}
                          </label>
                          <input
                            type="text"
                            value={question.correct_answer || ''}
                            onChange={(e) => updateQuestion(idx, 'correct_answer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                            placeholder="Expected answer"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explanation
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                          rows={2}
                          placeholder="Why is this the correct answer?"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Quiz Summary</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Questions:</strong> {questions.length}</p>
                  <p><strong>Passing Score:</strong> {passing_score}%</p>
                  <p><strong>Time Limit:</strong> {time_limit ? `${time_limit} minutes` : 'Unlimited'}</p>
                  <p><strong>Shuffle:</strong> {shuffle_questions ? 'Yes' : 'No'}</p>
                  <p><strong>Show Answers:</strong> {show_answers ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-black">Questions Preview</h4>
                {questions.map((q, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-medium text-black mb-2">Q{idx + 1}: {q.question}</p>
                    {q.options && (
                      <div className="space-y-1 text-sm text-gray-600">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className={opt.is_correct ? 'text-green-700 font-medium' : ''}>
                            {opt.label} {opt.is_correct && '✓'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-xl">
          <button
            onClick={() => {
              if (step === 'settings') onClose()
              else if (step === 'questions') setStep('settings')
              else setStep('questions')
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button
            onClick={() => {
              if (step === 'settings') setStep('questions')
              else if (step === 'questions') setStep('review')
              else handleSave()
            }}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition font-medium"
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {step === 'review' ? (isEditMode ? '💾 Update Quiz' : '✅ Create Quiz') : 'Next'}
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
