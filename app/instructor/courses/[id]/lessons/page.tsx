'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Trash2, Edit2, ChevronRight, Lock, Eye, X } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { fetchCourseLessons, Lesson } from '@/services/instructor.service';

export default function CourseLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const courseId = params.id as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    video_url: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchCourseLessons(Number(courseId));
      setLessons(res.lessons || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Lesson title is required');
      return;
    }

    try {
      setError('');
      const newLesson = {
        id: Math.floor(Math.random() * -1000000),
        course_id: Number(courseId),
        title: formData.title,
        description: formData.description,
        content: '',
        type: formData.type as any,
        order: lessons.length + 1,
        is_active: true,
        is_preview: false,
        estimated_duration_minutes: formData.duration ? parseInt(formData.duration) : 0,
        video_url: formData.video_url,
        difficulty: 'beginner' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Lesson;

      setLessons([...lessons, newLesson]);
      setFormData({ title: '', description: '', type: 'video', duration: '', video_url: '' });
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create lesson');
    }
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter(l => l.id !== lessonId));
    }
  };

  const handleDragStart = (e: React.DragEvent, lessonId: number) => {
    setDraggedItem(lessonId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = lessons.findIndex(l => l.id === draggedItem);
    const targetIndex = lessons.findIndex(l => l.id === targetId);

    const newLessons = [...lessons];
    [newLessons[draggedIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[draggedIndex]];

    setLessons(newLessons);
    setDraggedItem(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Course Lessons</h1>
        <p className="text-gray-600 mt-1">Manage lessons for your course</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Add Lesson Form */}
      {isCreating && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Lesson</h3>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter lesson title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter lesson description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="video">Video</option>
                  <option value="reading">Reading</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {formData.type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus size={16} />
                Create Lesson
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ title: '', description: '', type: 'video', duration: '', video_url: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">All Lessons ({lessons.length})</h2>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Lesson
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
            <p>Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">📚</div>
            <p className="text-gray-700 font-medium">No lessons yet</p>
            <p className="text-gray-600 text-sm mt-1">Click "Add Lesson" to create your first lesson</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                draggable
                onDragStart={(e) => handleDragStart(e, lesson.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, lesson.id)}
                className={`p-4 border rounded-lg cursor-move transition-all ${
                  draggedItem === lesson.id
                    ? 'bg-blue-50 border-blue-300 opacity-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-start gap-4">
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-gray-400">⋮⋮</div>
                      <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded min-w-[50px] text-center">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      )}

                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                          {lesson.type}
                        </span>
                        {lesson.estimated_duration_minutes && (
                          <span className="text-xs text-gray-600">⏱ {lesson.estimated_duration_minutes} min</span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Eye size={14} />
                          Public
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/instructor/courses/${courseId}/lessons/${lesson.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit lesson"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete lesson"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push(`/instructor/courses/${courseId}`)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Course
        </button>
      </div>
    </InstructorLayout>
  );
}
