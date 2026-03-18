'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform performance and insights</p>
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible gap-6 md:grid-cols-2 pb-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-600">Chart coming soon</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-600">Chart coming soon</p>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}
