/**
 * API Response Format Helpers
 * Implements common response format from API specification
 */

// ==================== RESPONSE TYPES ====================

export interface APIResponse<T> {
  status: boolean;
  success?: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page?: number;
  prev_page?: number;
}

export interface APIError {
  status: false;
  message: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
}

// ==================== RESPONSE HELPERS ====================

/**
 * Success Response Wrapper
 */
export function successResponse<T>(
  data: T,
  message: string = 'Operation successful'
): APIResponse<T> {
  return {
    status: true,
    success: true,
    message,
    data,
  };
}

/**
 * Paginated Response Wrapper
 */
export function paginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta,
  message: string = 'Data retrieved successfully'
): APIResponse<PaginatedResponse<T>> {
  return {
    status: true,
    success: true,
    message,
    data: {
      items,
      pagination,
    },
  };
}

/**
 * Error Response Wrapper
 */
export function errorResponse(
  message: string,
  errors?: Record<string, string[]>,
  retryAfter?: number
): APIError {
  return {
    status: false,
    message,
    errors,
    retry_after: retryAfter,
  };
}

// ==================== PAGINATION HELPERS ====================

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  currentPage: number,
  perPage: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / perPage);
  return {
    current_page: currentPage,
    per_page: perPage,
    total,
    total_pages: totalPages,
    has_next: currentPage < totalPages,
    has_prev: currentPage > 1,
    next_page: currentPage < totalPages ? currentPage + 1 : undefined,
    prev_page: currentPage > 1 ? currentPage - 1 : undefined,
  };
}

/**
 * Get pagination params from query
 */
export function getPaginationParams(page?: number, perPage?: number) {
  return {
    page: Math.max(1, page || 1),
    per_page: Math.min(Math.max(1, perPage || 20), 100), // max 100
  };
}

// ==================== HTTP STATUS CODES ====================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
} as const;

// ==================== VALIDATION HELPERS ====================

/**
 * Validate required fields
 */
export function validateRequired(data: Record<string, any>, requiredFields: string[]): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors[field] = [`${field} is required`];
    }
  });

  return errors;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate price
 */
export function validatePrice(price: number): boolean {
  return price >= 0 && price <= 10000000 && !isNaN(price);
}

/**
 * Validate string length
 */
export function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

// ==================== RESPONSE HANDLING ====================

/**
 * Extract data from API response
 */
export function extractData<T>(response: any): T {
  return response?.data?.data || response?.data || response;
}

/**
 * Check if response is successful
 */
export function isSuccessResponse(response: any): boolean {
  return response?.status === true || response?.success === true;
}

/**
 * Check if response has pagination
 */
export function hasPagination(response: any): boolean {
  return response?.data?.pagination !== undefined || response?.pagination !== undefined;
}

/**
 * Extract pagination meta from response
 */
export function extractPagination(response: any): PaginationMeta | null {
  return response?.data?.pagination || response?.pagination || null;
}

// ==================== RATE LIMITING ====================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Extract rate limit info from response headers
 */
export function extractRateLimitInfo(headers: any): RateLimitInfo | null {
  const limit = headers?.['x-ratelimit-limit'];
  const remaining = headers?.['x-ratelimit-remaining'];
  const reset = headers?.['x-ratelimit-reset'];
  const retryAfter = headers?.['retry-after'];

  if (!limit || !remaining || !reset) {
    return null;
  }

  return {
    limit: parseInt(limit, 10),
    remaining: parseInt(remaining, 10),
    reset: parseInt(reset, 10),
    retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
  };
}

/**
 * Check if rate limit is approaching
 */
export function isRateLimitApproaching(rateLimitInfo: RateLimitInfo, threshold: number = 0.1): boolean {
  return rateLimitInfo.remaining / rateLimitInfo.limit < threshold;
}
