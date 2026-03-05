'use client'

import React, { useEffect, useState } from 'react'
import { X, Mail, Phone, Calendar, Shield, Wallet, BookOpen, CreditCard, Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { getUserFullProfile, handleAPIError } from '@/services/admin.service'
import './UserDetailsSideDrawer.css'

interface UserDetailsSideDrawerProps {
  isOpen: boolean
  userId: number | null
  onClose: () => void
  onUserUpdated?: () => void
}

interface UserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  status: string
  roles: string[]
  created_at: string
  updated_at: string
  last_login_at?: string
  blocked_at?: string
  block_reason?: string
  wallet?: {
    balance: number
    total_credited: number
    total_debited: number
    updated_at: string
  }
  enrollments?: {
    total: number
    active: number
    completed: number
    paused: number
    enrollments: Array<{
      id: number
      course_title: string
      status: string
      progress: number
      lessons_completed: number
      total_lessons: number
      grade?: string
      enrolled_at: string
    }>
  }
  transactions?: {
    transactions: Array<{
      id: number
      type: string
      description: string
      reference: string
      amount: number
      status: string
      created_at: string
    }>
  }
  activity?: {
    total_logins: number
    last_login?: string
    courses_created: number
    lessons_created: number
  }
}

export default function UserDetailsSideDrawer({
  isOpen,
  userId,
  onClose,
  onUserUpdated,
}: UserDetailsSideDrawerProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'enrollments' | 'transactions' | 'activity'>('profile')

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetails()
    }
  }, [isOpen, userId])

  async function loadUserDetails() {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const profile = await getUserFullProfile(userId, ['wallet', 'transactions', 'enrollments', 'activity'])
      setUser(profile.user)
    } catch (err: any) {
      const apiError = handleAPIError(err)
      setError(apiError.message || 'Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Side Drawer */}
      <div className={`user-details-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <h2>User Details</h2>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {loading ? (
            <div className="drawer-loading">Loading user details...</div>
          ) : error ? (
            <div className="drawer-error">{error}</div>
          ) : user ? (
            <>
              {/* User Header */}
              <div className="user-header">
                <div className="user-avatar-lg">
                  {user?.first_name?.charAt(0) || 'U'}
                  {user?.last_name?.charAt(0) || 'U'}
                </div>
                <div className="user-meta">
                  <h3>{user?.first_name ?? '-'} {user?.last_name ?? '-'}</h3>
                  <p className="email">{user?.email ?? '-'}</p>
                  <div className="status-badge-group">
                    <span className={`status-badge status-${user?.status}`}>{user?.status ?? 'unknown'}</span>
                    {user?.roles && user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <span key={role} className="role-badge">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="role-badge">No roles</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="drawer-tabs">
                <button
                  className={`drawer-tab ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <Shield size={16} />
                  Profile
                </button>
                <button
                  className={`drawer-tab ${activeTab === 'wallet' ? 'active' : ''}`}
                  onClick={() => setActiveTab('wallet')}
                >
                  <Wallet size={16} />
                  Wallet
                </button>
                <button
                  className={`drawer-tab ${activeTab === 'enrollments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('enrollments')}
                >
                  <BookOpen size={16} />
                  Courses
                </button>
                <button
                  className={`drawer-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transactions')}
                >
                  <CreditCard size={16} />
                  Transactions
                </button>
                <button
                  className={`drawer-tab ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  <Activity size={16} />
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              <div className="drawer-tab-content">
                {activeTab === 'profile' && (
                  <div className="tab-panel">
                    <div className="info-section">
                      <h4>Contact Information</h4>
                      <div className="info-item">
                        <span className="info-label">
                          <Mail size={16} />
                          Email
                        </span>
                        <span className="info-value">{user?.email ?? '-'}</span>
                      </div>
                      {user?.phone && (
                        <div className="info-item">
                          <span className="info-label">
                            <Phone size={16} />
                            Phone
                          </span>
                          <span className="info-value">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="info-section">
                      <h4>Account Information</h4>
                      <div className="info-item">
                        <span className="info-label">ID</span>
                        <span className="info-value">#{user?.id ?? '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Status</span>
                        <span className={`status-badge status-${user?.status}`}>
                          {user?.status ?? 'unknown'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Roles</span>
                        <div className="role-tags">
                          {user?.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span key={role} className="role-tag">
                                {role}
                              </span>
                            ))
                          ) : (
                            <span className="role-tag">No roles</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Timestamps</h4>
                      <div className="info-item">
                        <span className="info-label">
                          <Calendar size={16} />
                          Created
                        </span>
                        <span className="info-value">
                          {user?.created_at ? (
                            <>
                              {new Date(user.created_at).toLocaleDateString()} at{' '}
                              {new Date(user.created_at).toLocaleTimeString()}
                            </>
                          ) : (
                            '-'
                          )}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">
                          <Calendar size={16} />
                          Updated
                        </span>
                        <span className="info-value">
                          {user?.updated_at ? (
                            <>
                              {new Date(user.updated_at).toLocaleDateString()} at{' '}
                              {new Date(user.updated_at).toLocaleTimeString()}
                            </>
                          ) : (
                            '-'
                          )}
                        </span>
                      </div>
                      {user?.last_login_at && (
                        <div className="info-item">
                          <span className="info-label">
                            <Calendar size={16} />
                            Last Login
                          </span>
                          <span className="info-value">
                            {user?.last_login_at ? (
                              <>
                                {new Date(user.last_login_at).toLocaleDateString()} at{' '}
                                {new Date(user.last_login_at).toLocaleTimeString()}
                              </>
                            ) : (
                              'Never'
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div className="tab-panel">
                    {user?.wallet ? (
                      <>
                        <div className="wallet-cards">
                          <div className="wallet-card">
                            <h4>Current Balance</h4>
                            <p className="amount">₦{user.wallet.balance?.toLocaleString() || '0'}</p>
                          </div>
                          <div className="wallet-card">
                            <h4>Total Credited</h4>
                            <p className="amount credited">
                              <TrendingUp size={16} />
                              +₦{user.wallet.total_credited?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <div className="wallet-card">
                            <h4>Total Debited</h4>
                            <p className="amount debited">
                              <TrendingDown size={16} />
                              -₦{user.wallet.total_debited?.toLocaleString() || '0'}
                            </p>
                          </div>
                        </div>
                        <p className="text-muted">Last updated: {new Date(user.wallet.updated_at).toLocaleString()}</p>
                      </>
                    ) : (
                      <div className="empty-state">
                        <Wallet size={32} />
                        <p>No wallet information available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'enrollments' && (
                  <div className="tab-panel">
                    {user?.enrollments && user.enrollments.total > 0 ? (
                      <>
                        <div className="stats-row">
                          <div className="stat">
                            <span className="label">Total</span>
                            <span className="value">{user.enrollments.total}</span>
                          </div>
                          <div className="stat">
                            <span className="label">Active</span>
                            <span className="value">{user.enrollments.active}</span>
                          </div>
                          <div className="stat">
                            <span className="label">Completed</span>
                            <span className="value">{user.enrollments.completed}</span>
                          </div>
                          <div className="stat">
                            <span className="label">Paused</span>
                            <span className="value">{user.enrollments.paused}</span>
                          </div>
                        </div>

                        <div className="enrollments-list">
                          {user.enrollments.enrollments?.map((enrollment) => (
                            <div key={enrollment.id} className="enrollment-card">
                              <div className="enrollment-header">
                                <h5>{enrollment.course_title}</h5>
                                <span className={`status-badge status-${enrollment.status}`}>{enrollment.status}</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                              </div>
                              <div className="enrollment-info">
                                <p>
                                  <span>Progress:</span> <strong>{enrollment.progress}%</strong>
                                </p>
                                <p>
                                  <span>Lessons:</span> <strong>{enrollment.lessons_completed}/{enrollment.total_lessons}</strong>
                                </p>
                                {enrollment.grade && (
                                  <p>
                                    <span>Grade:</span> <strong>{enrollment.grade}</strong>
                                  </p>
                                )}
                                <p className="text-muted">Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="empty-state">
                        <BookOpen size={32} />
                        <p>No course enrollments</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div className="tab-panel">
                    {user?.transactions && user.transactions.transactions?.length > 0 ? (
                      <div className="transactions-list">
                        {user.transactions.transactions?.map((tx) => (
                          <div key={tx.id} className="transaction-item">
                            <div className="tx-icon">
                              {tx.type === 'course_purchase' && '🛒'}
                              {tx.type === 'wallet_topup' && '💰'}
                              {tx.type === 'referral_bonus' && '🎁'}
                              {tx.type === 'refund' && '↩'}
                              {tx.type === 'withdrawal' && '💳'}
                            </div>
                            <div className="tx-details">
                              <p className="tx-description">{tx.description}</p>
                              <p className="text-muted">{tx.reference}</p>
                              <p className="text-muted text-small">{new Date(tx.created_at).toLocaleString()}</p>
                            </div>
                            <div className="tx-amount">
                              <p
                                className={`amount ${
                                  tx.type === 'course_purchase' || tx.type === 'withdrawal' || tx.type === 'refund' ? 'debited' : 'credited'
                                }`}
                              >
                                {tx.type === 'course_purchase' || tx.type === 'withdrawal' ? '-' : '+'}₦{tx.amount?.toLocaleString() || '0'}
                              </p>
                              <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <CreditCard size={32} />
                        <p>No transactions</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="tab-panel">
                    {user?.activity ? (
                      <div className="activity-grid">
                        <div className="activity-item">
                          <span className="label">Total Logins</span>
                          <span className="value">{user.activity.total_logins || 0}</span>
                        </div>
                        <div className="activity-item">
                          <span className="label">Last Login</span>
                          <span className="value">{user.activity.last_login ? new Date(user.activity.last_login).toLocaleString() : 'Never'}</span>
                        </div>
                        <div className="activity-item">
                          <span className="label">Courses Created</span>
                          <span className="value">{user.activity.courses_created || 0}</span>
                        </div>
                        <div className="activity-item">
                          <span className="label">Lessons Created</span>
                          <span className="value">{user.activity.lessons_created || 0}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Activity size={32} />
                        <p>No activity data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
