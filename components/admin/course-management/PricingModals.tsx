'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/shared/Button'
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
  const sanitizedPrice = !isNaN(Number(currentPrice)) ? Number(currentPrice) : 0
  const [price, setPrice] = useState<number>(sanitizedPrice)
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
      console.log('[UpdatePriceModal] Attempting to update price:', { courseId, newPrice: price, currentPrice })
      
      const result = await courseService.updateCoursePricing(parseInt(courseId), price)
      
      console.log('[UpdatePriceModal] Update successful, result:', result)
      console.log('[UpdatePriceModal] Returned price_naira:', result.price_naira)
      console.log('[UpdatePriceModal] Returned price_display:', result.price_display)
      
      // Verify the price was actually updated (check price_naira from backend)
      if (result.price_naira !== price) {
        console.warn('[UpdatePriceModal] WARNING: Backend price_naira does not match requested price!', {
          requested: price,
          returned: result.price_naira
        })
      }
      
      // Update succeeded - close modal and refresh page
      onSuccess(price)
    } catch (err: any) {
      console.error('[UpdatePriceModal] Error details:', err)
      const errorMessage = err.message || err.response?.data?.message || 'Failed to update price'
      console.error('[UpdatePriceModal] Error message:', errorMessage)
      setError(errorMessage)
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
              value={price.toString()}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="100"
              disabled={loading}
              style={{ color: '#1f2937' }}
            />
          </div>

          <p className="price-note">Current price: ₦{Number(currentPrice).toLocaleString()}</p>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={loading}>
            Update Price
          </Button>
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
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={loading}>
            Make Free
          </Button>
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
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={loading}>
            Delete Course
          </Button>
        </div>
      </div>
    </div>
  )
}
