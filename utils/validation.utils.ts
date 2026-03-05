import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  channel: z.string().optional().nullable(),
})

export const registerSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(10, 'Phone number must be at least 10 characters').optional().nullable(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

export const courseSchema = z.object({
  title: z.string().min(5, 'Course title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category_id: z.number().positive('Category is required'),
  price: z.number().min(0, 'Price must be non-negative'),
})

export const lessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  type: z.enum(['video', 'reading', 'quiz', 'assignment', 'interactive', 'mixed', 'resource']),
  estimated_duration_minutes: z.number().positive().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CourseFormData = z.infer<typeof courseSchema>
export type LessonFormData = z.infer<typeof lessonSchema>
