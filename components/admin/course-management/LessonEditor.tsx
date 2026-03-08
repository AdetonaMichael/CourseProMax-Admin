'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { getStoredToken } from '@/utils/storage.utils';
import { useNotification } from '@/hooks/useNotification';

export const LessonEditor = ({ courseId, onClose }: { courseId: number; onClose: () => void }) => {
  const notification = useNotification()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [difficulty, setDifficulty] = useState('beginner');
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Lesson title is required');
      return;
    }

    if (!description.trim()) {
      setError('Lesson description is required');
      return;
    }

    try {
      setSaving(true);
      const token = getStoredToken();
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(API_ENDPOINTS.ADMIN.LESSONS(courseId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          estimated_duration_minutes: estimatedDuration,
          difficulty,
          is_preview: isPreview,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create lesson');
      }

      notification.success('Lesson created successfully!');
      onClose();
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      setError(err.message || 'Error creating lesson. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lesson-editor bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-black">Create New Lesson</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition"
        >
          <X size={20} className="text-black" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            placeholder="Enter lesson title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            placeholder="Enter lesson description"
            rows={3}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Estimated Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-900">Mark as preview (free access)</span>
        </label>

        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mt-4">
          <p className="text-xs text-gray-700">
            Note: After creating the lesson, you can add videos and quizzes from the lesson list.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-300">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-black font-medium rounded-lg hover:bg-gray-400 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};
