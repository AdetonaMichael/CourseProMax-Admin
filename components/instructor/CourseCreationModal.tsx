'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader } from 'lucide-react'
import { courseService, CreateCourseRequest, fetchAllCategories, Category } from '@/services/course.service'
import { useAlert } from '@/hooks/useAlert'

interface CourseCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormErrors {
  [key: string]: string[]
}

export function CourseCreationModal({ isOpen, onClose, onSuccess }: CourseCreationModalProps) {
  const alert = useAlert()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    instructor_name: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: '',
    duration: '',
    thumbnail: '',
    certificate_available: false,
    is_active: true,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: [] }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = ['Title is required']
    }
    if (!formData.description.trim()) {
      newErrors.description = ['Description is required']
    }
    if (!formData.category_id) {
      newErrors.category_id = ['Category is required']
    }
    if (!formData.instructor_name.trim()) {
      newErrors.instructor_name = ['Instructor name is required']
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = ['Price must be 0 or higher']
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
      setSubmitting(true)
      setSubmitError(null)

      const payload: CreateCourseRequest = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id as string),
        instructor_name: formData.instructor_name,
        level: formData.level,
        price: formData.price ? parseFloat(formData.price) : 0,
        duration: formData.duration || '',
        thumbnail: formData.thumbnail || '',
        certificate_available: formData.certificate_available,
        is_active: formData.is_active,
      }

      await courseService.createCourse(payload)

      alert.success('Course created successfully!')
      onSuccess?.()
      onClose()

      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        instructor_name: '',
        level: 'Beginner',
        price: '',
        duration: '',
        thumbnail: '',
        certificate_available: false,
        is_active: true,
      })
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create course'
      setSubmitError(errorMsg)

      // Handle validation errors from API
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setErrors(err.response.data.data)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-black">Create New Course</h2>
            <p className="text-xs text-gray-600 mt-1">Fill in the course details to get started</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={submitting}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-3">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Python Basics for Beginners"
                  maxLength={255}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.title && (
                  <p className="text-red-600 text-xs font-medium mt-1">⚠️ {errors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                />
                {errors.description && (
                  <p className="text-red-600 text-xs font-medium mt-1">⚠️ {errors.description[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-600 text-xs font-medium mt-1">⚠️ {errors.category_id[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Instructor Name *
                  </label>
                  <input
                    type="text"
                    name="instructor_name"
                    value={formData.instructor_name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    maxLength={255}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  {errors.instructor_name && (
                    <p className="text-red-600 text-xs font-medium mt-1">⚠️ {errors.instructor_name[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-3">
                Course Details
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 weeks"
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="100"
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  {errors.price && (
                    <p className="text-red-600 text-xs font-medium mt-1">⚠️ {errors.price[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={submitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-3">
                Availability
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="certificate_available"
                  checked={formData.certificate_available}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-900">Certificate available upon completion</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-900">Publish course (make it visible to students)</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader className="w-4 h-4 animate-spin" />}
            Create Course
          </button>
        </div>
      </div>
    </div>
  )
}
