'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, CheckCircle, Star, AlertTriangle, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { StatCard, DataTable, Card, LoadingSkeleton, EmptyState } from '@/components/dashboard/DashboardComponents';
import {
  fetchDashboardOverview,
  fetchInstructorCourses,
  fetchCourseStudents,
  fetchRevenueAnalytics,
  handleInstructorAPIError,
  DashboardOverview,
  InstructorCourse,
  RevenueAnalytics,
  CourseStudent,
} from '@/services/instructor.service';

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [courseStudents, setCourseStudents] = useState<CourseStudent[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Check authorization
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !session?.user?.roles?.includes('instructor')) {
      router.push('/admin');
    }
  }, [status, session, router]);

  // Fetch comprehensive dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Instructor Dashboard] Loading comprehensive data...');
        const [overview, coursesData, revenueAnalytics] = await Promise.all([
          fetchDashboardOverview().catch((err) => {
            console.warn('[Dashboard] Overview fetch failed, continuing:', err);
            return null;
          }),
          fetchInstructorCourses(1).catch((err) => {
            console.warn('[Dashboard] Courses fetch failed, continuing:', err);
            return null;
          }),
          fetchRevenueAnalytics().catch((err) => {
            console.warn('[Dashboard] Revenue fetch failed, continuing:', err);
            return null;
          }),
        ]);

        console.log('[Instructor Dashboard] Data loaded:', {
          hasOverview: !!overview,
          coursesCount: coursesData?.courses?.length || 0,
          hasRevenue: !!revenueAnalytics,
        });

        setDashboardData(overview);
        setCourses(coursesData?.courses || []);
        setRevenueData(revenueAnalytics);

        // Fetch students from first course if available
        if (coursesData?.courses?.[0]) {
          const studentsData = await fetchCourseStudents(coursesData.courses[0].id).catch(() => null);
          if (studentsData) {
            setCourseStudents(studentsData.students || []);
          }
        }
      } catch (err) {
        console.error('[Instructor Dashboard] Error:', err);
        setError(handleInstructorAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <InstructorLayout>
        <LoadingSkeleton count={6} />
      </InstructorLayout>
    );
  }

  if (error && !dashboardData && !revenueData) {
    return (
      <InstructorLayout>
        <EmptyState
          icon={<AlertTriangle className="w-12 h-12 text-red-400" />}
          title="Error Loading Dashboard"
          description={error.message}
          action={{
            label: 'Retry',
            onClick: () => window.location.reload(),
          }}
        />
      </InstructorLayout>
    );
  }

  const stats = dashboardData?.statistics;
  
  const keyMetrics = [
    {
      title: 'Total Courses',
      value: stats?.total_courses || 0,
      icon: <BookOpen size={28} className="text-gray-600" />,
      description: `${stats?.published_courses || 0} published`,
      trend: undefined,
    },
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: <Users size={28} className="text-gray-600" />,
      description: `${stats?.active_students || 0} active`,
      trend: undefined,
    },
    {
      title: 'Total Revenue',
      value: `₦${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: <DollarSign size={28} className="text-gray-600" />,
      description: `₦${(stats?.this_month_revenue || 0).toLocaleString()} this month`,
      trend: undefined,
    },
    {
      title: 'Avg. Rating',
      value: stats?.average_course_rating?.toFixed(1) || '0.0',
      icon: <Star size={28} className="text-gray-600" />,
      description: 'Course ratings',
      trend: undefined,
    },
  ];

  return (
    <InstructorLayout>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {keyMetrics.map((metric, idx) => (
          <StatCard
            key={idx}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            description={metric.description}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Overview Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Teaching Metrics */}
          <Card title="Teaching Overview">
            <div className="space-y-4">
              {/* Completion Rate */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Course Completion Rate</span>
                  <span className="text-lg font-bold text-gray-900">{stats.course_completion_rate?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(stats.course_completion_rate || 0, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.completed_students || 0} of {stats.total_students || 0} students completed
                </p>
              </div>

              {/* Active vs Total */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Active Students</span>
                  <span className="text-lg font-bold text-gray-900">{stats.active_students || 0}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {((stats.active_students || 0) / (stats.total_students || 1) * 100).toFixed(1)}% engagement rate
                </p>
              </div>

              {/* Enrollments */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Enrollments</span>
                  <span className="text-lg font-bold text-gray-900">{stats.total_enrollments || 0}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Avg. {((stats.total_enrollments || 0) / (stats.total_courses || 1)).toFixed(1)} per course
                </p>
              </div>
            </div>
          </Card>

          {/* Revenue Overview */}
          {revenueData && (
            <Card title="Revenue Summary">
              <div className="space-y-4">
                {/* This Month */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">₦{(revenueData.this_month_revenue || 0).toLocaleString()}</p>
                    </div>
                    <TrendingUp className="text-green-600" size={32} />
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Revenue</span>
                    <span className="text-lg font-bold text-gray-900">₦{(revenueData.total_revenue || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Trend: {revenueData.revenue_trend || 'N/A'}
                  </p>
                </div>

                {/* Last Month */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Last Month</span>
                    <span className="text-lg font-bold text-gray-900">₦{(revenueData.last_month_revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Recent Activities and Top Courses */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activities */}
          {dashboardData.recent_activities && dashboardData.recent_activities.length > 0 && (
            <Card title="Recent Activities" className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {dashboardData.recent_activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <Activity size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 break-words">{activity.message}</p>
                      {activity.course_title && (
                        <p className="text-xs text-gray-500 mt-1">{activity.course_title}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top Performing Courses */}
          {dashboardData.top_performing_courses && dashboardData.top_performing_courses.length > 0 && (
            <Card title="Top Performing Courses">
              <div className="space-y-4">
                {dashboardData.top_performing_courses.map((course) => (
                  <div key={course.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm break-words flex-1">{course.title}</h4>
                      <span className="ml-2 text-xs font-semibold text-green-600">{course.enrollment_trend}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>👥 {course.student_count} students</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span>{(Number(course.average_rating) || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Upcoming Deadlines */}
      {dashboardData?.upcoming_deadlines && dashboardData.upcoming_deadlines.length > 0 && (
        <Card title="Upcoming Assignment Deadlines" className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Assignment</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Course</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Due Date</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Pending</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.upcoming_deadlines.slice(0, 5).map((deadline) => (
                  <tr key={deadline.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{deadline.assignment_title}</td>
                    <td className="py-3 px-4 text-gray-600">{deadline.course_title}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(deadline.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        {deadline.pending_submissions}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Your Courses */}
      <Card title="Your Courses" className="mb-8">
        {courses.length > 0 ? (
          <DataTable
            columns={[
              { key: 'title', label: 'Course Title' },
              { key: 'level', label: 'Level', render: (level) => (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {level}
                </span>
              )},
              { key: 'total_students', label: 'Students' },
              { key: 'total_lessons', label: 'Lessons' },
              { 
                key: 'rating',
                label: 'Rating',
                render: (rating) => (
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{(Number(rating) || 0).toFixed(1)}</span>
                  </div>
                ),
              },
              { 
                key: 'is_active',
                label: 'Status',
                render: (is_active) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {is_active ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
            ]}
            data={courses}
            actions={[
              {
                label: 'Manage',
                onClick: (row) => router.push(`/instructor/courses/${row.id}`),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-gray-400" />}
            title="No Courses Yet"
            description="Create your first course to start teaching and earning"
            action={{
              label: 'Create Course',
              onClick: () => router.push('/instructor/courses/new'),
            }}
          />
        )}
      </Card>

      {/* Student Management */}
      {courseStudents.length > 0 && (
        <Card title="Recent Student Enrollments" className="mb-8">
          <DataTable
            columns={[
              { key: 'user_name', label: 'Student Name' },
              { key: 'user_email', label: 'Email' },
              { 
                key: 'progress_percentage',
                label: 'Progress',
                render: (progress) => (
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{progress}%</span>
                  </div>
                ),
              },
              { 
                key: 'status',
                label: 'Status',
                render: (status) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                ),
              },
            ]}
            data={courseStudents.slice(0, 10)}
          />
        </Card>
      )}

      {/* Key Insights & Recommendations */}
      <Card title="Key Insights & Recommendations" className="mb-8">
        <div className="space-y-4">
          {/* Revenue Insight */}
          {revenueData && (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <TrendingUp className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm mb-1">Revenue Growth</h4>
                <p className="text-sm text-green-800">
                  {revenueData.this_month_revenue > (revenueData.last_month_revenue || 0)
                    ? `You've earned ₦${(revenueData.this_month_revenue - (revenueData.last_month_revenue || 0)).toLocaleString()} more this month compared to last month`
                    : `Revenue trending similar to last month. Focus on course promotions to drive enrollment`}
                </p>
              </div>
            </div>
          )}

          {/* Student Engagement Insight */}
          {stats && (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <Activity className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">Student Engagement</h4>
                <p className="text-sm text-blue-800">
                  {((stats.active_students || 0) / (stats.total_students || 1) * 100).toFixed(1)}% of your students are actively learning.
                  {((stats.active_students || 0) / (stats.total_students || 1)) < 0.5
                    ? ' Consider sending reminders or updating your course content.'
                    : ' Keep up the great engagement with your students!'}
                </p>
              </div>
            </div>
          )}

          {/* Course Performance Insight */}
          {dashboardData?.top_performing_courses && dashboardData.top_performing_courses.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <Star className="text-purple-600 flex-shrink-0 mt-0.5 fill-purple-600" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 text-sm mb-1">Top Performer</h4>
                <p className="text-sm text-purple-800">
                  <strong>{dashboardData.top_performing_courses[0].title}</strong> is your best course with {dashboardData.top_performing_courses[0].student_count} students and {(Number(dashboardData.top_performing_courses[0].average_rating) || 0).toFixed(1)}★ rating.
                  {dashboardData.top_performing_courses[0].enrollment_trend === 'trending_up'
                    ? ' Enrollment is increasing!'
                    : ' Consider what makes this course successful and apply similar strategies to others.'}
                </p>
              </div>
            </div>
          )}

          {/* Course Completion Insight */}
          {stats && (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <CheckCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 text-sm mb-1">Completion Rate</h4>
                <p className="text-sm text-amber-800">
                  {stats.course_completion_rate?.toFixed(1) || 0}% of your students are completing courses.
                  {(stats.course_completion_rate || 0) < 70
                    ? ' Focus on improving course structure and adding milestone celebrations to boost completion.'
                    : ' Excellent completion rate! Your courses are keeping students engaged.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </InstructorLayout>
  );
}
