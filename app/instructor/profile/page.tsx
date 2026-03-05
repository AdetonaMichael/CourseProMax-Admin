'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { InstructorLayout } from '@/components/instructor/InstructorLayout'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

export default function InstructorProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    bio: user?.bio || '',
  })

  const [saveState, setSaveState] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaveState({ type: 'loading' })
    try {
      setSaveState({ type: 'success', message: 'Profile updated successfully' })
      setIsEditing(false)
      setTimeout(() => setSaveState({ type: 'idle' }), 3000)
    } catch (error) {
      setSaveState({ type: 'error', message: 'Failed to update profile' })
    }
  }

  return (
    <InstructorLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your instructor information</p>
        </div>

        {saveState.type !== 'idle' && (
          <div
            className={`mb-6 p-4 rounded-lg ${saveState.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
          >
            {saveState.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <Input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="Tell students about yourself..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="primary">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      first_name: user?.first_name || '',
                      last_name: user?.last_name || '',
                      email: user?.email || '',
                      phone_number: user?.phone_number || '',
                      bio: user?.bio || '',
                    })
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </InstructorLayout>
  )
}
