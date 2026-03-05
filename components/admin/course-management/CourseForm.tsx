'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { courseService, Course, CreateCourseRequest } from '@/services/course.service'
import './CourseForm.css'

interface CourseFormProps {
  course?: Course | null
  loading?: boolean
  onSubmit: (course: Course) => void
  onError?: (error: string) => void
}

interface FormErrors {
  [key: string]: string[]
}

export default function CourseForm({ course, loading = false, onSubmit, onError }: CourseFormProps) {
  const isEditMode = !!course

  const [formData, setFormData] = useState({
    title: course?.title || '',
    category_id: course?.category_id || 0,
    description: course?.description || '',
    instructor_name: course?.instructor_name || '',
    level: (course?.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
    price: course?.price || 0,
    duration: course?.duration || '',
    thumbnail: course?.thumbnail || '',
    ai_score: course?.ai_score || 0,
    is_active: course?.is_active || true,
    certificate_available: course?.certificate_available || false,
  })

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? parseFloat(value)
            : value,
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
    if (formData.category_id === 0) {
      newErrors.category_id = ['Category is required']
    }
    if (!formData.description.trim()) {
      newErrors.description = ['Description is required']
    }
    if (!formData.instructor_name.trim()) {
      newErrors.instructor_name = ['Instructor name is required']
    }
    if (formData.price < 0) {
      newErrors.price = ['Price must be 0 or higher']
    }
    if (formData.ai_score && (formData.ai_score < 0 || formData.ai_score > 100)) {
      newErrors.ai_score = ['AI Score must be between 0 and 100']
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

      let result: Course

      if (isEditMode && course) {
        result = await courseService.updateCourse(course.id, formData)
      } else {
        result = await courseService.createCourse(formData as CreateCourseRequest)
      }

      onSubmit(result)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save course'
      setSubmitError(errorMsg)
      onError?.(errorMsg)

      // Handle validation errors from API
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setErrors(err.response.data.data)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="course-form">
      {submitError && (
        <div className="form-error-alert">
          <AlertCircle size={16} />
          <p>{submitError}</p>
        </div>
      )}

      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label htmlFor="title">Course Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Python Basics"
            maxLength={255}
            disabled={submitting}
          />
          {errors.title && <p className="error-text">{errors.title[0]}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what students will learn..."
            rows={5}
            disabled={submitting}
          />
          {errors.description && <p className="error-text">{errors.description[0]}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              disabled={submitting}
            >
              <option value={0}>Select a category</option>
              <option value={1}>Technology</option>
              <option value={2}>Design</option>
              <option value={3}>Business</option>
              <option value={4}>Marketing</option>
              <option value={5}>Other</option>
            </select>
            {errors.category_id && <p className="error-text">{errors.category_id[0]}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="instructor_name">Instructor Name *</label>
            <input
              type="text"
              id="instructor_name"
              name="instructor_name"
              value={formData.instructor_name}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
              maxLength={255}
              disabled={submitting}
            />
            {errors.instructor_name && <p className="error-text">{errors.instructor_name[0]}</p>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Course Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              disabled={submitting}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 4 weeks"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ai_score">AI Score (0-100)</label>
            <input
              type="number"
              id="ai_score"
              name="ai_score"
              value={formData.ai_score}
              onChange={handleInputChange}
              min="0"
              max="100"
              disabled={submitting}
            />
            {errors.ai_score && <p className="error-text">{errors.ai_score[0]}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Pricing & Availability</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₦) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="100"
              disabled={submitting}
            />
            {errors.price && <p className="error-text">{errors.price[0]}</p>}
          </div>
        </div>

        <div className="form-group checkbox">
          <label htmlFor="certificate_available">
            <input
              type="checkbox"
              id="certificate_available"
              name="certificate_available"
              checked={formData.certificate_available}
              onChange={handleInputChange}
              disabled={submitting}
            />
            Certificate available for completion
          </label>
        </div>

        <div className="form-group checkbox">
          <label htmlFor="is_active">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              disabled={submitting}
            />
            Publish course (make it visible)
          </label>
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || loading}
        >
          {submitting
            ? 'Saving...'
            : isEditMode
              ? 'Update Course'
              : 'Create Course'}
        </Button>
        <p className="form-hint">
          * Required fields
        </p>
      </div>
    </form>
  )
}
