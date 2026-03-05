'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.id

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Details</h1>
            <p className="text-gray-600 mt-2">View enrollment information (ID: {enrollmentId})</p>
          </div>
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Enrollment details page coming soon...</p>
          <p className="text-sm text-gray-500 mt-4">Enrollment ID: {enrollmentId}</p>
        </div>
      </div>
    </AdminLayout>
  )
}
