'use client'

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { getStoredToken } from '@/utils/storage.utils';
import { useNotification } from '@/hooks/useNotification';

export const VideoEditor = ({ courseId, lessonId, onClose }: { courseId: number; lessonId: number; onClose: () => void }) => {
  const notification = useNotification();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError('Video file must be less than 500MB');
        return;
      }
      setError('');
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    try {
      setUploading(true);
      const token = getStoredToken();
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(
        API_ENDPOINTS.ADMIN.LESSON_VIDEO(courseId, lessonId),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload video');
      }

      notification.success('Video uploaded successfully!');
      onClose();
    } catch (err: any) {
      console.error('Error uploading video:', err);
      setError(err.message || 'Error uploading video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-editor">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Add Video to Lesson</h2>
          <p className="text-xs text-gray-600 mt-1">Upload and organize video content</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(90vh-120px)]">

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 px-6">
        {/* Video Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            placeholder="Enter video title"
          />
        </div>

        {/* Video Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            placeholder="Enter video description"
            rows={3}
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Select Video File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="video-input"
            />
            <label htmlFor="video-input" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload size={32} className="text-gray-600" />
              <span className="font-medium text-gray-900">
                {videoFile ? videoFile.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-600">MP4, WebM, AVI or MOV (Max. 500MB)</span>
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 pb-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
            disabled={uploading || !videoFile}
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};
