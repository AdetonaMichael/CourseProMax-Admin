'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings as SettingsIcon, Save, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { InstructorLayout } from '@/components/instructor/InstructorLayout';
import { Card, LoadingSkeleton } from '@/components/dashboard/DashboardComponents';
import {
  fetchInstructorSettings,
  updateInstructorSettings,
  handleInstructorAPIError,
  InstructorSettings,
} from '@/services/instructor.service';

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState<InstructorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<InstructorSettings>>({
    email_notifications: {
      new_enrollment: true,
      assignment_submission: true,
      quiz_attempt: true,
      student_question: true,
      course_review: true,
    },
    course_settings: {
      auto_mark_complete: false,
      require_lesson_order: true,
      allow_student_reviews: true,
    },
    privacy: {
      show_profile_public: true,
      show_student_list: false,
    },
    language: 'en',
    timezone: 'Africa/Lagos',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInstructorSettings();
        setSettings(data);
        setFormData(data);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(handleInstructorAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadSettings();
    }
  }, [status]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await updateInstructorSettings(formData);
      setSettings(updated);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(handleInstructorAPIError(err));
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string[], value: any) => {
    const newData = JSON.parse(JSON.stringify(formData));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setFormData(newData);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your instructor preferences</p>
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

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Notifications */}
        <Card className="lg:col-span-2" title="Email Notifications">
          <div className="space-y-4">
            {[
              { key: 'new_enrollment', label: 'New Student Enrollment' },
              { key: 'assignment_submission', label: 'Assignment Submission' },
              { key: 'quiz_attempt', label: 'Quiz Attempt' },
              { key: 'student_question', label: 'Student Question' },
              { key: 'course_review', label: 'Course Review' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.email_notifications?.[key as keyof typeof formData.email_notifications] || false}
                  onChange={(e) =>
                    updateSettings(['email_notifications', key], e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Regional Settings */}
        <Card title="Regional Settings">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={formData.language || 'en'}
                onChange={(e) => updateSettings(['language'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={formData.timezone || 'Africa/Lagos'}
                onChange={(e) => updateSettings(['timezone'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      
      {/* Course Settings */}
      <Card title="Course Settings" className="mt-6 lg:col-span-2">
        <div className="space-y-4">
          {[
            { key: 'auto_mark_complete', label: 'Auto-mark lessons complete', desc: 'Automatically mark lessons as complete after viewing' },
            { key: 'require_lesson_order', label: 'Require lesson order', desc: 'Students must complete lessons in sequence' },
            { key: 'allow_student_reviews', label: 'Allow student reviews', desc: 'Students can leave reviews for your courses' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.course_settings?.[key as keyof typeof formData.course_settings] || false}
                  onChange={(e) =>
                    updateSettings(['course_settings', key], e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy Settings" className="mt-6 lg:col-span-2">
        <div className="space-y-4">
          {[
            { key: 'show_profile_public', label: 'Show profile publicly', desc: 'Allow students to view your profile' },
            { key: 'show_student_list', label: 'Show student list', desc: 'Display enrolled students to each other' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacy?.[key as keyof typeof formData.privacy] || false}
                  onChange={(e) =>
                    updateSettings(['privacy', key], e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </InstructorLayout>
  );
}
