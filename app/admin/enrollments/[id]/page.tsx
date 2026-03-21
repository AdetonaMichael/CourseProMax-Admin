'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'
import { fetchEnrollmentDetail, handleAPIError, type EnrollmentDetail } from '@/services/admin.service'

const statusBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-blue-100 text-blue-700'
    case 'paused':
      return 'bg-yellow-100 text-yellow-700'
    case 'withdrawn':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const assignmentStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-700'
    case 'submitted':
      return 'bg-yellow-100 text-yellow-700'
    case 'graded':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const lessonTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return 'bg-blue-100 text-blue-700'
    case 'quiz':
      return 'bg-purple-100 text-purple-700'
    case 'assignment':
      return 'bg-orange-100 text-orange-700'
    case 'reading':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.id as string

  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'assignments' | 'statistics'>('overview')

  useEffect(() => {
    loadEnrollmentDetail()
  }, [enrollmentId])

  const loadEnrollmentDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchEnrollmentDetail(Number(enrollmentId))
      setEnrollment(response.enrollment)
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
      console.error('[Enrollment Detail] Error:', apiError)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
              <p className="text-gray-600 mt-2">Loading enrollment information...</p>
            </div>
            <Button variant="secondary" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading enrollment details...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !enrollment) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
              <p className="text-gray-600 mt-2">Error loading enrollment</p>
            </div>
            <Button variant="secondary" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">{error || 'Failed to load enrollment'}</p>
            <Button variant="primary" onClick={loadEnrollmentDetail} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
            <p className="text-gray-600 mt-2">ID: {enrollment.id}</p>
          </div>
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        {/* User & Course Header Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={enrollment.user.avatar || `https://ui-avatars.com/api/?name=${enrollment.user.full_name}`}
                alt={enrollment.user.full_name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <h3 className="text-xl font-bold text-gray-900">{enrollment.user.full_name}</h3>
                <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                {enrollment.user.phone && <p className="text-sm text-gray-600">{enrollment.user.phone}</p>}
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1 border-l border-gray-200 pl-6">
              <p className="text-sm text-gray-600">Course</p>
              <h3 className="text-xl font-bold text-gray-900">{enrollment.course.title}</h3>
              <p className="text-sm text-gray-600">By {enrollment.course.instructor}</p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {enrollment.course.level}
                </span>
                {enrollment.course.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {enrollment.course.category}
                  </span>
                )}
              </div>
            </div>

            {/* Status & Progress */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor(enrollment.status)}`}>
                {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Unknown'}
              </span>
              {enrollment.certificate_issued && (
                <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  ✓ Certificate Issued
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Overall Progress</span>
                <span className="text-2xl font-bold text-blue-600">{enrollment.progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${enrollment.progress.percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {enrollment.progress.lessons_completed}/{enrollment.progress.total_lessons}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Assignment Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {enrollment.assignments.graded} Graded, {enrollment.assignments.pending} Pending
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">{enrollment.statistics.average_score.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-purple-600">{(enrollment.statistics.total_time_spent_minutes / 60).toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Enrollment Timeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Enrolled Date</span>
              <span className="font-medium text-gray-900">
                {new Date(enrollment.timeline.enrolled_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Accessed</span>
              <span className="font-medium text-gray-900">
                {new Date(enrollment.timeline.last_accessed_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {enrollment.timeline.completed_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Date</span>
                <span className="font-medium text-green-600">
                  {new Date(enrollment.timeline.completed_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {enrollment.timeline.paused_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paused Date</span>
                <span className="font-medium text-yellow-600">
                  {new Date(enrollment.timeline.paused_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {enrollment.timeline.duration_days && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{enrollment.timeline.duration_days} days</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'progress', label: `Progress (${enrollment.lesson_progress.completed}/${enrollment.lesson_progress.total_tracked})` },
            { id: 'assignments', label: `Assignments (${enrollment.assignments.total})` },
            { id: 'statistics', label: 'Statistics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Course Information</h4>
                <div className="space-y-2 text-sm">
                  {enrollment.course.description && (
                    <div>
                      <p className="text-gray-600">Description</p>
                      <p className="text-gray-900">{enrollment.course.description}</p>
                    </div>
                  )}
                  {enrollment.course.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">{enrollment.course.duration}</span>
                    </div>
                  )}
                  {enrollment.course.total_lessons && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Lessons</span>
                      <span className="font-medium text-gray-900">{enrollment.course.total_lessons}</span>
                    </div>
                  )}
                  {enrollment.course.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium text-yellow-600">★ {enrollment.course.rating}/5</span>
                    </div>
                  )}
                  {enrollment.course.ai_score && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Score</span>
                      <span className="font-medium text-blue-600">{enrollment.course.ai_score}/100</span>
                    </div>
                  )}
                </div>
              </div>

              {enrollment.course.certificate_available && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-medium">
                    ✓ Certificate is available upon course completion
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Lesson Progress</h4>
              <div className="space-y-3">
                {enrollment.lesson_progress.data.map(lesson => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${lessonTypeColor(lesson.lesson_type)}`}>
                            {lesson.lesson_type.toUpperCase()}
                          </span>
                          {lesson.completed && (
                            <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                          )}
                        </div>
                        <h5 className="font-medium text-gray-900">{lesson.lesson_title}</h5>
                        <p className="text-xs text-gray-600 mt-1">
                          Time spent: {lesson.time_spent_minutes} minutes
                        </p>
                        {lesson.score !== null && (
                          <p className="text-xs text-gray-600">Score: {lesson.score}%</p>
                        )}
                      </div>
                      {lesson.completed_at && (
                        <div className="text-right text-xs text-gray-600">
                          <p>{new Date(lesson.completed_at).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Assignments</h4>
              <div className="space-y-3">
                {enrollment.assignments.data.map(assignment => (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{assignment.assignment_title}</h5>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${assignmentStatusColor(assignment.status)}`}>
                        {assignment.status ? assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1) : 'Unknown'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {assignment.status === 'graded' && assignment.score !== null && (
                        <div className="flex justify-between items-center">
                          <span>Score</span>
                          <span className="font-medium text-gray-900">{assignment.score}%</span>
                        </div>
                      )}

                      {assignment.submitted_at && (
                        <div className="flex justify-between items-center">
                          <span>Submitted</span>
                          <span className="font-medium text-gray-900">
                            {new Date(assignment.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {assignment.graded_at && (
                        <div className="flex justify-between items-center">
                          <span>Graded</span>
                          <span className="font-medium text-gray-900">
                            {new Date(assignment.graded_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {assignment.feedback && (
                        <div className="bg-gray-50 rounded p-2 mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Feedback</p>
                          <p className="text-xs text-gray-600">{assignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Enrollment Statistics</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Average Score</p>
                  <p className="text-4xl font-bold text-blue-600">{enrollment.statistics.average_score.toFixed(1)}</p>
                  <p className="text-xs text-gray-600 mt-2">Out of 100</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Completion Rate</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-green-600">{enrollment.statistics.completion_rate_percentage.toFixed(1)}</p>
                    <p className="text-gray-600 mb-1">%</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Of course completion</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Total Time Spent</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {(enrollment.statistics.total_time_spent_minutes / 60).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Hours</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Assignment Completion</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-orange-600">
                      {enrollment.statistics.assignment_completion_rate.toFixed(1)}
                    </p>
                    <p className="text-gray-600 mb-1">%</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Of assignments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
