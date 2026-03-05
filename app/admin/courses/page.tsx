'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'
import CourseFiltersBar from '@/components/admin/course-management/CourseFiltersBar'
import CourseTable from '@/components/admin/course-management/CourseTable'
import { courseService, CoursesListResponse, CourseListItem } from '@/services/course.service'

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    loadCourses()
  }, [page, search, level, category])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Debug: Check if token exists before API call
      const tokenDebug = localStorage.getItem('auth_token')
      console.log('[Courses Page] 🔍 Token state before API call:', {
        hasToken: !!tokenDebug,
        tokenLength: tokenDebug?.length || 0,
        tokenPreview: tokenDebug ? tokenDebug.substring(0, 30) + '...' : 'NO TOKEN'
      })
      
      console.log('[Courses Page] Loading courses with params:', {
        page,
        search,
        level,
        category,
      })
      
      const response = await courseService.getCourses(page, {
        per_page: 20,
        search: search || undefined,
        level: level || undefined,
        category_id: category ? parseInt(category) : undefined,
      })

      setCourses(response.courses)
      setPagination(response.pagination)
      console.log('[Courses Page] Courses loaded successfully:', response.courses.length)
    } catch (err: any) {
      console.error('[Courses Page] Error details:', err)
      const errorMsg = err?.message || err?.response?.data?.message || 'Failed to load courses'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleReset = () => {
    setSearch('')
    setLevel('')
    setCategory('')
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && courses.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600 mt-2">Manage all courses on your platform</p>
            </div>
            <Link href="/admin/courses/new">
              <Button variant="primary">
                <Plus size={18} />
                Create Course
              </Button>
            </Link>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#6b7280', margin: 0 }}>Loading courses...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">Manage all courses ({pagination.total} total)</p>
          </div>
          <Link href="/admin/courses/new">
            <Button variant="primary">
              <Plus size={18} />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '16px' }}>
            <p style={{ color: '#991b1b', fontSize: '14px', margin: '0 0 12px 0' }}>⚠ {error}</p>
            <Button variant="secondary" size="sm" onClick={loadCourses}>
              Try Again
            </Button>
          </div>
        )}

        {/* Filters */}
        <CourseFiltersBar
          search={search}
          onSearchChange={setSearch}
          level={level}
          onLevelChange={setLevel}
          category={category}
          onCategoryChange={setCategory}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* Courses Table or Empty State */}
        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
              {search || level || category ? 'No courses match your filters' : 'No courses yet'}
            </p>
          </div>
        ) : (
          <CourseTable
            courses={courses}
            pagination={pagination}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </AdminLayout>
  )
}
