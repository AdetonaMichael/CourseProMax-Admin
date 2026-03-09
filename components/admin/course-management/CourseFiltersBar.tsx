'use client'

import React, { useState, useEffect } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { fetchAllCategories, Category } from '@/services/course.service'
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
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      const data = await fetchAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    onSearchChange(value)
  }

  return (
    <div className="courses-filters">
      <form onSubmit={onSearch} className="filters-form">
        <div className="filter-group search-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
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
            disabled={loading || categoriesLoading}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={loading}
        >
          Apply
        </Button>

        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          title="Reset filters"
          className="text-gray-600 hover:text-gray-900 p-2"
        >
          <RotateCcw size={16} />
        </button>
      </form>
    </div>
  )
}
