'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'

export default function UserDetailPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-2">View and edit user information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">User detail page coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  )
}
