'use client'

import React, { useState } from 'react'
import { X, Mail, User, Phone, Lock } from 'lucide-react'
import { createUser, handleAPIError } from '@/services/admin.service'
import './AddUserModal.css'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

export default function AddUserModal({ isOpen, onClose, onUserCreated }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    roles: ['student'],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          roles: [...prev.roles, value],
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          roles: prev.roles.filter((r) => r !== value),
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        roles: formData.roles,
      }

      // Call the createUser API
      await createUser(payload)
      setSuccess(true)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        roles: ['student'],
      })

      setTimeout(() => {
        onUserCreated()
        onClose()
      }, 1500)
    } catch (err: any) {
      const apiError = handleAPIError(err)
      setError(apiError.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-user-modal-overlay">
      <div className="add-user-modal-content">
        <div className="modal-header">
          <h2>Create New User</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">User created successfully! Closing...</div>}

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password_confirmation">Confirm Password *</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirm password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>User Roles</label>
            <div className="roles-checkboxes">
              {['student', 'instructor', 'admin', 'moderator'].map((role) => (
                <label key={role} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="roles"
                    value={role}
                    checked={formData.roles.includes(role)}
                    onChange={handleChange}
                  />
                  <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
