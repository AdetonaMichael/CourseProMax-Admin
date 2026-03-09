'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/utils/validation.utils'
import Link from 'next/link'
import { AlertCircle, AlertTriangle, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated, user, fieldErrors, statusCode } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '', channel: 'web' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string>('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.roles?.[0] || 'user'
      switch (role) {
        case 'admin':      router.replace('/admin');      break
        case 'instructor': router.replace('/instructor'); break
        default:           router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
    if (formError) setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setFormError('')

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach(err => { newErrors[err.path[0] as string] = err.message })
      setErrors(newErrors)
      return
    }

    try {
      await login(formData.email, formData.password, 'web')
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login. Please try again.'
      setFormError(errorMessage)
      if (statusCode === 422 && fieldErrors && Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
      }
    }
  }

  const is422 = statusCode === 422
  const is500 = statusCode === 500

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-2xl font-black text-black tracking-tight leading-none mb-1"
        >
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 font-light">Sign in to your CourseProMax account</p>
      </div>

      {/* Error Banner */}
      {formError && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg mb-6 border ${
          is422
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {is422
            ? <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            : <AlertCircle   size={16} className="text-red-500 shrink-0 mt-0.5" />
          }
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">
              {is422 ? 'Validation Error' : is500 ? 'Server Error' : 'Login Failed'}
            </p>
            <p className="text-sm font-light leading-relaxed">{formError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700 tracking-wide">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Password <span className="text-red-400">*</span>
            </label>
            <a href="/forgot-password" className="text-xs text-gray-400 hover:text-black transition-colors no-underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors text-xs"
              tabIndex={-1}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-black px-6 py-3 rounded-lg hover:opacity-80 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-1"
        >
          {isLoading
            ? <><Loader2 size={15} className="animate-spin" /> Signing in...</>
            : 'Sign In'
          }
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-gray-500 font-light">
        Don't have an account?{' '}
        <Link href="/register" className="text-black font-medium hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  )
}