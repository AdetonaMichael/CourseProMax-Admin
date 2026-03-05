'use client'

import React, { useState } from 'react'
import { RotateCcw, RefreshCw } from 'lucide-react'
import './UserFiltersBar.css'

interface Filters {
  search: string
  role: string
  status: string
  sort_by: string
  sort_order: 'asc' | 'desc'
  per_page: number
}

interface UserFiltersBarProps {
  filters: Filters
  onFiltersChange: (filters: Partial<Filters>) => void
  onRefresh: () => void
  loading: boolean
}

export default function UserFiltersBar({ filters, onFiltersChange, onRefresh, loading }: UserFiltersBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    const timer = setTimeout(() => {
      onFiltersChange({ search: value })
    }, 300)
    return () => clearTimeout(timer)
  }

  const handleResetFilters = () => {
    setSearchInput('')
    onFiltersChange({
      search: '',
      role: '',
      status: 'all',
      sort_by: 'created_at',
      sort_order: 'desc',
    })
  }

  return (
    <div className="user-filters-bar">
      <div className="filters-container">
        {/* Search Input */}
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by email, name, phone..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Role Filter */}
        <div className="filter-group">
          <select
            value={filters.role}
            onChange={(e) => onFiltersChange({ role: e.target.value })}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <select value={filters.status} onChange={(e) => onFiltersChange({ status: e.target.value })} className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Per Page */}
        <div className="filter-group">
          <select value={filters.per_page} onChange={(e) => onFiltersChange({ per_page: Number(e.target.value) })} className="filter-select">
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={handleResetFilters} className="btn btn-secondary" disabled={loading} title="Reset filters">
          <RotateCcw size={16} />
          Reset
        </button>
        <button onClick={onRefresh} className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading} title="Refresh data">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}
