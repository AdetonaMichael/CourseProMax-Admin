import { UserRole } from './user.types'

export interface Permission {
  id: number
  name: string
  description?: string
  guard_name: string
}

export interface Role {
  id: number
  name: UserRole
  description?: string
  permissions: Permission[]
}

export interface RoleResponse {
  role: Role
  permissions: Permission[]
}

export const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  admin: new Set([
    'manage.users',
    'manage.courses',
    'manage.categories',
    'manage.instructors',
    'view.analytics',
    'manage.settings',
    'manage.permissions',
  ]),
  instructor: new Set([
    'create.courses',
    'edit.own.courses',
    'delete.own.courses',
    'manage.lessons',
    'upload.videos',
    'view.enrollments',
    'view.analytics',
  ]),
  student: new Set([
    'enroll.courses',
    'view.enrolled.courses',
    'complete.lessons',
    'view.certificates',
  ]),
  user: new Set([
    'view.profile',
    'edit.profile',
  ]),
}

export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/courses',
  '/admin/categories',
  '/admin/settings',
  '/admin/analytics',
]

export const INSTRUCTOR_ROUTES = [
  '/instructor',
  '/instructor/courses',
  '/instructor/profile',
]

export const STUDENT_ROUTES = [
  '/dashboard',
  '/dashboard/courses',
  '/dashboard/certificates',
]
