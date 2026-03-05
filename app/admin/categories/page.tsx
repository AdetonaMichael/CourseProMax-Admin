'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/shared/Button'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  handleAPIError,
  type Category,
} from '@/services/admin.service'

interface FormData {
  name: string
  color: string
  order: number | ''
  description: string
  is_active: boolean
}

interface EditingCategory {
  id: number
  data: FormData
}

const defaultFormData: FormData = {
  name: '',
  color: '#3B82F6',
  order: '',
  description: '',
  is_active: true,
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#DC2626', // Dark Red
  '#0EA5E9', // Cyan
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#22C55E', // Bright Green
  '#7C3AED', // Violet
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null)
  const [formData, setFormData] = useState<FormData>(defaultFormData)

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Auto-dismiss messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetchCategories(1, 100)
      setCategories(response.categories)
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' && value ? Number(value) : value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Category name is required')
      return false
    }
    if (!formData.color) {
      setError('Color is required')
      return false
    }
    return true
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      const categoryData = {
        name: formData.name,
        color: formData.color,
        order: formData.order ? Number(formData.order) : categories.length + 1,
        description: formData.description || undefined,
        is_active: formData.is_active,
      }

      console.log('[Categories] Creating category:', categoryData)
      await createCategory(categoryData)

      setSuccess('Category created successfully!')
      setFormData(defaultFormData)
      setShowCreateForm(false)
      await loadCategories()
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      const categoryData = {
        name: formData.name,
        color: formData.color,
        order: formData.order ? Number(formData.order) : editingCategory.id,
        description: formData.description || undefined,
        is_active: formData.is_active,
      }

      console.log('[Categories] Updating category:', editingCategory.id, categoryData)
      await updateCategory(editingCategory.id, categoryData)

      setSuccess('Category updated successfully!')
      setFormData(defaultFormData)
      setEditingCategory(null)
      await loadCategories()
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory({
      id: category.id,
      data: {
        name: category.name,
        color: category.color,
        order: category.order,
        description: category.description || '',
        is_active: category.is_active,
      },
    })
    setFormData({
      name: category.name,
      color: category.color,
      order: category.order,
      description: category.description || '',
      is_active: category.is_active,
    })
    setShowCreateForm(false)
  }

  const handleDelete = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      console.log('[Categories] Deleting category:', categoryId)
      await deleteCategory(categoryId)

      setSuccess('Category deleted successfully!')
      await loadCategories()
    } catch (err) {
      const apiError = handleAPIError(err)
      setError(apiError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingCategory(null)
    setFormData(defaultFormData)
    setError(null)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-gray-600 mt-2">Manage course categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-gray-600 mt-2">Manage course categories ({categories.length})</p>
          </div>
          {!showCreateForm && !editingCategory && (
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              + Create Category
            </Button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Create New Category</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Web Development"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleFormChange}
                    placeholder="Display order"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 transition ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Category description..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active_create"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleFormChange}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
                <label htmlFor="is_active_create" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Category'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Form */}
        {editingCategory && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleFormChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 transition ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active_edit"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleFormChange}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
                <label htmlFor="is_active_edit" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Category'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No categories found. Create your first category!</p>
            {!showCreateForm && !editingCategory && (
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Create Category
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white text-lg font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                      disabled={saving}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category.id)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Order: {category.order}</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
