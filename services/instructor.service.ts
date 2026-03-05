import { getSession } from 'next-auth/react';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1';

let instructorAPI: AxiosInstance | null = null;

// Initialize API client with token
async function initializeInstructorAPI() {
  if (instructorAPI) return instructorAPI;

  const session = await getSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error('No authentication token found');
  }

  instructorAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  instructorAPI.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instructorAPI;
}

// ==================== INSTRUCTOR COURSES ====================

export interface InstructorCourse {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  level: string;
  is_active: boolean;
  total_lessons: number;
  total_students: number;
  rating: number;
  category_name?: string;
  price?: number;
  created_at: string;
}

export interface InstructorCoursesResponse {
  courses: InstructorCourse[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchInstructorCourses(page = 1): Promise<InstructorCoursesResponse> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching courses:', { page });
    const response = await api.get('/instructor/courses', {
      params: {
        page,
        per_page: 10,
      },
    });
    console.log('[Instructor API] Courses fetched:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('[Instructor API] Error fetching courses:', error);
    throw handleInstructorAPIError(error);
  }
}

export async function fetchInstructorCourseDetails(courseId: number): Promise<InstructorCourse> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}`);
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== INSTRUCTOR ENROLLMENTS ====================

export interface InstructorEnrollment {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_id: number;
  course_title: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  enrolled_at: string;
}

export interface InstructorEnrollmentsResponse {
  enrollments: InstructorEnrollment[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export async function fetchInstructorEnrollments(page = 1, courseId?: number): Promise<InstructorEnrollmentsResponse> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching enrollments:', { page, courseId });
    const response = await api.get('/instructor/enrollments', {
      params: {
        page,
        per_page: 10,
        course_id: courseId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== INSTRUCTOR STATISTICS ====================

export interface InstructorStats {
  total_courses: number;
  active_courses: number;
  total_students: number;
  total_enrollments: number;
  average_rating: number;
  total_earnings?: number;
}

export async function fetchInstructorStats(): Promise<InstructorStats> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching stats');
    const [coursesRes, enrollmentsRes] = await Promise.all([
      api.get('/instructor/courses?per_page=100'),
      api.get('/instructor/enrollments?per_page=100'),
    ]);

    const courses = coursesRes.data.data.courses || [];
    const enrollments = enrollmentsRes.data.data.enrollments || [];

    return {
      total_courses: courses.length,
      active_courses: courses.filter((c: any) => c.is_active).length,
      total_students: new Set(enrollments.map((e: any) => e.user_id)).size,
      total_enrollments: enrollments.length,
      average_rating: courses.length > 0 
        ? courses.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / courses.length
        : 0,
      total_earnings: 0,
    };
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== ERROR HANDLING ====================

export function handleInstructorAPIError(error: any) {
  console.error('[Instructor API Error Details]', {
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
