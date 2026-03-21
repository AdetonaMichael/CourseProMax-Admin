// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1';

export const API_ENDPOINTS = {
  ADMIN: {
    COURSES: `${API_BASE_URL}/admin/courses`,
    LESSONS: (courseId: number) => `${API_BASE_URL}/admin/courses/${courseId}/lessons`,
    LESSON_DETAIL: (courseId: number, lessonId: number) => 
      `${API_BASE_URL}/admin/courses/${courseId}/lessons/${lessonId}`,
    LESSON_VIDEO: (courseId: number, lessonId: number) => 
      `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/video`,
    LESSON_QUIZ: (courseId: number, lessonId: number) => 
      `${API_BASE_URL}/admin/courses/${courseId}/lessons/${lessonId}/quiz`,
  },
  INSTRUCTOR: {
    LESSON_VIDEO: (courseId: number, lessonId: number) => 
      `${API_BASE_URL}/instructor/courses/${courseId}/lessons/${lessonId}/video`,
  },
};
