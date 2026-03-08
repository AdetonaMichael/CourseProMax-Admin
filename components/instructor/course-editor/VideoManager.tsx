'use client'

import React, { useState, useEffect } from 'react'
import { Lesson, Video, CreateVideoRequest } from '@/types'
import { lessonService } from '@/services/lesson.service'
import { X, Plus, Trash2, Loader } from 'lucide-react'
import { useConfirmation } from '@/components/shared/ConfirmationDialog'

interface VideoManagerProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export const VideoManager: React.FC<VideoManagerProps> = ({
  lesson,
  isOpen,
  onClose,
  onSave,
}) => {
  const { confirm } = useConfirmation()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: '',
    video_url: '',
    order: 1,
    is_published: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      fetchVideos()
    }
  }, [isOpen])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      // Note: You may need to create a getVideosByLesson method in the lesson service
      // For now, we'll assume videos come with lesson details or via a separate call
      setVideos([]) // Placeholder - fetch actual videos
    } catch (err) {
      console.error('Failed to fetch videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    if (!formData.video_url.trim()) {
      errors.video_url = 'Video URL is required'
    } else if (!isValidUrl(formData.video_url)) {
      errors.video_url = 'Invalid URL format'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      await lessonService.addVideoToLesson(lesson.id, {
        title: formData.title,
        video_url: formData.video_url,
      })
      setFormData({ title: '', video_url: '', order: 1, is_published: true })
      setShowForm(false)
      fetchVideos()
    } catch (err) {
      console.error('Failed to add video:', err)
      setError('Failed to add video')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId: number) => {
    const confirmed = await confirm({
      title: 'Delete Video',
      description: 'Are you sure you want to delete this video? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
    })

    if (confirmed) {
      try {
        setLoading(true)
        // Note: You may need to create a deleteVideo method in the lesson service
        setVideos(videos.filter(v => v.id !== videoId))
      } catch (err) {
        console.error('Failed to delete video:', err)
        setError('Failed to delete video')
      } finally {
        setLoading(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Videos</h2>
          <button onClick={onClose} disabled={loading} className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Lesson: <span className="font-semibold">{lesson.title}</span></p>

          {error && (
            <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
              {error}
            </div>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-6"
            >
              <Plus size={18} />
              Add Video
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">Video Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    if (formErrors.title) setFormErrors({ ...formErrors, title: '' })
                  }}
                  placeholder="e.g., Introduction"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.title && <span className="text-red-600 text-xs mt-1">{formErrors.title}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">Video URL *</label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => {
                    setFormData({ ...formData, video_url: e.target.value })
                    if (formErrors.video_url) setFormErrors({ ...formErrors, video_url: '' })
                  }}
                  placeholder="https://example.com/video.mp4"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-100 ${formErrors.video_url ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.video_url && <span className="text-red-600 text-xs mt-1">{formErrors.video_url}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Video'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ title: '', video_url: '', order: 1, is_published: true })
                    setFormErrors({})
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading && !videos.length ? (
            <div className="text-center py-8">
              <Loader size={32} className="animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600 text-sm">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">📹 No videos added yet</p>
              <p className="text-sm text-gray-500">Add your first video to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                    <p className="text-xs text-gray-500 truncate mt-1">{video.video_url}</p>
                    {video.duration_seconds && (
                      <p className="text-xs text-gray-600 mt-1">Duration: {Math.floor(video.duration_seconds / 60)}m {video.duration_seconds % 60}s</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(video.id)}
                    disabled={loading}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 flex-shrink-0"
                    title="Delete video"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
