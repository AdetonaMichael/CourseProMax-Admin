'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Edit2, Trash2, AlertTriangle, Star } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton, EmptyState, DataTable } from '@/components/dashboard/DashboardComponents';
import { CourseCreationModal } from '@/components/instructor/CourseCreationModal';
import {
  fetchInstructorCourses,
  deleteCourse,
  handleInstructorAPIError,
  InstructorCoursesResponse,
} from '@/services/instructor.service';

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [coursesData, setCoursesData] = useState<InstructorCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const loadCourses = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInstructorCourses(pageNum);
      setCoursesData(data);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError(handleInstructorAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadCourses(page);
    }
  }, [status, page]);

  const handleDelete = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      setDeleting(courseId);
      await deleteCourse(courseId);
      setCoursesData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          courses: prev.courses.filter(c => c.id !== courseId),
        };
      });
    } catch (err) {
      setError(handleInstructorAPIError(err));
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSkeleton count={3} />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and create your courses</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Course
        </button>
      </div>

      {/* Course Creation Modal */}
      <CourseCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          loadCourses(1);
        }}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-red-900">{error.title}</h3>
            <p className="text-red-800 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      <Card>
        {coursesData?.courses && coursesData.courses.length > 0 ? (
          <>
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
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{(Number(rating) || 0).toFixed(1)}</span>
                    </div>
                  ),
                },
                {
                  key: 'is_active',
                  label: 'Status',
                  render: (is_active) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {is_active ? 'Active' : 'Inactive'}
                    </span>
                  ),
                },
              ]}
              data={coursesData.courses}
              actions={[
                {
                  label: 'Edit',
                  onClick: (row) => router.push(`/instructor/courses/${row.id}`),
                },
                {
                  label: 'Delete',
                  onClick: (row) => handleDelete(row.id),
                  variant: 'danger',
                },
              ]}
            />
            {coursesData.pagination && coursesData.pagination.total > 10 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {page} of {coursesData.pagination.last_page}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= coursesData.pagination.last_page}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
    </InstructorLayout>
  );
}
