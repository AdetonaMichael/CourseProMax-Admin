'use client'

import { InstructorLayout } from '@/components/instructor/InstructorLayout'

export default function InstructorHelpPage() {
  return (
    <InstructorLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Documentation</h1>
        <p className="text-gray-600 mt-2">Resources and support for instructors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-gray-600">Learn how to create and manage your first course.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Creation Guide</h3>
          <p className="text-gray-600">Best practices for creating engaging course content.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Management</h3>
          <p className="text-gray-600">Manage enrollments and track student progress.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reporting</h3>
          <p className="text-gray-600">Understand your course performance and student data.</p>
        </div>
      </div>
      </div>
    </InstructorLayout>
  )
}
