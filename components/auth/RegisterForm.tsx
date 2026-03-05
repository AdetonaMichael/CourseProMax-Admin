'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Form, FormField } from '@/components/shared/Form'
import { registerSchema, type RegisterFormData } from '@/utils/validation.utils'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    // Validate form
    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((error) => {
        const path = error.path[0] as string
        newErrors[path] = error.message
      })
      setErrors(newErrors)
      return
    }

    try {
      await register({
        ...formData,
        phone_number: formData.phone_number || ''
      })
    } catch (err: any) {
      // Error is handled by the useAuth hook and stored in the error state
      // This catch block is here just in case
      console.error('Form submission error:', err)
    }
  }

  return (
    <Form onSubmit={handleSubmit} title="Create Account" subtitle="Join CoursePro today">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.first_name} required>
          <Input
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Last Name" error={errors.last_name} required>
          <Input
            name="last_name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
          />
        </FormField>
      </div>

      <FormField label="Email" error={errors.email} required>
        <Input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone_number}>
        <Input
          name="phone_number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone_number || ''}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.password_confirmation} required>
        <Input
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          value={formData.password_confirmation}
          onChange={handleChange}
        />
      </FormField>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in here
        </Link>
      </p>
    </Form>
  )
}
