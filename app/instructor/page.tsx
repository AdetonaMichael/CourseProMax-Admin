'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { StatCard, DataTable, Card, LoadingSkeleton, EmptyState } from '@/components/dashboard/DashboardComponents';
import {
  fetchInstructorStats,
  fetchInstructorCourses,
  fetchInstructorEnrollments,
  handleInstructorAPIError,
  InstructorStats,
  InstructorCourse,
  InstructorEnrollment,
} from '@/services/instructor.service';

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [enrollments, setEnrollments] = useState<InstructorEnrollment[]>([]);
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

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Instructor Dashboard] Loading data...');
        const [statsData, coursesData, enrollmentsData] = await Promise.all([
          fetchInstructorStats().catch((err) => {
            console.error('[Instructor Dashboard] Stats error:', err);
            return null;
          }),
          fetchInstructorCourses(1),
          fetchInstructorEnrollments(1),
        ]);

        console.log('[Instructor Dashboard] Data loaded:', {
          stats: statsData,
          coursesCount: coursesData?.courses?.length,
          enrollmentsCount: enrollmentsData?.enrollments?.length,
        });

        setStats(statsData);
        setCourses(coursesData?.courses || []);
        setEnrollments(enrollmentsData?.enrollments || []);
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
        <LoadingSkeleton count={4} />
      </InstructorLayout>
    );
  }

  if (error) {
    return (
      <InstructorLayout>
        <EmptyState
          icon="⚠️"
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

  const statCards = [
    {
      title: 'My Courses',
      value: stats?.total_courses || 0,
      icon: '📚',
      description: 'Total courses created',
    },
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: '👥',
      description: 'Unique students',
    },
    {
      title: 'Total Enrollments',
      value: stats?.total_enrollments || 0,
      icon: '✅',
      description: 'Course enrollments',
    },
    {
      title: 'Avg. Rating',
      value: stats?.average_rating?.toFixed(1) || '0.0',
      icon: '⭐',
      description: 'Student ratings',
    },
  ];

  return (
    <InstructorLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>

      {/* Course Performance Overview */}
      {stats && (
        <Card title="Teaching Overview" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Active Courses</span>
                <span className="text-2xl font-bold text-gray-900">{stats.active_courses}</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: stats.total_courses > 0 
                        ? `${(stats.active_courses / stats.total_courses) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.total_courses} total courses
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Student Engagement</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats.total_students > 0 
                    ? Math.round((stats.total_enrollments / stats.total_students) * 100)
                    : 0}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {stats.total_students} students • {stats.total_enrollments} enrollments
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Course Rating</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats.average_rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={i <= Math.round(stats.average_rating) ? '⭐' : '☆'}
                  >
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Average rating</p>
            </div>
          </div>
        </Card>
      )}

      {/* Your Courses */}
      <Card title="Your Courses" className="mb-8">
        {courses.length > 0 ? (
          <DataTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'category_name', label: 'Category' },
              {
                key: 'level',
                label: 'Level',
                render: (level) => (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {level}
                  </span>
                ),
              },
              {
                key: 'total_students',
                label: 'Students',
              },
              {
                key: 'total_lessons',
                label: 'Lessons',
              },
              {
                key: 'rating',
                label: 'Rating',
                render: (rating) => `⭐ ${rating.toFixed(1)}`,
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (is_active) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {is_active ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
            ]}
            data={courses}
            actions={[
              {
                label: 'Edit',
                onClick: (row) => router.push(`/instructor/courses/${row.id}`),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon="📚"
            title="No Courses Yet"
            description="Create your first course to start teaching"
            action={{
              label: 'Create Course',
              onClick: () => router.push('/instructor/courses/new'),
            }}
          />
        )}
      </Card>

      {/* Recent Enrollments */}
      <Card title="Recent Enrollments">
        {enrollments.length > 0 ? (
          <DataTable
            columns={[
              { key: 'user_name', label: 'Student' },
              { key: 'user_email', label: 'Email' },
              { key: 'course_title', label: 'Course' },
              {
                key: 'progress',
                label: 'Progress',
                render: (progress) => (
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (status) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                ),
              },
            ]}
            data={enrollments}
          />
        ) : (
          <EmptyState
            icon="👥"
            title="No Enrollments Yet"
            description="Enrollments will appear here as students join your courses"
          />
        )}
      </Card>
    </InstructorLayout>
  );
}
