'use client'

import React from 'react'
import { Search, RotateCcw } from 'lucide-react'
import './CourseFiltersBar.css'

interface CourseFiltersBarProps {
  search: string
  onSearchChange: (value: string) => void
  level: string
  onLevelChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  onSearch: (e: React.FormEvent) => void
  onReset: () => void
  loading?: boolean
}

export default function CourseFiltersBar({
  search,
  onSearchChange,
  level,
  onLevelChange,
  category,
  onCategoryChange,
  onSearch,
  onReset,
  loading = false,
}: CourseFiltersBarProps) {
  return (
    <div className="courses-filters">
      <form onSubmit={onSearch} className="filters-form">
        <div className="filter-group search-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses by title, instructor..."
            className="filter-input"
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Level</label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-apply"
          disabled={loading}
        >
          Apply
        </button>

        <button
          type="button"
          onClick={onReset}
          className="btn-reset"
          disabled={loading}
          title="Reset filters"
        >
          <RotateCcw size={16} />
        </button>
      </form>
    </div>
  )
}
