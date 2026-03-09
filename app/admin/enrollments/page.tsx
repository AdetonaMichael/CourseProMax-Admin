'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'
import { fetchEnrollments, handleAPIError, type EnrollmentListItem, type EnrollmentsListResponse } from '@/services/admin.service'

interface Filters {
  search: string
  status: 'all' | 'active' | 'completed' | 'paused' | 'withdrawn'
  per_page: number
}

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

const levelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'intermediate':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'advanced':
      return 'bg-red-50 text-red-700 border border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200'
  }
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentListItem[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    per_page: 15,
  })

  useEffect(() => {
    console.log('[Enrollments Page] Component mounted, loading enrollments...')
    loadEnrollments()
  }, [page, filters])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = (await fetchEnrollments(page, {
        per_page: filters.per_page,
        status: filters.status === 'all' ? undefined : filters.status,
        search: filters.search || undefined,
      })) as unknown as EnrollmentsListResponse

      setEnrollments(response.enrollments)
      setPagination(response.pagination)
      console.log('[Enrollments Page] Enrollments loaded:', response.enrollments.length)
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
      console.error('[Enrollments Page] Error:', apiError)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (value: string, filterType: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }))
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[Enrollments Page] Search submitted with filters:', filters)
    setPage(1)
  }

  if (loading && enrollments.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollments Management</h1>
            <p className="text-gray-600 mt-2">View and manage all course enrollments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading enrollments...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollments Management</h1>
          <p className="text-gray-600 mt-2">View and manage all course enrollments ({pagination.total})</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
            <Button variant="secondary" size="sm" onClick={loadEnrollments} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by email, name, or course..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange(e.target.value, 'status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Enrollments Table */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No enrollments found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Progress</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Level</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Last Accessed</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Enrolled Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment, index) => (
                      <tr key={enrollment.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={enrollment.user.avatar || `https://ui-avatars.com/api/?name=${enrollment.user.full_name}`}
                              alt={enrollment.user.full_name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{enrollment.user.full_name}</p>
                              <p className="text-xs text-gray-600">{enrollment.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{enrollment.course.title}</p>
                            <p className="text-xs text-gray-600">By {enrollment.course.instructor}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(enrollment.progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {enrollment.completed_lessons}/{enrollment.total_lessons}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${levelColor(enrollment.course.level)}`}>
                            {enrollment.course.level}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(enrollment.status)}`}>
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">{enrollment.last_accessed}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">{new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/enrollments/${enrollment.id}`}>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} enrollments
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={pagination.current_page === 1 || loading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-sm text-gray-600">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(prev + 1, pagination.last_page))}
                  disabled={pagination.current_page === pagination.last_page || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
