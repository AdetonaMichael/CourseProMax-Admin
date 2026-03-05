'use client'

import { FormHTMLAttributes, ReactNode } from 'react'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  title?: string
  subtitle?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Form({
  title,
  subtitle,
  children,
  onSubmit,
  ...props
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow" {...props}>
      {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {children}
    </form>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}
