'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Mail, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Award, Book, X } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { fetchStudentProgress } from '@/services/instructor.service';

export default function StudentProgressPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const courseId = params.id as string;
  const enrollmentId = params.enrollmentId as string;

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    loadStudentProgress();
  }, [courseId, enrollmentId]);

  const loadStudentProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchStudentProgress(courseId as any, enrollmentId as any);
      setStudentData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load student progress');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Student Progress</h1>
        <p className="text-gray-600 mt-1">Detailed learning progress and performance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading student progress...</p>
        </div>
      ) : studentData ? (
        <>
          {/* Student Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">{studentData.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      {studentData.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      Enrolled: {new Date(studentData.enrollment_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <span
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  studentData.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : studentData.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {studentData.status.charAt(0).toUpperCase() + studentData.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Overall Progress</span>
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${(studentData.progress || 0) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900 min-w-[50px] text-right">
                  {Math.round((studentData.progress || 0) * 100)}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Lessons Completed</span>
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {studentData.lessons_completed || 0}
                <span className="text-sm text-gray-600 font-normal">/{studentData.total_lessons || 0}</span>
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Average Score</span>
                <Award size={20} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{(studentData.average_score || 0).toFixed(1)}%</p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Time Spent</span>
                <Clock size={20} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {studentData.time_spent_hours || 0}
                <span className="text-sm text-gray-600 font-normal"> hrs</span>
              </p>
            </div>
          </div>

          {/* Lessons Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Book size={20} className="text-blue-600" />
              Lesson Progress
            </h3>

            <div className="space-y-3">
              {(studentData.lessons || []).map((lesson: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-xs text-gray-600 mt-1">Type: {lesson.type}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {lesson.completed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={18} />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={18} />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                    )}

                    {lesson.score !== null && (
                      <span className="text-sm font-semibold text-gray-900 min-w-[40px] text-right">
                        {lesson.score}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Performance */}
          {(studentData.quizzes || []).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Performance</h3>

              <div className="space-y-3">
                {(studentData.quizzes || []).map((quiz: any, idx: number) => (
                  <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{quiz.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Attempted: {quiz.attempts} time{quiz.attempts !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{quiz.score}</p>
                        <p className="text-xs text-gray-600">Best score</p>
                      </div>
                    </div>

                    {quiz.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-700">
                        Feedback: {quiz.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Submitted */}
          {(studentData.assignments || []).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment Submissions</h3>

              <div className="space-y-3">
                {(studentData.assignments || []).map((assignment: any, idx: number) => (
                  <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          assignment.status === 'submitted'
                            ? 'bg-green-100 text-green-800'
                            : assignment.status === 'graded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>

                    {assignment.score !== null && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-semibold text-gray-900">
                          {assignment.score}/{assignment.max_score}
                        </span>
                      </div>
                    )}

                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-700">
                        Feedback: {assignment.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>

            <div className="space-y-4">
              {(studentData.activities || []).map((activity: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {activity.type === 'lesson_completed' && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                    {activity.type === 'quiz_submitted' && (
                      <Award size={20} className="text-orange-600" />
                    )}
                    {activity.type === 'assignment_submitted' && (
                      <Book size={20} className="text-blue-600" />
                    )}
                    {!['lesson_completed', 'quiz_submitted', 'assignment_submitted'].includes(activity.type) && (
                      <AlertCircle size={20} className="text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}{' '}
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push(`/instructor/courses/${courseId}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Course
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Send Message
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No student data available</p>
        </div>
      )}
    </InstructorLayout>
  );
}
