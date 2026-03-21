'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FileText, Users, CheckCircle, AlertCircle, Filter, Search, X, Download, Send } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { fetchCourseAssignments, fetchAssignmentSubmissions, gradeSubmission } from '@/services/instructor.service';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  submitted_count: number;
  total_students: number;
}

interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  status: 'pending' | 'graded';
  score?: number;
  feedback?: string;
}

export default function AssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const courseId = params.id as string;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Grading modal state
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [grades, setGrades] = useState({ score: '', feedback: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  useEffect(() => {
    if (selectedAssignment) {
      loadSubmissions(selectedAssignment);
    }
  }, [selectedAssignment]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchCourseAssignments(courseId as any);
      setAssignments(res.assignments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (assignmentId: string) => {
    try {
      setLoading(true);
      const res = await fetchAssignmentSubmissions(courseId as any, assignmentId as any);
      setSubmissions(res.submissions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission || !grades.score) {
      setError('Please enter a score');
      return;
    }

    try {
      setError('');
      await gradeSubmission(
        Number(courseId),
        Number(gradingSubmission.assignment_id),
        Number(gradingSubmission.id),
        {
          score: parseFloat(grades.score),
          feedback: grades.feedback,
          status: 'graded'
        }
      );

      // Update submission in list
      const updated = submissions.map(s =>
        s.id === gradingSubmission.id
          ? { ...s, score: parseFloat(grades.score), feedback: grades.feedback, status: 'graded' }
          : s
      );
      setSubmissions(updated as AssignmentSubmission[]);

      setGradingSubmission(null);
      setGrades({ score: '', feedback: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to grade submission');
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'pending' && sub.status !== 'pending') return false;
    if (filterStatus === 'graded' && sub.status !== 'graded') return false;
    if (searchTerm && !sub.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (status === 'unauthenticated') return null;

  return (
    <InstructorLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Course Assignments</h1>
        <p className="text-gray-600 mt-1">Manage and grade student assignments</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {loading && !selectedAssignment ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      ) : !selectedAssignment ? (
        // Assignments List View
        <div className="flex md:grid overflow-x-auto md:overflow-visible gap-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
          {assignments.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium">No assignments yet</p>
              <p className="text-gray-600 text-sm mt-1">Create assignments in your course</p>
            </div>
          ) : (
            assignments.map(assignment => (
              <div
                key={assignment.id}
                className="flex-shrink-0 w-full md:w-auto"
              >
                <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex-1">{assignment.title}</h3>
                    {assignment.submitted_count === assignment.total_students ? (
                      <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-orange-600" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points:</span>
                    <span className="text-sm font-medium text-gray-900">{assignment.max_score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{
                            width: `${(assignment.submitted_count / assignment.total_students) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {assignment.submitted_count}/{assignment.total_students}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedAssignment(assignment.id);
                    setShowSubmissions(true);
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Submissions
                </button>                </div>              </div>
            ))
          )}
        </div>
      ) : (
        // Submissions View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedAssignment(null);
                setShowSubmissions(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              ← Back to Assignments
            </button>

            <div className="text-sm text-gray-600">
              {assignments.find(a => a.id === selectedAssignment)?.title}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('graded')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'graded'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Graded
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p>No submissions found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map(submission => (
                    <tr key={submission.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{submission.student_name}</p>
                        <p className="text-sm text-gray-600">{submission.student_email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(submission.submitted_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            submission.status === 'graded'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {submission.status ? submission.status.charAt(0).toUpperCase() + submission.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {submission.score ? (
                          <p className="font-medium text-gray-900">
                            {submission.score}/{assignments.find(a => a.id === selectedAssignment)?.max_score}
                          </p>
                        ) : (
                          <p className="text-gray-500">—</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setGradingSubmission(submission);
                            setGrades({ score: submission.score?.toString() || '', feedback: submission.feedback || '' });
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Submission</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Student:</p>
              <p className="font-medium text-gray-900">{gradingSubmission.student_name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={grades.score}
                    onChange={(e) => setGrades({ ...grades, score: e.target.value })}
                    placeholder="Enter score"
                    max={assignments.find(a => a.id === selectedAssignment)?.max_score || 100}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="py-2 text-gray-600">/
                    {assignments.find(a => a.id === selectedAssignment)?.max_score || 100}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  value={grades.feedback}
                  onChange={(e) => setGrades({ ...grades, feedback: e.target.value })}
                  placeholder="Add feedback for the student..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setGradingSubmission(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmission}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Send size={16} />
                Submit Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
