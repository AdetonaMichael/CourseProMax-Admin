'use client'

import { apiClient } from './api-client';

// ==================== USER MANAGEMENT ====================

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchUsers(page = 1, filters: Record<string, any> = {}): Promise<UsersResponse> {
  try {
    const api = apiClient;
    console.log('[Admin API] Fetching users:', { page, filters })
    
    const response = await api.get('/admin/users', {
      params: {
        page,
        per_page: filters.per_page || 15,
        search: filters.search,
        role: filters.role,
        status: filters.status,
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      },
    });
    console.log('[Admin API] Users fetched successfully:', response.data)
    return response.data.data
  } catch (error: any) {
    console.error('[Admin API] Error fetching users:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.response?.config?.url,
      data: error.response?.data,
    })
    throw handleAPIError(error)
  }
}

export async function fetchUser(userId: number): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  roles?: string[];
}): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/users', userData);
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function updateUser(
  userId: number,
  userData: Partial<User>
): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function deleteUser(userId: number): Promise<void> {
  try {
    const api = apiClient;
    await api.delete(`/admin/users/${userId}`);
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function assignRoleToUser(userId: number, roles: string[]): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.post(`/admin/users/${userId}/assign-role`, { roles });
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function revokeRoleFromUser(userId: number, roles: string[]): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.delete(`/admin/users/${userId}/revoke-role`, {
      data: { roles },
    });
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function changeUserStatus(
  userId: number,
  status: 'active' | 'inactive' | 'blocked'
): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function blockUser(
  userId: number,
  reason?: string,
  blockedUntil?: string
): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.post(`/admin/users/${userId}/block`, {
      reason: reason || 'No reason provided',
      blocked_until: blockedUntil || null,
    });
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function unblockUser(userId: number): Promise<User> {
  try {
    const api = apiClient;
    const response = await api.post(`/admin/users/${userId}/unblock`);
    return response.data.data.user;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export interface UserFullProfile {
  user: User & {
    wallet?: any;
    transactions?: any;
    enrollments?: any;
    activity?: any;
  };
}

export async function getUserFullProfile(
  userId: number,
  include: string[] = ['wallet', 'transactions', 'enrollments']
): Promise<UserFullProfile> {
  try {
    const api = apiClient;
    const includeParam = include.join(',');
    const response = await api.get(`/admin/users/${userId}/full-profile`, {
      params: { include: includeParam },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function getUserWallet(userId: number): Promise<any> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/users/${userId}/wallet`);
    return response.data.data.wallet;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export interface TransactionsResponse {
  transactions: any[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function getUserTransactions(
  userId: number,
  page = 1,
  filters: Record<string, any> = {}
): Promise<TransactionsResponse> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/users/${userId}/transactions`, {
      params: {
        page,
        per_page: filters.per_page || 20,
        type: filters.type,
        status: filters.status,
        from_date: filters.from_date,
        to_date: filters.to_date,
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export interface CoursesEnrolledResponse {
  courses: any[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function getUserEnrolledCourses(
  userId: number,
  page = 1,
  filters: Record<string, any> = {}
): Promise<CoursesEnrolledResponse> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/users/${userId}/courses`, {
      params: {
        page,
        per_page: filters.per_page || 10,
        status: filters.status,
        sort_by: filters.sort_by || 'enrolled_at',
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== COURSE MANAGEMENT ====================

export interface Course {
  id: number;
  title: string;
  category_id: number;
  category_name?: string;
  description: string;
  instructor_name: string;
  thumbnail?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price?: number;
  is_active: boolean;
  certificate_available: boolean;
  total_lessons: number;
  total_students: number;
  rating: number;
  ai_score?: number;
  created_at: string;
  updated_at: string;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchCourses(page = 1, filters: Record<string, any> = {}): Promise<CoursesResponse> {
  try {
    const api = apiClient;
    console.log('[Admin API] Fetching courses:', { page, filters });
    const response = await api.get('/admin/courses', {
      params: {
        page,
        per_page: filters.per_page || 15,
        search: filters.search,
        category_id: filters.category_id,
        status: filters.status,
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function fetchCourse(courseId: number): Promise<Course> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/courses/${courseId}`);
    return response.data.data.course;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function createCourse(courseData: Partial<Course>): Promise<Course> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/courses', courseData);
    return response.data.data.course;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function updateCourse(courseId: number, courseData: Partial<Course>): Promise<Course> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return response.data.data.course;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function deleteCourse(courseId: number): Promise<void> {
  try {
    const api = apiClient;
    await api.delete(`/admin/courses/${courseId}`);
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function updateCoursePricing(
  courseId: number,
  data: { amount: number; currency: string; is_lifetime: boolean }
): Promise<any> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/courses/${courseId}/pricing`, data);
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function makeCourseFree(courseId: number): Promise<void> {
  try {
    const api = apiClient;
    await api.delete(`/admin/courses/${courseId}/pricing`);
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== ENROLLMENT MANAGEMENT ====================

export interface Enrollment {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_id: number;
  course_title: string;
  status: 'active' | 'paused' | 'completed' | 'withdrawn';
  progress: number;
  grade?: string;
  enrolled_at: string;
  paused_at?: string;
  completed_at?: string;
}

export interface EnrollmentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  avatar?: string;
  status?: string;
}

export interface EnrollmentCourse {
  id: number;
  title: string;
  description?: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string;
  category?: string;
  total_lessons: number;
  duration?: string;
  ai_score?: number;
  price?: number;
  price_naira?: number;
  is_free: boolean;
  is_paid: boolean;
  certificate_available: boolean;
  rating?: number;
}

export interface EnrollmentListItem {
  id: number;
  course_id: number;
  user_id: number;
  user: EnrollmentUser;
  course: EnrollmentCourse;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  next_lesson?: string;
  next_lesson_id?: number;
  status: 'active' | 'paused' | 'completed' | 'withdrawn';
  is_active: boolean;
  is_completed: boolean;
  is_paused: boolean;
  grade?: string | null;
  certificate_issued: boolean;
  enrolled_at: string;
  completed_at?: string | null;
  paused_at?: string | null;
  last_accessed: string;
  unenroll_reason?: string | null;
}

export interface EnrollmentsListResponse {
  enrollments: EnrollmentListItem[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export interface LessonProgress {
  id: number;
  lesson_id: number;
  lesson_title: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment' | 'interactive' | 'mixed' | 'resource';
  completed: boolean;
  score?: number | null;
  time_spent_minutes: number;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  assignment_title: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number | null;
  feedback?: string | null;
  submitted_at?: string | null;
  graded_at?: string | null;
  created_at: string;
}

export interface EnrollmentProgress {
  percentage: number;
  lessons_completed: number;
  total_lessons: number;
  next_lesson?: {
    id: number;
    title: string;
    type: string;
    order: number;
  };
}

export interface EnrollmentTimeline {
  enrolled_at: string;
  last_accessed_at: string;
  completed_at?: string | null;
  paused_at?: string | null;
  duration_days?: number;
}

export interface EnrollmentPayment {
  method: string;
  payment_id: number;
}

export interface EnrollmentAssignments {
  total: number;
  pending: number;
  submitted: number;
  graded: number;
  data: AssignmentSubmission[];
}

export interface EnrollmentLessonProgress {
  total_tracked: number;
  completed: number;
  in_progress: number;
  data: LessonProgress[];
}

export interface EnrollmentStatistics {
  average_score: number;
  total_time_spent_minutes: number;
  completion_rate_percentage: number;
  assignment_completion_rate: number;
}

export interface EnrollmentDetail {
  id: number;
  course_id: number;
  user_id: number;
  user: EnrollmentUser;
  course: EnrollmentCourse;
  status: 'active' | 'paused' | 'completed' | 'withdrawn';
  is_active: boolean;
  is_completed: boolean;
  is_paused: boolean;
  grade?: string | null;
  certificate_issued: boolean;
  unenroll_reason?: string | null;
  progress: EnrollmentProgress;
  timeline: EnrollmentTimeline;
  payment?: EnrollmentPayment;
  assignments: EnrollmentAssignments;
  lesson_progress: EnrollmentLessonProgress;
  statistics: EnrollmentStatistics;
}

export interface EnrollmentDetailResponse {
  enrollment: EnrollmentDetail;
}

export interface EnrollmentsResponse {
  enrollments: Enrollment[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchEnrollments(page = 1, filters: Record<string, any> = {}): Promise<EnrollmentsResponse> {
  try {
    const api = apiClient;
    console.log('[Admin API] Fetching enrollments:', { page, filters });
    const response = await api.get('/admin/enrollments', {
      params: {
        page,
        per_page: filters.per_page || 15,
        status: filters.status || 'all',
        course_id: filters.course_id,
        user_id: filters.user_id,
        search: filters.search,
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function fetchEnrollmentDetail(enrollmentId: number): Promise<EnrollmentDetailResponse> {
  try {
    const api = apiClient;
    console.log('[Admin API] Fetching enrollment detail:', { enrollmentId });
    const response = await api.get(`/admin/enrollments/${enrollmentId}`);
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function fetchEnrollmentStats(): Promise<any> {
  try {
    const api = apiClient;
    console.log('[Admin API] Fetching enrollment stats');
    const response = await api.get('/admin/enrollments/stats/overview');
    console.log('[Admin API] Stats fetched:', response.data);
    return response.data.data.stats;
  } catch (error) {
    console.error('[Admin API] Error fetching stats:', error);
    throw handleAPIError(error);
  }
}

export async function createEnrollment(
  userId: number,
  courseId: number,
  notes?: string
): Promise<Enrollment> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/enrollments', {
      user_id: userId,
      course_id: courseId,
      payment_method: 'admin_grant',
      notes: notes,
    });
    return response.data.data.enrollment;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function bulkEnrollUsers(
  courseId: number,
  userIds: number[],
  notes?: string
): Promise<any> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/enrollments/bulk/enroll', {
      course_id: courseId,
      user_ids: userIds,
      payment_method: 'admin_grant',
      notes: notes,
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function updateEnrollment(enrollmentId: number, data: Partial<Enrollment>): Promise<Enrollment> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/enrollments/${enrollmentId}`, data);
    return response.data.data.enrollment;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function deleteEnrollment(enrollmentId: number): Promise<void> {
  try {
    const api = apiClient;
    await api.delete(`/admin/enrollments/${enrollmentId}`);
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== CATEGORY MANAGEMENT ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  courses_count: number;
  created_at: string;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchCategories(page = 1, per_page = 20): Promise<CategoriesResponse> {
  try {
    const api = apiClient;
    const response = await api.get('/admin/categories', {
      params: { page, per_page },
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function fetchCategory(categoryId: number): Promise<Category> {
  try {
    const api = apiClient;
    const response = await api.get(`/admin/categories/${categoryId}`);
    return response.data.data.category;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function createCategory(categoryData: {
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}): Promise<Category> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/categories', categoryData);
    return response.data.data.category;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function updateCategory(categoryId: number, categoryData: Partial<Category>): Promise<Category> {
  try {
    const api = apiClient;
    const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
    return response.data.data.category;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function deleteCategory(categoryId: number): Promise<void> {
  try {
    const api = apiClient;
    await api.delete(`/admin/categories/${categoryId}`);
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== ROLE & PERMISSIONS ====================

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

export async function fetchRoles(): Promise<Role[]> {
  try {
    const api = apiClient;
    const response = await api.get('/role/roles');
    return response.data.data.roles;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function fetchPermissions(): Promise<Permission[]> {
  try {
    const api = apiClient;
    const response = await api.get('/role/permissions');
    return response.data.data.permissions;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function createRole(roleName: string): Promise<Role> {
  try {
    const api = apiClient;
    const response = await api.post('/role/roles', { name: roleName });
    return response.data.data.role;
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function createPermission(permissionName: string): Promise<Permission> {
  try {
    const api = apiClient;
    const response = await api.post('/role/permissions', { name: permissionName });
    return response.data.data.permission;
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== CATEGORY MANAGEMENT ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== NOTIFICATIONS ====================

export async function sendNotification(
  userId: number,
  title: string,
  message: string,
  type = 'info'
): Promise<void> {
  try {
    const api = apiClient;
    await api.post('/admin/notifications/send-to-user', {
      user_id: userId,
      title,
      message,
      type,
    });
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function sendBulkNotification(
  userIds: number[],
  title: string,
  message: string,
  type = 'info'
): Promise<any> {
  try {
    const api = apiClient;
    const response = await api.post('/admin/notifications/send-to-users', {
      user_ids: userIds,
      title,
      message,
      type,
    });
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
}

// ==================== ERROR HANDLING ====================

export function handleAPIError(error: any) {
  console.error('[Admin API Error Details]', {
    statusCode: error.response?.status,
    statusText: error.response?.statusText,
    message: error.message,
    responseData: error.response?.data,
    requestConfig: {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    },
  });

  const response = error.response?.data;

  if (!error.response) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to server. Please check your connection.',
      type: 'error',
    };
  }

  switch (error.response.status) {
    case 401:
      return {
        title: 'Unauthorized',
        message: 'Your session has expired. Please log in again.',
        type: 'error',
      };

    case 403:
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
        type: 'error',
      };

    case 422:
      return {
        title: 'Validation Error',
        message: 'Please check the form and try again.',
        errors: response?.errors,
        type: 'validation',
      };

    case 404:
      return {
        title: 'Not Found',
        message: response?.message || 'The requested resource was not found.',
        type: 'error',
      };

    case 500:
      return {
        title: 'Server Error',
        message: 'An error occurred on the server. Please try again later.',
        type: 'error',
      };

    default:
      return {
        title: 'Error',
        message: response?.message || error.message || 'An unknown error occurred',
        type: 'error',
      };
  }
}
