'use client'

import React, { useState, useEffect } from 'react'
import { getUserFullProfile, handleAPIError } from '@/services/admin.service'
import './UserDetailsModal.css'

interface UserDetailsModalProps {
  user: any
  onClose: () => void
  onUserUpdated: () => void
}

export default function UserDetailsModal({ user, onClose, onUserUpdated }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [userDetails, setUserDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserDetails()
  }, [user.id])

  async function loadUserDetails() {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserFullProfile(user.id, ['wallet', 'transactions', 'enrollments', 'activity'])
      setUserDetails(data.user)
    } catch (err: any) {
      const apiError = handleAPIError(err)
      setError(apiError.message || 'Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading-spinner">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error-message">Failed to load user details</div>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-info">
            <img src={userDetails.avatar || 'https://via.placeholder.com/50'} alt={userDetails.first_name} className="user-avatar-small" />
            <div>
              <h2>{userDetails.first_name} {userDetails.last_name}</h2>
              <p className="email">{userDetails.email}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
          <button className={`tab ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
            Wallet {userDetails.wallet && `(₦${userDetails.wallet.balance?.toLocaleString()})`}
          </button>
          <button className={`tab ${activeTab === 'enrollments' ? 'active' : ''}`} onClick={() => setActiveTab('enrollments')}>
            Courses {userDetails.enrollments && `(${userDetails.enrollments.total})`}
          </button>
          <button className={`tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
            Transactions
          </button>
          <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {error && <div className="error-message">⚠ {error}</div>}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content profile-tab">
              <div className="info-grid">
                <div className="info-item">
                  <label>ID</label>
                  <span>{userDetails.id}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{userDetails.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <span>{userDetails.phone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span className={`status-badge status-${userDetails.status}`}>{userDetails.status}</span>
                </div>
                <div className="info-item">
                  <label>Roles</label>
                  <div className="role-badges">
                    {userDetails.roles && userDetails.roles.length > 0 ? (
                      userDetails.roles.map((role: string) => (
                        <span key={role} className="role-badge">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <label>Created At</label>
                  <span>{new Date(userDetails.created_at).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <label>Updated At</label>
                  <span>{new Date(userDetails.updated_at).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <label>Last Login</label>
                  <span>{userDetails.last_login ? new Date(userDetails.last_login).toLocaleString() : 'Never'}</span>
                </div>
              </div>

              {userDetails.blocked_at && (
                <div className="warning-box">
                  <p>
                    <strong>⚠ User is blocked</strong>
                  </p>
                  <p>Blocked since: {new Date(userDetails.blocked_at).toLocaleString()}</p>
                  {userDetails.block_reason && <p>Reason: {userDetails.block_reason}</p>}
                </div>
              )}
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="tab-content wallet-tab">
              {userDetails.wallet ? (
                <>
                  <div className="wallet-cards">
                    <div className="wallet-card">
                      <h4>Current Balance</h4>
                      <p className="amount">₦{userDetails.wallet.balance?.toLocaleString()}</p>
                    </div>
                    <div className="wallet-card">
                      <h4>Total Credited</h4>
                      <p className="amount credited">+₦{userDetails.wallet.total_credited?.toLocaleString()}</p>
                    </div>
                    <div className="wallet-card">
                      <h4>Total Debited</h4>
                      <p className="amount debited">-₦{userDetails.wallet.total_debited?.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-muted">Last updated: {new Date(userDetails.wallet.updated_at).toLocaleString()}</p>
                </>
              ) : (
                <p className="text-muted">No wallet information available</p>
              )}
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === 'enrollments' && (
            <div className="tab-content enrollments-tab">
              {userDetails.enrollments && userDetails.enrollments.total > 0 ? (
                <>
                  <div className="stats-row">
                    <div className="stat">
                      <span className="label">Total</span>
                      <span className="value">{userDetails.enrollments.total}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Active</span>
                      <span className="value">{userDetails.enrollments.active}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Completed</span>
                      <span className="value">{userDetails.enrollments.completed}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Paused</span>
                      <span className="value">{userDetails.enrollments.paused}</span>
                    </div>
                  </div>

                  <div className="enrollments-list">
                    {userDetails.enrollments.enrollments?.map((enrollment: any) => (
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
                          <p>
                            <span>Grade:</span> <strong>{enrollment.grade || 'N/A'}</strong>
                          </p>
                          <p className="text-muted">Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted">No course enrollments</p>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="tab-content transactions-tab">
              {userDetails.transactions && userDetails.transactions.transactions?.length > 0 ? (
                <div className="transactions-list">
                  {userDetails.transactions.transactions?.map((tx: any) => (
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
                          {tx.type === 'course_purchase' || tx.type === 'withdrawal' ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                        </p>
                        <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No transactions</p>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="tab-content activity-tab">
              {userDetails.activity ? (
                <div className="activity-grid">
                  <div className="activity-item">
                    <span className="label">Total Logins</span>
                    <span className="value">{userDetails.activity.total_logins}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Last Login</span>
                    <span className="value">{userDetails.activity.last_login ? new Date(userDetails.activity.last_login).toLocaleString() : 'Never'}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Courses Created</span>
                    <span className="value">{userDetails.activity.courses_created}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Lessons Created</span>
                    <span className="value">{userDetails.activity.lessons_created}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Assignments Submitted</span>
                    <span className="value">{userDetails.activity.assignments_submitted}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Reviews Given</span>
                    <span className="value">{userDetails.activity.reviews_given}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">No activity data available</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={loadUserDetails} className="btn btn-primary">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
