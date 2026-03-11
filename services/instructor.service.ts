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

// ==================== STUDENT MANAGEMENT (Per Course) ====================

export interface InstructorEnrollmentsResponse {
  enrollments: CourseStudent[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CourseStudent {
  enrollment_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  status: 'active' | 'paused' | 'completed' | 'withdrawn';
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  quiz_average_score: number;
  assignments_submitted: number;
  assignments_graded: number;
  last_activity_at: string;
  enrolled_date: string;
  certificate_issued: boolean;
}

export interface CourseStudentsResponse {
  students: CourseStudent[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Fetch students for a specific course (replaces broken /instructor/enrollments endpoint)
export async function fetchCourseStudents(
  courseId: number,
  page = 1,
  filters?: {
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }
): Promise<CourseStudentsResponse> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching students for course:', { courseId, page });
    const response = await api.get(`/instructor/courses/${courseId}/students`, {
      params: {
        page,
        per_page: 20,
        status: filters?.status,
        search: filters?.search,
        sort_by: filters?.sortBy,
        sort_order: filters?.sortOrder,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('[Instructor API] Error fetching course students:', error);
    throw handleInstructorAPIError(error);
  }
}

// Deprecated: Get all students across all courses (kept for backward compatibility)
// Note: This fetches from multiple endpoints - prefer using fetchCourseStudents per course
export async function fetchInstructorEnrollments(page = 1): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching all students across courses (deprecated)');
    
    // First get all courses
    const coursesRes = await api.get('/instructor/courses', {
      params: { per_page: 100 }
    });
    
    const courses = coursesRes.data.data.courses || [];
    const allStudents = [];
    
    // Then get students for each course
    for (const course of courses) {
      try {
        const studentsRes = await api.get(`/instructor/courses/${course.id}/students`, {
          params: { per_page: 100 }
        });
        const students = studentsRes.data.data.students || [];
        allStudents.push(...students.map((s: any) => ({
          ...s,
          course_id: course.id,
          course_title: course.title
        })));
      } catch (err) {
        console.error(`Failed to fetch students for course ${course.id}:`, err);
      }
    }
    
    // Return pagination-like structure for backward compatibility
    return {
      enrollments: allStudents,
      pagination: {
        current_page: page,
        per_page: allStudents.length,
        total: allStudents.length,
        last_page: 1
      }
    };
  } catch (error) {
    console.error('[Instructor API] Error fetching enrollments:', error);
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
    const response = await api.get('/instructor/dashboard');

    const data = response.data.data;
    return {
      total_courses: data.statistics?.total_courses || 0,
      active_courses: data.statistics?.published_courses || 0,
      total_students: data.statistics?.active_students || 0,
      total_enrollments: data.statistics?.active_students || 0,
      average_rating: data.instructor?.average_course_rating || 0,
      total_earnings: data.instructor?.totalRevenue || 0,
    };
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== DASHBOARD OVERVIEW ====================

export interface DashboardOverview {
  instructor: {
    id: number;
    name: string;
    avatar_url?: string;
    total_courses: number;
    total_students: number;
    this_month_revenue: number;
    totalRevenue: number;
    average_course_rating: number;
    member_since: string;
  };
  statistics: {
    total_courses: number;
    published_courses: number;
    draft_courses: number;
    total_students: number;
    active_students: number;
    completed_students: number;
    total_enrollments: number;
    total_revenue: number;
    this_month_revenue: number;
    average_course_rating: number;
    course_completion_rate: number;
  };
  recent_activities: Array<{
    id: number;
    type: string;
    message: string;
    course_id?: number;
    course_title?: string;
    timestamp: string;
  }>;
  top_performing_courses: Array<{
    id: number;
    title: string;
    student_count: number;
    average_rating: number;
    enrollment_trend: string;
  }>;
  upcoming_deadlines: Array<{
    id: number;
    assignment_title: string;
    course_id: number;
    course_title: string;
    due_date: string;
    pending_submissions: number;
  }>;
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  try {
    const api = await initializeInstructorAPI();
    console.log('[Instructor API] Fetching dashboard overview');
    const response = await api.get('/instructor/dashboard');
    return response.data.data;
  } catch (error) {
    console.error('[Instructor API] Error fetching dashboard:', error);
    throw handleInstructorAPIError(error);
  }
}

// ==================== COURSE ANALYTICS ====================

export interface CourseAnalytics {
  course_id: number;
  course_title: string;
  total_students: number;
  active_students: number;
  completed_students: number;
  average_progress: number;
  average_quiz_score?: number;
  total_revenue: number;
  rating_average: number;
  rating_count: number;
  last_enrolled_at?: string;
  completion_rate: number;
}

export async function fetchCourseAnalytics(courseId: number, dateFrom?: string, dateTo?: string): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/analytics`, {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
      },
      timeout: 8000,
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.warn('[fetchCourseAnalytics] Failed to fetch course analytics:', error?.message);
    // Return default/empty data structure instead of throwing
    return {
      views: 0,
      enrollments: 0,
      completion_rate: 0,
      average_rating: 0,
      certificates_issued: 0,
    };
  }
}

// ==================== REVENUE ANALYTICS ====================

export interface RevenueAnalytics {
  total_revenue: number;
  this_month_revenue: number;
  last_month_revenue: number;
  revenue_trend: string;
  revenue_by_course: Array<{
    course_id: number;
    course_title: string;
    revenue: number;
    percentage: number;
  }>;
  revenue_by_period: Array<{
    period: string;
    revenue: number;
    enrollments: number;
  }>;
}

export async function fetchRevenueAnalytics(dateFrom?: string, dateTo?: string, groupBy?: string): Promise<RevenueAnalytics> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/analytics/revenue', {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
        group_by: groupBy || 'month',
      },
      timeout: 8000,
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.warn('[fetchRevenueAnalytics] Failed to fetch revenue analytics:', error?.message);
    // Return default/empty data structure instead of throwing
    return {
      total_revenue: 0,
      this_month_revenue: 0,
      last_month_revenue: 0,
      revenue_trend: 'stable',
      revenue_by_course: [],
      revenue_by_period: [],
    };
  }
}

// ==================== ENGAGEMENT ANALYTICS ====================

export interface EngagementAnalytics {
  overall_engagement: {
    total_active_students: number;
    average_login_frequency_per_week: number;
    average_time_on_platform_minutes: number;
    course_completion_rate: number;
    content_consumption_rate: number;
  };
  engagement_by_course: Array<{
    course_id: number;
    course_title: string;
    active_students: number;
    average_session_duration: number;
    completion_rate: number;
  }>;
  activity_by_day: Array<{
    date: string;
    active_users: number;
    page_views: number;
    enrollments: number;
  }>;
}

export async function fetchEngagementAnalytics(dateFrom?: string, dateTo?: string, courseId?: number): Promise<EngagementAnalytics> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/analytics/engagement', {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
        course_id: courseId,
      },
      timeout: 8000,
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.warn('[fetchEngagementAnalytics] Failed to fetch engagement analytics:', error?.message);
    // Return default/empty data structure instead of throwing
    return {
      overall_engagement: {
        total_active_students: 0,
        average_login_frequency_per_week: 0,
        average_time_on_platform_minutes: 0,
        course_completion_rate: 0,
        content_consumption_rate: 0,
      },
      engagement_by_course: [],
      activity_by_day: [],
    };
  }
}

// ==================== STUDENT PROGRESS ====================

export interface StudentProgress {
  student: {
    user_id: number;
    user_name: string;
    user_email: string;
  };
  enrollment: {
    enrollment_id: number;
    status: string;
    progress_percentage: number;
    lessons_completed: number;
    total_lessons: number;
  };
  lesson_progress: Array<{
    lesson_id: number;
    lesson_title: string;
    is_completed: boolean;
    completed_at?: string;
    time_spent_minutes: number;
    quiz_score?: number;
    assignment_submitted: boolean;
    assignment_score?: number;
  }>;
  overall_stats: {
    average_quiz_score: number;
    assignments_submitted: number;
    assignments_graded: number;
    total_time_spent_hours: number;
  };
}

export async function fetchStudentProgress(courseId: number, enrollmentId: number): Promise<StudentProgress> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/students/${enrollmentId}/progress`);
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== PROFILE & SETTINGS ====================

export interface InstructorProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  payout_info?: {
    bank_name: string;
    account_number: string;
    account_holder: string;
  };
}

export async function fetchInstructorProfile(): Promise<InstructorProfile> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/profile');
    return response.data.data.instructor;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== ERROR HANDLING ====================

export function handleInstructorAPIError(error: any) {
  try {
    console.error('[Instructor API Error Details]', {
      statusCode: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message,
      responseData: error?.response?.data,
      requestConfig: {
        url: error?.config?.url,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL,
      },
    });
  } catch (logError) {
    console.warn('[Instructor API Error] Failed to log error details:', logError);
  }

  const response = error?.response?.data;

  if (!error?.response) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to server. Please check your connection.',
      type: 'error',
    };
  }

  const statusCode = error?.response?.status;

  switch (statusCode) {
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
        message: response?.message || error?.message || 'An unknown error occurred',
        type: 'error',
      };
  }
}

// ==================== LESSON ENDPOINTS ====================

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  content?: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'interactive' | 'mixed' | 'resource';
  order: number;
  is_active: boolean;
  is_preview: boolean;
  estimated_duration_minutes?: number;
  video_url?: string;
  video_duration?: number;
  bunny_video_id?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completion_score_required?: number;
  created_at: string;
  updated_at: string;
}

export interface CourseLessonsResponse {
  lessons: Lesson[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export async function fetchCourseLessons(
  courseId: number,
  page = 1,
  type?: string,
  isActive?: boolean,
  sortBy?: string
): Promise<CourseLessonsResponse> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/lessons`, {
      params: {
        page,
        per_page: 50,
        type,
        is_active: isActive,
        sort_by: sortBy,
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function fetchLessonDetails(courseId: number, lessonId: number): Promise<Lesson> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/lessons/${lessonId}`);
    return response.data.data.lesson;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function createLesson(courseId: number, lessonData: Partial<Lesson>): Promise<Lesson> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(`/instructor/courses/${courseId}/lessons`, lessonData);
    return response.data.data.lesson;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function updateLesson(courseId: number, lessonId: number, lessonData: Partial<Lesson>): Promise<Lesson> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put(`/instructor/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data.data.lesson;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function deleteLesson(courseId: number, lessonId: number): Promise<void> {
  try {
    const api = await initializeInstructorAPI();
    await api.delete(`/instructor/courses/${courseId}/lessons/${lessonId}`);
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== QUIZ ENDPOINTS ====================

export interface QuizQuestion {
  id?: number;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: Array<{ label: string; is_correct: boolean }>;
  correct_answer?: string | string[];
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passing_score: number;
  time_limit_minutes?: number;
  shuffle_questions: boolean;
  show_answers: boolean;
  allow_retake: boolean;
  total_attempts_allowed?: number;
  created_at: string;
  updated_at: string;
}

export async function fetchQuiz(courseId: number, lessonId: number): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/lessons/${lessonId}/quiz`);
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function createQuiz(courseId: number, lessonId: number, quizData: Partial<Quiz>): Promise<Quiz> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(`/instructor/courses/${courseId}/lessons/${lessonId}/quiz`, quizData);
    return response.data.data.quiz;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export interface QuizAttempt {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  score: number;
  passing_score: number;
  passed: boolean;
  time_spent_minutes: number;
  questions_correct: number;
  total_questions: number;
  attempted_at: string;
}

export async function fetchQuizAttempts(
  courseId: number,
  lessonId: number,
  page = 1,
  sortBy?: string
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/lessons/${lessonId}/quiz/attempts`, {
      params: { page, per_page: 20, sort_by: sortBy },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== ASSIGNMENT ENDPOINTS ====================

export interface Assignment {
  id: number;
  lesson_id: number;
  course_id: number;
  title: string;
  description: string;
  instructions: string;
  is_active: boolean;
  due_date?: string;
  total_points: number;
  submission_type: 'file' | 'text' | 'code' | 'link';
  allow_late_submission: boolean;
  late_penalty_percent: number;
  can_resubmit: boolean;
  max_submissions?: number;
  total_submissions?: number;
  graded_submissions?: number;
  pending_submissions?: number;
  average_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  submission_text?: string;
  file_url?: string;
  submission_link?: string;
  submitted_at: string;
  status: 'pending' | 'submitted' | 'graded' | 'returned';
  score?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: number;
  is_late: boolean;
  final_score?: number;
}

export async function fetchCourseAssignments(
  courseId: number,
  page = 1,
  filterStatus?: string,
  sortBy?: string
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/assignments`, {
      params: { page, per_page: 20, filter_status: filterStatus, sort_by: sortBy },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function fetchAssignmentSubmissions(
  courseId: number,
  assignmentId: number,
  page = 1,
  status?: string,
  sortBy?: string
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/assignments/${assignmentId}/submissions`, {
      params: { page, per_page: 20, status, sort_by: sortBy },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function gradeSubmission(
  courseId: number,
  assignmentId: number,
  submissionId: number,
  gradeData: { score: number; feedback?: string; status?: string }
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(
      `/instructor/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      gradeData
    );
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function returnSubmission(
  courseId: number,
  assignmentId: number,
  submissionId: number,
  returnData: { feedback: string; reason?: string }
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(
      `/instructor/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/return`,
      returnData
    );
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function createAssignment(courseId: number, assignmentData: Partial<Assignment>): Promise<Assignment> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(`/instructor/courses/${courseId}/assignments`, assignmentData);
    return response.data.data.assignment;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== CERTIFICATE ENDPOINTS ====================

export interface Certificate {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_id: number;
  course_title: string;
  issue_date: string;
  expiry_date?: string;
  is_revoked: boolean;
  certificate_url: string;
  verification_code: string;
  created_at: string;
  updated_at: string;
}

export async function fetchCertificateDetails(certificateId: number): Promise<Certificate> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/certificates/${certificateId}`);
    return response.data.data.certificate;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== PROFILE & SETTINGS ====================

export interface InstructorSettings {
  email_notifications: {
    new_enrollment: boolean;
    assignment_submission: boolean;
    quiz_attempt: boolean;
    student_question: boolean;
    course_review: boolean;
  };
  course_settings: {
    auto_mark_complete: boolean;
    require_lesson_order: boolean;
    allow_student_reviews: boolean;
  };
  privacy: {
    show_profile_public: boolean;
    show_student_list: boolean;
  };
  language: string;
  timezone: string;
}

export async function fetchInstructorSettings(): Promise<InstructorSettings> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/settings');
    return response.data.data.settings;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function updateInstructorSettings(settings: Partial<InstructorSettings>): Promise<InstructorSettings> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put('/instructor/settings', settings);
    return response.data.data.settings;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export interface PayoutInfo {
  id: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
  routing_number?: string;
  currency: string;
  is_active: boolean;
  verified: boolean;
  verified_at?: string;
  created_at: string;
}

export async function fetchPayoutInfo(): Promise<PayoutInfo> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/payout-info');
    return response.data.data.payout_info;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function updatePayoutInfo(payoutData: Partial<PayoutInfo>): Promise<PayoutInfo> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put('/instructor/payout-info', payoutData);
    return response.data.data.payout_info;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function updateInstructorProfile(profileData: Partial<InstructorProfile>): Promise<InstructorProfile> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put('/instructor/profile', profileData);
    return response.data.data.instructor;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== COURSE CRUD OPERATIONS ====================

export async function createCourse(courseData: Partial<InstructorCourse>): Promise<InstructorCourse> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post('/instructor/courses', courseData);
    return response.data.data.course;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function updateCourse(courseId: number, courseData: Partial<InstructorCourse>): Promise<InstructorCourse> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put(`/instructor/courses/${courseId}`, courseData);
    return response.data.data.course;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function deleteCourse(courseId: number): Promise<void> {
  try {
    const api = await initializeInstructorAPI();
    await api.delete(`/instructor/courses/${courseId}`);
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== CERTIFICATE ENDPOINTS ====================

export interface Certificate {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_id: number;
  course_title: string;
  issue_date: string;
  expiry_date?: string;
  is_revoked: boolean;
  verification_code: string;
  certificate_url: string;
  created_at: string;
  updated_at: string;
}

export async function fetchCourseCertificates(
  courseId: number,
  page = 1,
  search?: string,
  sortBy?: string
): Promise<{ certificates: Certificate[]; pagination: any }> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/certificates`, {
      params: {
        page,
        per_page: 20,
        search,
        sort_by: sortBy,
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function revokeCertificate(
  courseId: number,
  certificateId: number,
  reason?: string
): Promise<Certificate> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.post(
      `/instructor/courses/${courseId}/certificates/${certificateId}/revoke`,
      { reason }
    );
    return response.data.data.certificate;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== STUDENT STATUS & UPDATE ====================

export async function updateStudentStatus(
  courseId: number,
  enrollmentId: number,
  status: 'active' | 'paused' | 'completed' | 'withdrawn'
): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.put(
      `/instructor/courses/${courseId}/students/${enrollmentId}`,
      { status }
    );
    return response.data.data.enrollment;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

// ==================== VIDEO UPLOAD ====================

export interface UploadToken {
  upload_token: string;
  upload_url: string;
  expires_in: number;
  max_file_size_mb: number;
}

export async function fetchUploadToken(lessonId?: number, fileSizeMb?: number): Promise<UploadToken> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get('/instructor/content/upload-token', {
      params: {
        lesson_id: lessonId,
        file_size_mb: fileSizeMb,
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function uploadVideo(
  courseId: number,
  lessonId: number,
  file: File
): Promise<{ video_url: string; video_duration: number; bunny_video_id: string }> {
  try {
    const api = await initializeInstructorAPI();
    const formData = new FormData();
    formData.append('video_file', file);

    const response = await api.post(
      `/instructor/courses/${courseId}/lessons/${lessonId}/video`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.lesson;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function fetchVideoUploadStatus(courseId: number, lessonId: number): Promise<any> {
  try {
    const api = await initializeInstructorAPI();
    const response = await api.get(`/instructor/courses/${courseId}/lessons/${lessonId}/video/status`);
    return response.data.data;
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}

export async function deleteVideo(courseId: number, lessonId: number): Promise<void> {
  try {
    const api = await initializeInstructorAPI();
    await api.delete(`/instructor/courses/${courseId}/lessons/${lessonId}/video`);
  } catch (error) {
    throw handleInstructorAPIError(error);
  }
}
