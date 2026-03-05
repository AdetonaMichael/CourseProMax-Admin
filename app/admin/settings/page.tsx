'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system-wide settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">System settings coming soon...</p>
      </div>
      </div>
    </AdminLayout>
  )
}
