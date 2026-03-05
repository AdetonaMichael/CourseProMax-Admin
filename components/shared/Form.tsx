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
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg" {...props}>
      <div className="flex flex-col items-center justify-center mb-8">
        <img src="/icon.png" alt="CoursePro" className="w-16 h-16 rounded-lg mb-4 shadow-md" />
        {title && <h2 className="text-3xl font-bold text-gray-900 text-center">{title}</h2>}
        {subtitle && <p className="text-gray-600 text-center mt-2">{subtitle}</p>}
      </div>
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
