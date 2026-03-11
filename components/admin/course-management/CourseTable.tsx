'use client'

import React from 'react'
import Link from 'next/link'
import { Eye, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import './CourseTable.css'

interface Course {
  id: number
  title: string
  instructor_name: string
  category_name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  total_lessons: number
  total_students?: number
  students_count?: number
  price: number
  rating: number
  is_active: boolean
  thumbnail?: string
  created_at: string
}

interface Pagination {
  current_page: number
  total: number
  per_page: number
  last_page: number
}

interface CourseTableProps {
  courses: Course[]
  pagination: Pagination
  loading: boolean
  onPageChange: (newPage: number) => void
}

const getLevelDisplay = (level: string) => {
  const levels: Record<string, { label: string; abbr: string }> = {
    Beginner: { label: 'Beginner', abbr: 'BEG' },
    Intermediate: { label: 'Intermediate', abbr: 'INT' },
    Advanced: { label: 'Advanced', abbr: 'ADV' },
  }
  return levels[level] || { label: level, abbr: level.substring(0, 3).toUpperCase() }
}

const getStatusDisplay = (isActive: boolean) => {
  return isActive ? 'Published' : 'Draft'
}

export default function CourseTable({
  courses,
  pagination,
  loading,
  onPageChange,
}: CourseTableProps) {
  const startItem = (pagination.current_page - 1) * pagination.per_page + 1
  const endItem = Math.min(pagination.current_page * pagination.per_page, pagination.total)

  return (
    <>
      <div className="courses-table-container">
        <div className="courses-table-wrapper">
          <table className="courses-table">
            <thead>
              <tr className="table-header">
                <th className="col-title">Course Title</th>
                <th className="col-instructor">Instructor</th>
                <th className="col-category">Category</th>
                <th className="col-level">Level</th>
                <th className="col-metrics">Lessons</th>
                <th className="col-metrics">Students</th>
                <th className="col-rating">Rating</th>
                <th className="col-price">Price</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id} className={`table-body-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <td className="col-title">
                    <div className="course-info">
                      {course.thumbnail && (
                        <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                      )}
                      <div className="course-details">
                        <p className="course-title">{course.title}</p>
                        <p className="course-id">ID: {course.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="col-instructor">
                    <span className="cell-text">{course.instructor_name}</span>
                  </td>
                  <td className="col-category">
                    <span className="badge-category">{course.category_name}</span>
                  </td>
                  <td className="col-level">
                    <span className={`badge-level level-${course.level.toLowerCase()}`}>
                      {getLevelDisplay(course.level).abbr}
                    </span>
                  </td>
                  <td className="col-metrics">
                    <span className="cell-text">{course.total_lessons}</span>
                  </td>
                  <td className="col-metrics">
                    <span className="cell-text">{course.students_count || course.total_students || 0}</span>
                  </td>
                  <td className="col-rating">
                    <div className="rating-display">
                      <span className="rating-value">{(Number(course.rating) || 0).toFixed(1)}</span>
                      <span className="rating-star">★</span>
                    </div>
                  </td>
                  <td className="col-price">
                    <span className="cell-text">
                      {course.price > 0 ? `₦${course.price.toLocaleString()}` : 'Free'}
                    </span>
                  </td>
                  <td className="col-status">
                    <span className={`badge-status status-${course.is_active ? 'active' : 'inactive'}`}>
                      {getStatusDisplay(course.is_active)}
                    </span>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <Link href={`/admin/courses/${course.id}`} title="View course">
                        <button className="btn-action btn-view">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link href={`/admin/courses/${course.id}/edit`} title="Edit course">
                        <button className="btn-action btn-edit">
                          <Edit2 size={16} />
                        </button>
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
      <div className="pagination-container">
        <div className="pagination-info">
          <p className="pagination-text">
            Showing <span className="text-emphasis">{startItem}</span> to{' '}
            <span className="text-emphasis">{endItem}</span> of{' '}
            <span className="text-emphasis">{pagination.total}</span> courses
          </p>
        </div>

        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(Math.max(pagination.current_page - 1, 1))}
            disabled={pagination.current_page === 1 || loading}
            className="btn-pagination"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="page-info">
            <span className="page-number">
              Page <span className="page-emphasis">{pagination.current_page}</span> of{' '}
              <span className="page-emphasis">{pagination.last_page}</span>
            </span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(pagination.current_page + 1, pagination.last_page))}
            disabled={pagination.current_page === pagination.last_page || loading}
            className="btn-pagination"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
