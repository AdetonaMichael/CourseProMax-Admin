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
import { LessonEditor } from '@/components/admin/course-management/LessonEditor'
import { LessonList } from '@/components/admin/course-management/LessonList'

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
  const [showAddLesson, setShowAddLesson] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('[CourseDetailsPage] Loading fresh course data from backend...')
      const data = await courseService.getCourseFullProfile(courseId, [
        'lessons',
        'students',
        'reviews',
        'analytics',
      ])
      console.log('[CourseDetailsPage] Fresh data received from backend:', {
        id: data.id,
        title: data.title,
        price: data.price,
        is_free: data.is_free,
        is_paid: data.is_paid,
        price_naira: data.price_naira,
        price_display: data.price_display,
      })
      setCourse(data)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load course'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceSuccess = async (newPrice: number) => {
    console.log('[CourseDetailsPage] Price update success, reloading fresh course data from backend...')
    setShowPriceModal(false)
    // Reload full course data to verify the update actually persisted on backend
    await loadCourse()
    console.log('[CourseDetailsPage] Course data reloaded, database state is now displayed')
  }

  const handleFreeSuccess = async () => {
    console.log('[CourseDetailsPage] Make free success, reloading fresh course data from backend...')
    setShowFreeModal(false)
    // Reload full course data to verify the update actually persisted on backend
    await loadCourse()
    console.log('[CourseDetailsPage] Course data reloaded, database state is now displayed')
  }

  const handleDeleteSuccess = () => {
    router.push('/admin/courses')
  }

  const toggleAddLesson = () => {
    setShowAddLesson((prev) => !prev)
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
      <div className="bg-white min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-7 shadow-sm">
            <div className="flex-1 min-w-0">
              <Link href="/admin/courses" className="inline-flex items-center gap-2 text-gray-700 text-sm font-medium hover:text-black transition mb-4">
                <ArrowLeft size={16} />
                Back to Courses
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 break-words">{course.title}</h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-normal">
                {course.instructor_name} • {course.level} • {course.total_lessons} lessons
              </p>
            </div>
            <Link href={`/admin/courses/${courseId}/edit`} className="self-start">
              <Button variant="secondary" className="flex items-center gap-2 whitespace-nowrap">
                <Edit2 size={16} />
                Edit Course
              </Button>
            </Link>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Price</span>
              <span className="text-2xl font-bold text-black">
                {course.price_display || 'Free'}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Rating</span>
              <span className="text-2xl font-bold text-black">{(Number(course.rating) || 0).toFixed(1)} ★</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Students</span>
              <span className="text-2xl font-bold text-black">{Number(course.students_count || course.total_students || 0).toLocaleString()}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Status</span>
              <div className="flex flex-col gap-2">
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold w-fit ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {course.is_active ? '✓ Published' : '◯ Draft'}
                </span>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold w-fit ${course.is_paid ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {course.is_paid ? '💰 Paid' : '🎁 Free'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50 flex-wrap sm:flex-nowrap">
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm border-b-2 transition ${activeTab === 'overview' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${activeTab === 'lessons' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('lessons')}
              >
                <BookOpen size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Lessons</span> ({course.total_lessons})
              </button>
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${activeTab === 'students' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('students')}
              >
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Students</span> ({course.total_students})
              </button>
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${activeTab === 'reviews' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('reviews')}
              >
                <MessageSquare size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Reviews</span>
              </button>
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${activeTab === 'analytics' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Course Information */}
                    <div>
                      <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Course Information</h3>
                      <div className="space-y-4">
                        {[
                          ['Title', course.title],
                          ['Description', course.description],
                          ['Category', (course.category as any)?.name || course.category_name],
                          ['Instructor', course.instructor_name],
                          ['Level', course.level],
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex-shrink-0 sm:w-1/3">{label}</span>
                            <span className="text-sm text-black font-medium sm:text-right sm:flex-1">{String(value).substring(0, 100)}</span>
                          </div>
                        ))}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex-shrink-0 sm:w-1/3">Students Enrolled</span>
                          <span className="text-sm text-black font-medium sm:text-right sm:flex-1">{Number(course.students_count || course.total_students || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Properties */}
                    <div>
                      <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Pricing & Properties</h3>
                      <div className="space-y-4">
                        {[
                          ['Price', course.price_display || (course.is_paid ? `₦${Number(course.price_naira || 0).toLocaleString()}` : 'Free')],
                          ['Duration', course.duration],
                          ['AI Score', course.ai_score || 'N/A'],
                          ['Certificate', course.certificate_available ? 'Available' : 'Not Available'],
                          ['Status', course.is_active ? 'Published' : 'Draft'],
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex-shrink-0 sm:w-1/3">{label}</span>
                            <span className="text-sm text-black font-medium sm:text-right sm:flex-1">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Course Actions */}
                  <div className="pt-6 border-t-2 border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">Course Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/admin/courses/${courseId}/edit`}>
                        <Button variant="secondary" className="inline-flex items-center gap-2">
                          <Edit2 size={16} />
                          Edit Course
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        onClick={() => setShowPriceModal(true)}
                        className="inline-flex items-center gap-2"
                      >
                        <DollarSign size={16} />
                        Update Price
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setShowFreeModal(true)}
                        disabled={course.price === 0}
                        className="inline-flex items-center gap-2"
                      >
                        <Lock size={16} />
                        Make Free
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700"
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
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Lessons</h2>
                    <button
                      onClick={toggleAddLesson}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                      {showAddLesson ? 'Cancel' : 'Add Lesson'}
                    </button>
                  </div>

                  {showAddLesson && (
                    <div className="mb-4">
                      <LessonEditor courseId={courseId} onClose={toggleAddLesson} />
                    </div>
                  )}

                  <LessonList lessons={course.lessons || []} courseId={courseId} hideAddButton={true} />
                </div>
              )}

              {/* Students Tab */}
              {activeTab === 'students' && (
                <div>
                  {course.students && course.students.data && course.students.data.length > 0 ? (
                    <div>
                      {/* Student Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                        {[
                          ['Active', course.students.active],
                          ['Completed', course.students.completed],
                          ['Paused', course.students.paused],
                          ['Withdrawn', course.students.withdrawn],
                          ['Total', course.students.total],
                        ].map(([label, value]) => (
                          <div key={label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">{label}</span>
                            <span className="text-2xl font-bold text-black">{value}</span>
                          </div>
                        ))}
                      </div>
                      {/* Students List */}
                      <div className="space-y-3">
                        {course.students.data.map((student) => (
                          <div key={student?.enrollment_id || Math.random()} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition">
                            <div className="flex-1">
                              <h4 className="font-bold text-black text-sm">{student?.user_name || 'Unknown Student'}</h4>
                              <p className="text-xs text-gray-600">{student?.user_email || 'No email'}</p>
                              {student?.user_phone && <p className="text-xs text-gray-500">{student.user_phone}</p>}
                              <p className="text-xs text-gray-500 mt-1">
                                Enrolled: {student?.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${student?.progress || 0}%` }} />
                              </div>
                              <p className="text-xs font-semibold text-black">{student?.progress || 0}% Complete</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {student?.lessons_completed || 0} lessons completed
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${student?.status === 'active' ? 'bg-green-100 text-green-800' : student?.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : student?.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                              {student?.status || 'unknown'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-600">No students enrolled yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {course.reviews && course.reviews.total > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Average Rating</span>
                          <span className="text-3xl font-bold text-black">{course.reviews.average_rating.toFixed(1)} ★</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Total Reviews</span>
                          <span className="text-3xl font-bold text-black">{course.reviews.total}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {course.reviews.data.map((review) => (
                          <div key={review?.id || Math.random()} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-black text-sm">
                                  {review?.user_name || 'Anonymous Review'}
                                </h4>
                                <p className="text-xs text-gray-600">{review?.user_email || 'No email'}</p>
                              </div>
                              <span className="text-amber-400 text-sm font-bold ml-4 flex-shrink-0">{'★'.repeat(review?.rating || 0)}</span>
                            </div>
                            <p className="text-sm text-black mb-2 leading-relaxed">{review?.comment || 'No comment provided'}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">{review?.created_at ? new Date(review.created_at).toLocaleDateString() : 'Date unknown'}</p>
                              <span className={`text-xs px-2 py-1 rounded ${review?.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {review?.status || 'pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  {course.analytics ? (
                    <div className="space-y-8">
                      {/* Enrollment Metrics */}
                      <div>
                        <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Enrollment Metrics</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {[
                            ['Total Enrollments', course.analytics.total_enrollments.toLocaleString()],
                            ['Active', course.analytics.enrollments_by_status.active.toLocaleString()],
                            ['Completed', course.analytics.enrollments_by_status.completed.toLocaleString()],
                            ['Paused', course.analytics.enrollments_by_status.paused.toLocaleString()],
                            ['Withdrawn', course.analytics.enrollments_by_status.withdrawn.toLocaleString()],
                          ].map(([label, value]) => (
                            <div key={label} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">{label}</span>
                              <span className="text-2xl font-bold text-black">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div>
                        <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Performance Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            ['Avg Completion %', `${course.analytics.average_completion_percentage.toFixed(2)}%`],
                            ['Completion Rate', `${course.analytics.completion_rate.toFixed(2)}%`],
                            ['Revenue Per Student', `₦${course.analytics.revenue_per_student.toLocaleString()}`],
                          ].map(([label, value]) => (
                            <div key={label} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">{label}</span>
                              <span className="text-2xl font-bold text-black">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Revenue */}
                      <div>
                        <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Financial Summary</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Total Revenue</span>
                          <span className="text-4xl font-bold text-green-700">₦{course.analytics.total_revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-600">Analytics data not available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPriceModal && (
        <UpdatePriceModal
          courseId={courseId.toString()}
          currentPrice={Number(course?.price_naira || 0)}
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

      {showAddLesson && (
        <LessonEditor courseId={courseId} onClose={toggleAddLesson} />
      )}
    </AdminLayout>
  )
}
