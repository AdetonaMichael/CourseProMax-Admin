'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard, DataTable, Card, LoadingSkeleton, EmptyState } from '@/components/dashboard/DashboardComponents';
import {
  fetchUsers,
  fetchCourses,
  fetchEnrollments,
  fetchEnrollmentStats,
  handleAPIError,
  User,
  Course,
  Enrollment,
} from '@/services/admin.service';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Check authorization
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !session?.user?.roles?.includes('admin')) {
      router.push('/instructor');
    }
  }, [status, session, router]);

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Admin Dashboard] Loading data...');
        const [statsData, usersData, coursesData, enrollmentsData] = await Promise.all([
          fetchEnrollmentStats().catch((err) => {
            console.error('[Admin Dashboard] Stats error:', err);
            return null;
          }),
          fetchUsers(1, { per_page: 10 }),
          fetchCourses(1, { per_page: 10 }),
          fetchEnrollments(1, { per_page: 10 }),
        ]);

        console.log('[Admin Dashboard] Data loaded:', {
          stats: statsData,
          usersCount: usersData?.users?.length,
          coursesCount: coursesData?.courses?.length,
          enrollmentsCount: enrollmentsData?.enrollments?.length,
        });

        setStats(statsData);
        setUsers(usersData?.users || []);
        setCourses(coursesData?.courses || []);
        setEnrollments(enrollmentsData?.enrollments || []);
      } catch (err) {
        console.error('[Admin Dashboard] Error:', err);
        setError(handleAPIError(err));
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
      <AdminLayout>
        <LoadingSkeleton count={4} />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <EmptyState
          icon="⚠️"
          title="Error Loading Dashboard"
          description={error.message}
          action={{
            label: 'Retry',
            onClick: () => window.location.reload(),
          }}
        />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_enrollments || users.length,
      icon: '👥',
      description: 'Active users on platform',
    },
    {
      title: 'Active Courses',
      value: courses.length,
      icon: '📚',
      description: 'Published courses',
    },
    {
      title: 'Total Enrollments',
      value: stats?.total_enrollments || enrollments.length,
      icon: '✅',
      description: 'Course enrollments',
    },
    {
      title: 'Completion Rate',
      value: `${stats?.completion_rate || 0}%`,
      icon: '📈',
      description: 'Average completion',
    },
  ];

  return (
    <AdminLayout>
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

      {/* Enrollment Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Enrollment Status">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Active</span>
                  <span className="text-lg font-bold text-gray-900">{stats.active_enrollments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (stats.active_enrollments / stats.total_enrollments) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-gray-900">{stats.completed_enrollments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (stats.completed_enrollments / stats.total_enrollments) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Paused</span>
                  <span className="text-lg font-bold text-gray-900">{stats.paused_enrollments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (stats.paused_enrollments / stats.total_enrollments) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Learning Progress">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="8"
                    strokeDasharray={`${
                      (stats.average_progress / 100) * 339.29
                    } 339.29`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.round(stats.average_progress)}%
                  </span>
                  <span className="text-xs text-gray-500">Average</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Quick Stats">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Withdrawn</span>
                <span className="font-bold text-gray-900">{stats.withdrawn_enrollments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Courses</span>
                <span className="font-bold text-gray-900">{courses.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-bold text-gray-900">{users.length}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Users */}
      <Card title="Recent Users" className="mb-8">
        {users.length > 0 ? (
          <DataTable
            columns={[
              { key: 'email', label: 'Email' },
              {
                key: 'first_name',
                label: 'Name',
                render: (_, row) => `${row.first_name} ${row.last_name}`,
              },
              {
                key: 'roles',
                label: 'Roles',
                render: (roles) =>
                  roles.map((role: string) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded mr-2"
                    >
                      {role}
                    </span>
                  )),
              },
              {
                key: 'status',
                label: 'Status',
                render: (status) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status}
                  </span>
                ),
              },
              {
                key: 'created_at',
                label: 'Joined',
                render: (date) => new Date(date).toLocaleDateString(),
              },
            ]}
            data={users}
            actions={[
              {
                label: 'View',
                onClick: (row) => router.push(`/admin/users/${row.id}`),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon="👥"
            title="No Users Yet"
            description="Users will appear here once they sign up"
          />
        )}
      </Card>

      {/* Recent Courses */}
      <Card title="Recent Courses" className="mb-8">
        {courses.length > 0 ? (
          <DataTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'instructor_name', label: 'Instructor' },
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
                key: 'rating',
                label: 'Rating',
                render: (rating) => `⭐ ${rating.toFixed(1)}`,
              },
            ]}
            data={courses}
            actions={[
              {
                label: 'Edit',
                onClick: (row) => router.push(`/admin/courses/${row.id}`),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon="📚"
            title="No Courses Yet"
            description="Create your first course to get started"
          />
        )}
      </Card>

      {/* Recent Enrollments */}
      <Card title="Recent Enrollments">
        {enrollments.length > 0 ? (
          <DataTable
            columns={[
              { key: 'user_name', label: 'Student' },
              { key: 'course_title', label: 'Course' },
              {
                key: 'progress',
                label: 'Progress',
                render: (progress) => (
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
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
                    {status}
                  </span>
                ),
              },
            ]}
            data={enrollments}
            actions={[
              {
                label: 'View',
                onClick: (row) =>
                  router.push(
                    `/admin/enrollments/${row.id}`
                  ),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon="✅"
            title="No Enrollments Yet"
            description="Enrollments will appear here"
          />
        )}
      </Card>
    </AdminLayout>
  );
}
