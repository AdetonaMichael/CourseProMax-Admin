'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lesson } from '@/types'
import { courseService, CourseFullProfile } from '@/services/course.service'
import { LessonList } from '@/components/instructor/course-editor/LessonList'
import { InlineLessonEditor } from '@/components/instructor/course-editor/InlineLessonEditor'
import { LessonEditor } from '@/components/instructor/course-editor/LessonEditor'
import { VideoManager } from '@/components/instructor/course-editor/VideoManager'
import { QuizBuilder } from '@/components/instructor/course-editor/QuizBuilder'
import { InstructorLayout } from '@/components/instructor/InstructorLayout'
import { Button } from '@/components/shared/Button'
import { ArrowLeft, Edit2, Book, Users, Star, MessageSquare, BarChart3 } from 'lucide-react'

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params?.id as string) || 0

  const [course, setCourse] = useState<any>(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'students' | 'reviews' | 'analytics'>('overview')

  const [showAddLesson, setShowAddLesson] = useState(false)
  const [editorModalOpen, setEditorModalOpen] = useState(false)
  const [videoManagerOpen, setVideoManagerOpen] = useState(false)
  const [quizBuilderOpen, setQuizBuilderOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (courseId > 0) {
      fetchCourseDetails()
    }
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setCourseLoading(true)
      setCourseError(null)

      // Get course with all related data
      const data = await courseService.getCourseFullProfile(courseId, [
        'lessons',
        'students',
        'reviews',
        'analytics',
      ])
      setCourse(data)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load course'
      setCourseError(errorMsg)
    } finally {
      setCourseLoading(false)
    }
  }

  const handleAddLesson = () => {
    setSelectedLesson(undefined)
    setShowAddLesson(false)
    setEditorModalOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setEditorModalOpen(true)
  }

  const handleSaveLesson = (lesson: Lesson) => {
    setRefreshTrigger(prev => prev + 1)
    setEditorModalOpen(false)
  }

  const handleDeleteLesson = (lessonId: number) => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleManageVideos = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setVideoManagerOpen(true)
  }

  const handleManageQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setQuizBuilderOpen(true)
  }

  if (courseLoading) {
    return (
      <InstructorLayout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>Loading course details...</p>
        </div>
      </InstructorLayout>
    )
  }

  if (courseError || !course) {
    return (
      <InstructorLayout>
        <div style={{ padding: '40px 20px' }}>
          <Link href="/instructor/courses" className="link-back">
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
            <p style={{ color: '#991b1b' }}>⚠ {courseError || 'Course not found'}</p>
          </div>
        </div>
      </InstructorLayout>
    )
  }

  return (
    <InstructorLayout>
      <div className="bg-white min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-7 shadow-sm">
            <div className="flex-1 min-w-0">
              <Link href="/instructor/courses" className="inline-flex items-center gap-2 text-gray-700 text-sm font-medium hover:text-black transition mb-4">
                <ArrowLeft size={16} />
                Back to Courses
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 break-words">{course.title}</h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-normal">
                {course.level} • {course.total_lessons} lessons
              </p>
            </div>
            <Link href={`/instructor/courses/${courseId}/edit`} className="self-start">
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
                {course.is_free ? 'Free' : (course.price_display || `₦${Number(course.price || 0).toLocaleString()}`)}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Rating</span>
              <span className="text-2xl font-bold text-black">{(Number(course.rating) || 0).toFixed(1)} <span className="text-amber-400">★</span></span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Students</span>
              <span className="text-2xl font-bold text-black">{Number(course.students_count || 0).toLocaleString()}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3">Status</span>
              <div className="flex flex-col gap-2">
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold w-fit ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {course.is_active ? '✓ Published' : '◯ Draft'}
                </span>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold w-fit ${!course.is_free ? 'bg-blue-100 text-blue-800' : 'bg-gray-300 text-gray-900'}`}>
                  {!course.is_free ? '💰 Paid' : '🎁 Free'}
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
                <Book size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Lessons</span> ({course.total_lessons})
              </button>
              <button
                className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${activeTab === 'students' ? 'text-black border-black bg-white' : 'text-gray-600 border-transparent hover:text-black'}`}
                onClick={() => setActiveTab('students')}
              >
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Students</span> ({course.total_students || course.students_count || 0})
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
                          ['Category', course.category_name || course.category?.name || 'N/A'],
                          ['Level', course.level],
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex-shrink-0 sm:w-1/3">{label}</span>
                            <span className="text-sm text-black font-medium sm:text-right sm:flex-1">{String(value).substring(0, 100)}</span>
                          </div>
                        ))}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex-shrink-0 sm:w-1/3">Students Enrolled</span>
                          <span className="text-sm text-black font-medium sm:text-right sm:flex-1">{Number(course.students_count || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Properties */}
                    <div>
                      <h3 className="text-lg font-bold text-black mb-6 pb-3 border-b-2 border-gray-200 uppercase tracking-wide">Pricing & Properties</h3>
                      <div className="space-y-4">
                        {[
                          ['Price', course.is_free ? 'Free' : (course.price_display || `₦${Number(course.price || 0).toLocaleString()}`)],
                          ['Duration', course.duration || 'N/A'],
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
                </div>
              )}

              {/* Lessons Tab */}
              {activeTab === 'lessons' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Lessons</h2>
                    <button
                      onClick={() => setShowAddLesson(!showAddLesson)}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                      {showAddLesson ? 'Cancel' : 'Add Lesson'}
                    </button>
                  </div>

                  {showAddLesson && (
                    <div className="mb-6">
                      <InlineLessonEditor
                        courseId={courseId}
                        onClose={() => setShowAddLesson(false)}
                        onSave={() => {
                          setRefreshTrigger(prev => prev + 1)
                        }}
                      />
                    </div>
                  )}

                  <LessonList
                    courseId={courseId}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onAddLesson={handleAddLesson}
                    onManageVideos={handleManageVideos}
                    onManageQuiz={handleManageQuiz}
                    refreshTrigger={refreshTrigger}
                    hideAddButton={true}
                  />
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
                        {course.students.data.map((student: any) => (
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
                          <span className="text-3xl font-bold text-black">{((Number(course.reviews.average_rating) || 0).toFixed(1))} ★</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Total Reviews</span>
                          <span className="text-3xl font-bold text-black">{course.reviews.total}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {course.reviews.data?.map((review: any) => (
                          <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-black">{review.student_name}</h4>
                                <p className="text-xs text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                              <span className="text-sm font-bold text-amber-500">{review.rating} ★</span>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Total Views</span>
                          <span className="text-3xl font-bold text-blue-900">{course.analytics.total_views || 0}</span>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                          <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-2">Avg. Completion</span>
                          <span className="text-3xl font-bold text-green-900">{course.analytics.avg_completion || 0}%</span>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">Revenue</span>
                          <span className="text-3xl font-bold text-purple-900">₦{Number(course.analytics.total_revenue || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Detailed Metrics */}
                      <div>
                        <h3 className="text-lg font-bold text-black mb-4">Detailed Metrics</h3>
                        <div className="space-y-3">
                          {[
                            ['Enrollments', course.analytics.total_enrollments || 0],
                            ['Lessons Watched', course.analytics.lessons_watched || 0],
                            ['Certificates Issued', course.analytics.certificates_issued || 0],
                            ['Student Feedback Score', course.analytics.feedback_score || 'N/A'],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm font-semibold text-gray-700">{label}</span>
                              <span className="text-sm font-bold text-black">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-600">No analytics data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editorModalOpen && (
        <LessonEditor
          courseId={courseId}
          lesson={selectedLesson}
          isOpen={editorModalOpen}
          onClose={() => setEditorModalOpen(false)}
          onSave={handleSaveLesson}
        />
      )}

      {videoManagerOpen && selectedLesson && (
        <VideoManager
          courseId={courseId}
          lesson={selectedLesson}
          isOpen={videoManagerOpen}
          onClose={() => setVideoManagerOpen(false)}
          onSave={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}

      {quizBuilderOpen && selectedLesson && (
        <QuizBuilder
          lesson={selectedLesson}
          isOpen={quizBuilderOpen}
          onClose={() => setQuizBuilderOpen(false)}
          onSave={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </InstructorLayout>
  )
}
