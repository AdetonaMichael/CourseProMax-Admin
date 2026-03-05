'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Edit2, DollarSign, Trash2, BookOpen, Users, MessageSquare, BarChart3, Lock 
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'
import { courseService, CourseFullProfile } from '@/services/course.service'
import {
  UpdatePriceModal,
  MakeFreeModal,
  DeleteCourseModal,
} from '@/components/admin/course-management/PricingModals'

interface CourseDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const courseId = parseInt(id)
  const [course, setCourse] = useState<CourseFullProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'students' | 'reviews' | 'analytics'>('overview')
  
  // Modal states
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showFreeModal, setShowFreeModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await courseService.getCourseFullProfile(courseId, [
        'lessons',
        'students',
        'reviews',
        'analytics',
      ])
      setCourse(data)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load course'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceSuccess = (newPrice: number) => {
    if (course) {
      setCourse({ ...course, price: newPrice })
    }
    setShowPriceModal(false)
  }

  const handleFreeSuccess = () => {
    if (course) {
      setCourse({ ...course, price: 0 })
    }
    setShowFreeModal(false)
  }

  const handleDeleteSuccess = () => {
    router.push('/admin/courses')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>Loading course details...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !course) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px 20px' }}>
          <Link href="/admin/courses" className="link-back">
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#fee', 
            borderRadius: '8px', 
            border: '1px solid #fcc' 
          }}>
            <p style={{ color: '#991b1b' }}>⚠ {error || 'Course not found'}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="details-header">
          <Link href="/admin/courses" className="link-back">
            <ArrowLeft size={18} />
          </Link>
          <div className="header-title">
            <h1>{course.title}</h1>
            <p className="header-meta">
              {course.instructor_name} • {course.level} • {course.total_lessons} lessons
            </p>
          </div>
          <div className="header-actions">
            <Link href={`/admin/courses/${courseId}/edit`}>
              <Button variant="secondary">
                <Edit2 size={16} />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <span className="card-label">Price</span>
            <span className="card-value">
              {Number(course.price) > 0 ? `₦${Number(course.price).toLocaleString()}` : 'Free'}
            </span>
          </div>
          <div className="info-card">
            <span className="card-label">Rating</span>
            <span className="card-value">{(Number(course.rating) || 0).toFixed(1)} ★</span>
          </div>
          <div className="info-card">
            <span className="card-label">Students</span>
            <span className="card-value">{Number(course.total_students || 0).toLocaleString()}</span>
          </div>
          <div className="info-card">
            <span className="card-label">Status</span>
            <span className={`badge ${course.is_active ? 'badge-active' : 'badge-inactive'}`}>
              {course.is_active ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              <BookOpen size={16} />
              Lessons ({course.total_lessons})
            </button>
            <button
              className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={16} />
              Students ({course.total_students})
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={16} />
              Reviews
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="overview-grid">
                <div className="overview-section">
                  <h3>Course Information</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Title</span>
                      <span className="value">{course.title}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Description</span>
                      <span className="value">{course.description}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Category</span>
                      <span className="value">{course.category_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Instructor</span>
                      <span className="value">{course.instructor_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Level</span>
                      <span className="value">{course.level}</span>
                    </div>
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Pricing & Properties</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Price</span>
                      <span className="value">
                        {course.price > 0 ? `₦${course.price.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Duration</span>
                      <span className="value">{course.duration}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">AI Score</span>
                      <span className="value">{course.ai_score || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Certificate</span>
                      <span className="value">
                        {course.certificate_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Status</span>
                      <span className={`badge ${course.is_active ? 'badge-active' : 'badge-inactive'}`}>
                        {course.is_active ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-actions">
                <h3>Course Actions</h3>
                <div className="action-buttons">
                  <Link href={`/admin/courses/${courseId}/edit`}>
                    <Button variant="secondary">
                      <Edit2 size={16} />
                      Edit Course
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPriceModal(true)}
                  >
                    <DollarSign size={16} />
                    Update Price
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowFreeModal(true)}
                    disabled={course.price === 0}
                  >
                    <Lock size={16} />
                    Make Free
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    Delete Course
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="tab-content">
              {course.lessons && course.lessons.length > 0 ? (
                <div className="lessons-list">
                  {course.lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-card">
                      <div className="lesson-number">{lesson.order}</div>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <p className="lesson-description">{lesson.description}</p>
                        <div className="lesson-meta">
                          <span className="meta-tag">{lesson.estimated_duration_minutes}m</span>
                          <span className={`meta-tag level-${lesson.difficulty.toLowerCase()}`}>
                            {lesson.difficulty}
                          </span>
                          <span className={`meta-tag ${lesson.is_active ? 'active' : 'inactive'}`}>
                            {lesson.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {lesson.is_preview && <span className="meta-tag preview">Preview</span>}
                        </div>
                      </div>
                      <div className="lesson-actions">
                        <Button variant="ghost" size="sm" disabled>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" disabled>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No lessons added yet</p>
                  <Button variant="primary" disabled style={{ marginTop: '16px' }}>
                    Add Lesson
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="tab-content">
              {course.students && course.students.data.length > 0 ? (
                <div className="students-list">
                  {course.students.data.map((student) => (
                    <div key={student.id} className="student-card">
                      <div className="student-info">
                        <h4>{student.user.first_name} {student.user.last_name}</h4>
                        <p className="student-email">{student.user.email}</p>
                        {student.user.phone && <p className="student-phone">{student.user.phone}</p>}
                      </div>
                      <div className="student-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${student.progress_percentage}%` }} />
                        </div>
                        <p className="progress-text">{student.progress_percentage}% Complete</p>
                        <p className="lessons-text">
                          {student.lessons_completed} of {student.total_lessons} lessons
                        </p>
                      </div>
                      <span className={`badge status-${student.status}`}>{student.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No students enrolled yet</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-content">
              {course.reviews && course.reviews.total > 0 ? (
                <>
                  <div className="reviews-stats">
                    <div className="stat-card">
                      <span className="stat-label">Average Rating</span>
                      <span className="stat-value">{course.reviews.average_rating.toFixed(1)} ★</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Total Reviews</span>
                      <span className="stat-value">{course.reviews.total}</span>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {course.reviews.data.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <h4>{review.user.first_name} {review.user.last_name}</h4>
                          <span className="rating">{'★'.repeat(review.rating)}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="tab-content">
              {course.analytics ? (
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <span className="card-label">Total Enrollments</span>
                    <span className="card-value">{course.analytics.total_enrollments.toLocaleString()}</span>
                  </div>
                  <div className="analytics-card">
                    <span className="card-label">Active Students</span>
                    <span className="card-value">{course.analytics.active_students.toLocaleString()}</span>
                  </div>
                  <div className="analytics-card">
                    <span className="card-label">Completed</span>
                    <span className="card-value">{course.analytics.completed_students.toLocaleString()}</span>
                  </div>
                  <div className="analytics-card">
                    <span className="card-label">Paused</span>
                    <span className="card-value">{course.analytics.paused_students.toLocaleString()}</span>
                  </div>
                  <div className="analytics-card">
                    <span className="card-label">Avg Completion</span>
                    <span className="card-value">{course.analytics.average_completion_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="analytics-card">
                    <span className="card-label">Total Revenue</span>
                    <span className="card-value">₦{course.analytics.total_revenue.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>Analytics data not available</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Modals */}
      {showPriceModal && (
        <UpdatePriceModal
          courseId={courseId.toString()}
          currentPrice={course?.price || 0}
          onClose={() => setShowPriceModal(false)}
          onSuccess={handlePriceSuccess}
        />
      )}

      {showFreeModal && (
        <MakeFreeModal
          courseId={courseId.toString()}
          onClose={() => setShowFreeModal(false)}
          onSuccess={handleFreeSuccess}
        />
      )}

      {showDeleteModal && course && (
        <DeleteCourseModal
          courseId={courseId.toString()}
          courseTitle={course.title}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </AdminLayout>
  )
}
