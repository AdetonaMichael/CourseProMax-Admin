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
  const { login, isLoading, isAuthenticated, user, fieldErrors, statusCode } = useAuth()
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
    // Clear form error when user starts typing
    if (formError) {
      setFormError('')
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
      console.log('[LoginForm] Submitting login...')
      console.log('[LoginForm] Form data:', { email: formData.email, channel: formData.channel })
      await login(formData.email, formData.password, 'web')
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login. Please try again.'
      console.error('[LoginForm] Login failed:', errorMessage, 'Status:', statusCode, 'Field errors:', fieldErrors, err)
      
      setFormError(errorMessage)
      
      // Handle validation errors (422) - show field-specific errors
      if (statusCode === 422 && fieldErrors && Object.keys(fieldErrors).length > 0) {
        console.log('[LoginForm] Setting field errors:', fieldErrors)
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit} title="Sign In" subtitle="Welcome back to CoursePro">
      {formError && (
        <div className={`px-4 py-3 rounded mb-4 border-2 ring-2 ${
          statusCode === 401 
            ? 'bg-red-50 border-red-300 text-red-700 ring-red-200'
            : statusCode === 422
            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 ring-yellow-200'
            : statusCode === 500
            ? 'bg-red-50 border-red-300 text-red-700 ring-red-200'
            : 'bg-red-50 border-red-300 text-red-700 ring-red-200'
        }`}>
          <p className={`font-semibold ${
            statusCode === 401
              ? 'text-red-800'
              : statusCode === 422
              ? 'text-yellow-800'
              : statusCode === 500
              ? 'text-red-800'
              : 'text-red-800'
          }`}>
            {statusCode === 422 ? 'Validation Error' : statusCode === 500 ? 'Server Error' : 'Login Error'}
          </p>
          <p className="text-sm mt-1">{formError}</p>
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
