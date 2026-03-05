'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { courseService } from '@/services/course.service'
import './PricingModals.css'

interface UpdatePriceModalProps {
  courseId: string
  currentPrice: number
  onClose: () => void
  onSuccess: (newPrice: number) => void
}

export function UpdatePriceModal({
  courseId,
  currentPrice,
  onClose,
  onSuccess,
}: UpdatePriceModalProps) {
  const [price, setPrice] = useState<number>(currentPrice)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (price < 0) {
      setError('Price cannot be negative')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await courseService.updateCoursePricing(parseInt(courseId), price)
      onSuccess(price)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update price')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Course Price</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="price">Price (₦)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              min="0"
              step="100"
              disabled={loading}
            />
          </div>

          <p className="price-note">Current price: ₦{currentPrice.toLocaleString()}</p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Price'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface MakeFreModalProps {
  courseId: string
  onClose: () => void
  onSuccess: () => void
}

export function MakeFreeModal({ courseId, onClose, onSuccess }: MakeFreModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)
      await courseService.makeCourseFree(parseInt(courseId))
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to make course free')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Make Course Free?</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}
          <p>
            Making this course free will remove all pricing. Students will be able to access it
            without payment. This action can be reversed by updating the price later.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading} className="btn-danger">
            {loading ? 'Processing...' : 'Make Free'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DeleteCourseModalProps {
  courseId: string
  courseTitle: string
  onClose: () => void
  onSuccess: () => void
}

export function DeleteCourseModal({
  courseId,
  courseTitle,
  onClose,
  onSuccess,
}: DeleteCourseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)
      await courseService.deleteCourse(parseInt(courseId))
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Course?</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}
          <p className="danger-text">
            Are you sure you want to delete <strong>{courseTitle}</strong>? This action cannot be
            undone.
          </p>
          <p className="secondary-text">
            All associated lessons, enrollments, and reviews will be removed.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading} className="btn-danger-strong">
            {loading ? 'Deleting...' : 'Delete Course'}
          </button>
        </div>
      </div>
    </div>
  )
}
