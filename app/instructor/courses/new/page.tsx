'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Form, FormField } from '@/components/shared/Form'

export default function CreateCoursePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle course creation
    console.log('Create course:', formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Fill in the course details to get started</p>
      </div>

      <Form onSubmit={handleSubmit} title="" subtitle="">
        <FormField label="Course Title" required>
          <Input
            name="title"
            placeholder="e.g., Introduction to React"
            value={formData.title}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            name="description"
            placeholder="Describe what students will learn..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="1">Development</option>
              <option value="2">Design</option>
              <option value="3">Business</option>
            </select>
          </FormField>

          <FormField label="Price ($)" required>
            <Input
              name="price"
              type="number"
              placeholder="99.99"
              value={formData.price}
              onChange={handleChange}
            />
          </FormField>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" className="flex-1">
            Create Course
          </Button>
          <Button type="button" variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}
