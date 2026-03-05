'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Download,
  Users,
  Check,
  BookOpen,
  Ban,
} from 'lucide-react'
import UserManagementTable from '@/components/admin/user-management/UserManagementTable'
import AddUserModal from '@/components/admin/user-management/AddUserModal'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { fetchUsers, handleAPIError } from '@/services/admin.service'
import './UserManagement.css'

interface Stats {
  total: number
  active: number
  instructors: number
  blocked: number
  loading: boolean
}

export default function UserManagementPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    instructors: 0,
    blocked: 0,
    loading: true,
  })
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setStats((prev) => ({ ...prev, loading: true }))

      // Fetch users to calculate stats
      const data = await fetchUsers(1, { per_page: 1000 })
      const users = data?.users || []

      // Calculate stats
      const total = data?.pagination?.total || users.length
      const active = users.filter((u) => u.status === 'active').length
      const instructors = users.filter((u) => u.roles?.includes('instructor')).length
      const blocked = users.filter((u) => u.status === 'blocked').length

      setStats({
        total,
        active,
        instructors,
        blocked,
        loading: false,
      })
    } catch (error) {
      console.error('[User Management] Error loading stats:', error)
      setStats((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <AdminLayout>
      <div className="user-management-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1>User Management</h1>
              <p className="subtitle">Manage administrators, instructors, and view user details</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddUserModal(true)}
              >
                <Plus size={18} />
                Add New User
              </button>
              <button className="btn btn-secondary">
                <Download size={18} />
                Export Users
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats.loading ? '-' : stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Check size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Users</p>
              <p className="stat-value">{stats.loading ? '-' : stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Instructors</p>
              <p className="stat-value">{stats.loading ? '-' : stats.instructors}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Ban size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Blocked Users</p>
              <p className="stat-value">{stats.loading ? '-' : stats.blocked}</p>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <UserManagementTable onDataChange={loadStats} />
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={() => {
          setShowAddUserModal(false)
          loadStats()
        }}
      />
    </AdminLayout>
  )
}

