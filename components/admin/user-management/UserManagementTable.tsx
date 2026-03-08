'use client'

import React, { useState, useEffect } from 'react'
import {
  Eye,
  Shield,
  Lock,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  fetchUsers,
  deleteUser,
  blockUser,
  unblockUser,
  assignRoleToUser,
  changeUserStatus,
  type UsersResponse,
  handleAPIError,
} from '@/services/admin.service'
import { useNotification } from '@/hooks/useNotification'
import { useConfirmation } from '@/components/shared/ConfirmationDialog'
import { usePrompt } from '@/components/shared/PromptDialog'
import UserDetailsSideDrawer from './UserDetailsSideDrawer'
import UserFiltersBar from './UserFiltersBar'
import './UserManagementTable.css'

interface Filters {
  search: string
  role: string
  status: string
  sort_by: string
  sort_order: 'asc' | 'desc'
  per_page: number
}

interface UserManagementTableProps {
  onDataChange?: () => void
}

export default function UserManagementTable({ onDataChange }: UserManagementTableProps) {
  const notification = useNotification()
  const { confirm } = useConfirmation()
  const { prompt } = usePrompt()
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1,
  })
  const [filters, setFilters] = useState<Filters>({
    search: '',
    role: '',
    status: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 20,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedUserView, setSelectedUserView] = useState<any | null>(null)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)

  // Load users when filters or page changes
  useEffect(() => {
    loadUsers()
  }, [filters, pagination.current_page])

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)
      
      const data: UsersResponse = await fetchUsers(pagination.current_page, {
        per_page: filters.per_page,
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      })

      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err: any) {
      const apiError = handleAPIError(err)
      setError(apiError.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, current_page: 1 }))
  }

  const handleViewUser = (user: any) => {
    setSelectedUserView(user)
    setShowDetailsDrawer(true)
  }

  const handleDeleteUser = async (userId: number) => {
    const confirmed = await confirm({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
    })

    if (!confirmed) {
      return
    }

    try {
      await deleteUser(userId)
      await loadUsers()
      onDataChange?.()
      notification.success('User deleted successfully')
    } catch (err: any) {
      notification.error('Error deleting user: ' + (err.message || 'Unknown error'))
    }
  }

  const handleBlockUser = async (userId: number, currentStatus: string) => {
    if (currentStatus === 'blocked') {
      // Unblock
      try {
        await unblockUser(userId)
        await loadUsers()
        onDataChange?.()
        notification.success('User unblocked successfully')
      } catch (err: any) {
        notification.error('Error unblocking user: ' + (err.message || 'Unknown error'))
      }
    } else {
      // Block
      const reason = await prompt({
        title: 'Block User',
        message: 'Enter reason for blocking (optional):',
        placeholder: 'e.g., Violating community guidelines',
      })
      if (reason === null) return

      try {
        await blockUser(userId, reason || 'No reason provided')
        await loadUsers()
        onDataChange?.()
        notification.success('User blocked successfully')
      } catch (err: any) {
        notification.error('Error blocking user: ' + (err.message || 'Unknown error'))
      }
    }
  }

  const handleChangeRole = async (userId: number) => {
    const availableRoles = ['student', 'instructor', 'admin', 'moderator']
    const roleInput = await prompt({
      title: 'Assign Role',
      message: `Available roles: ${availableRoles.join(', ')}`,
      placeholder: 'Enter role to assign',
    })

    if (!roleInput || !availableRoles.includes(roleInput.toLowerCase())) {
      notification.error('Invalid role selected')
      return
    }

    try {
      await assignRoleToUser(userId, [roleInput.toLowerCase()])
      await loadUsers()
      onDataChange?.()
      notification.success('Role assigned successfully')
    } catch (err: any) {
      notification.error('Error assigning role: ' + (err.message || 'Unknown error'))
    }
  }

  const handleToggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((u) => u.id))
    }
  }

  const filteredUsersCount = users.filter((u) => selectedUsers.includes(u.id)).length

  return (
    <div className="user-management-table">
      {/* Filters Bar */}
      <UserFiltersBar filters={filters} onFiltersChange={handleFilterChange} onRefresh={loadUsers} loading={loading} />

      {/* Error Message */}
      {error && <div className="error-message">⚠ {error}</div>}

      {/* Users Table */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={handleSelectAll} />
              </th>
              <th className="sortable" onClick={() => handleFilterChange({ sort_by: 'email', sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' })}>
                Email {filters.sort_by === 'email' && (filters.sort_order === 'asc' ? '↑' : '↓')}
              </th>
              <th>Name</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Joined</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  <div className="loading-spinner">Loading users...</div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className={`status-${user.status}`}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleToggleSelectUser(user.id)}
                    />
                  </td>
                  <td className="email-col">{user.email}</td>
                  <td className="name-col">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="roles-col">
                    <div className="role-badges">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role: string) => (
                          <span key={role} className="role-badge">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </td>
                  <td className="status-col">
                    <span className={`status-badge status-${user.status}`}>{user.status}</span>
                  </td>
                  <td className="phone-col">{user.phone || '-'}</td>
                  <td className="date-col">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions-col">
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => handleViewUser(user)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-icon btn-role"
                        onClick={() => handleChangeRole(user.id)}
                        title="Assign Role"
                      >
                        <Shield size={18} />
                      </button>
                      <button
                        className={`btn-icon btn-block ${user.status === 'blocked' ? 'active' : ''}`}
                        onClick={() => handleBlockUser(user.id, user.status)}
                        title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-bar">
        <div className="pagination-info">
          {pagination.total > 0 && (
            <span>
              Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} users
              {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
            </span>
          )}
        </div>
        <div className="pagination-controls">
          <button
            className="btn btn-pagination"
            onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page - 1 }))}
            disabled={pagination.current_page === 1 || loading}
            title="Previous page"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
          <span className="page-indicator">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            className="btn btn-pagination"
            onClick={() => setPagination((prev) => ({ ...prev, current_page: prev.current_page + 1 }))}
            disabled={pagination.current_page === pagination.last_page || loading}
            title="Next page"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* User Details Side Drawer */}
      <UserDetailsSideDrawer
        isOpen={showDetailsDrawer}
        userId={selectedUserView?.id || null}
        onClose={() => setShowDetailsDrawer(false)}
        onUserUpdated={loadUsers}
      />
    </div>
  )
}
