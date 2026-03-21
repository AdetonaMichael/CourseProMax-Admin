'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, AlertTriangle } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton, EmptyState, DataTable } from '@/components/dashboard/DashboardComponents';
import {
  fetchInstructorEnrollments,
  handleInstructorAPIError,
  InstructorEnrollmentsResponse,
} from '@/services/instructor.service';

export default function EnrollmentsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [enrollmentsData, setEnrollmentsData] = useState<InstructorEnrollmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInstructorEnrollments(page);
        setEnrollmentsData(data);
      } catch (err) {
        console.error('Error loading enrollments:', err);
        setError(handleInstructorAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadEnrollments();
    }
  }, [status, page]);

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSkeleton count={3} />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Enrollments</h1>
        <p className="text-gray-600 mt-1">Manage student enrollments across your courses</p>
      </div>

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
        {enrollmentsData?.enrollments && enrollmentsData.enrollments.length > 0 ? (
          <>
            <DataTable
              columns={[
                { key: 'user_name', label: 'Student Name' },
                { key: 'user_email', label: 'Email' },
                { key: 'course_title', label: 'Course' },
                {
                  key: 'progress',
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
                      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                    </span>
                  ),
                },
                {
                  key: 'enrolled_at',
                  label: 'Enrolled Date',
                  render: (enrolled_at) => new Date(enrolled_at).toLocaleDateString(),
                },
              ]}
              data={enrollmentsData.enrollments}
            />
            {enrollmentsData.pagination && enrollmentsData.pagination.total > 10 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, enrollmentsData.pagination.total)} of {enrollmentsData.pagination.total} enrollments
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
                    disabled={page >= enrollmentsData.pagination.last_page}
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
            icon={<Users className="w-12 h-12 text-gray-400" />}
            title="No Enrollments Yet"
            description="Students will appear here as they enroll in your courses"
          />
        )}
      </Card>
    </InstructorLayout>
  );
}
