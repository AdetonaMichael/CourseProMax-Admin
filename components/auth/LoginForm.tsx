'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Form, FormField } from '@/components/shared/Form'
import { loginSchema, type LoginFormData } from '@/utils/validation.utils'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    channel: 'web',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string>('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.roles?.[0] || 'user'
      switch (role) {
        case 'admin':
          router.replace('/admin')
          break
        case 'instructor':
          router.replace('/instructor')
          break
        default:
          router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    setFormError('')

    // Validate form
    const result = loginSchema.safeParse(formData)
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
      await login(formData.email, formData.password, 'web')
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during login.')
      console.error('Form submission error:', err)
    }
  }

  return (
    <Form onSubmit={handleSubmit} title="Sign In" subtitle="Welcome back to CoursePro">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      <FormField label="Email" error={errors.email} required>
        <Input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
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

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up here
        </Link>
      </p>
    </Form>
  )
}
