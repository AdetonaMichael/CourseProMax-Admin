'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/utils/validation.utils'
import Link from 'next/link'
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

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
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [showPass, setShowPass]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach(err => { newErrors[err.path[0] as string] = err.message })
      setErrors(newErrors)
      return
    }

    try {
      await register({ ...formData, phone_number: formData.phone_number || '' })
    } catch (err: any) {
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-7">
        <h1
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-2xl font-black text-black tracking-tight leading-none mb-1"
        >
          Create account
        </h1>
        <p className="text-sm text-gray-500 font-light">
          Join CourseProMax and start learning today
        </p>
      </div>

      {/* Global error */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-5 border bg-red-50 border-red-200 text-red-800">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Registration Failed</p>
            <p className="text-sm font-light leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* First + Last name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              name="first_name"
              type="text"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              className={`input-field ${errors.first_name ? 'input-error' : ''}`}
            />
            {errors.first_name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.first_name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 tracking-wide">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              name="last_name"
              type="text"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              className={`input-field ${errors.last_name ? 'input-error' : ''}`}
            />
            {errors.last_name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.last_name}
              </p>
            )}
          </div>
        </div>

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

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700 tracking-wide">
            Phone Number
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            name="phone_number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone_number || ''}
            onChange={handleChange}
            autoComplete="tel"
            className={`input-field ${errors.phone_number ? 'input-error' : ''}`}
          />
          {errors.phone_number && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.phone_number}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700 tracking-wide">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.password}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700 tracking-wide">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              name="password_confirmation"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
              className={`input-field pr-10 ${errors.password_confirmation ? 'input-error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.password_confirmation}
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
            ? <><Loader2 size={15} className="animate-spin" /> Creating account...</>
            : 'Create Account'
          }
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500 font-light">
        Already have an account?{' '}
        <Link href="/login" className="text-black font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}