/**
 * useRateLimit Hook
 * Manages rate limiting information and provides warnings
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetAt: Date | null;
  percentage: number;
  isApproaching: boolean;
  isExceeded: boolean;
}

export interface UseRateLimitOptions {
  approachingThreshold?: number; // Default 0.2 (20% remaining)
  onApproaching?: () => void;
  onExceeded?: () => void;
}

export interface UseRateLimitReturn {
  rateLimitStatus: RateLimitStatus | null;
  updateRateLimit: (headers: Record<string, any>) => void;
  canMakeRequest: () => boolean;
  getRemainingRequests: () => number;
  getResetTime: () => number | null;
  reset: () => void;
}

export function useRateLimit(options: UseRateLimitOptions = {}): UseRateLimitReturn {
  const {
    approachingThreshold = 0.2,
    onApproaching,
    onExceeded,
  } = options;

  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const approachingTriggeredRef = useRef(false);
  const exceededTriggeredRef = useRef(false);

  const updateRateLimit = useCallback((headers: Record<string, any>) => {
    const limit = headers['x-ratelimit-limit'];
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];

    if (limit && remaining !== undefined && reset) {
      const limitNum = parseInt(limit, 10);
      const remainingNum = parseInt(remaining, 10);
      const resetNum = parseInt(reset, 10);

      const resetAt = new Date(resetNum * 1000); // Convert to milliseconds
      const percentage = (remainingNum / limitNum) * 100;
      const isApproaching = percentage < (approachingThreshold * 100);
      const isExceeded = remainingNum <= 0;

      setRateLimitStatus({
        limit: limitNum,
        remaining: remainingNum,
        resetAt,
        percentage,
        isApproaching,
        isExceeded,
      });

      // Trigger callbacks
      if (isApproaching && !approachingTriggeredRef.current) {
        approachingTriggeredRef.current = true;
        onApproaching?.();
      }

      if (isExceeded && !exceededTriggeredRef.current) {
        exceededTriggeredRef.current = true;
        onExceeded?.();
      }

      // Reset exceeded flag when requests become available
      if (!isExceeded) {
        exceededTriggeredRef.current = false;
      }
    }
  }, [approachingThreshold, onApproaching, onExceeded]);

  const canMakeRequest = useCallback(() => {
    return rateLimitStatus ? rateLimitStatus.remaining > 0 : true;
  }, [rateLimitStatus]);

  const getRemainingRequests = useCallback(() => {
    return rateLimitStatus?.remaining ?? 0;
  }, [rateLimitStatus]);

  const getResetTime = useCallback(() => {
    if (!rateLimitStatus?.resetAt) return null;
    return Math.floor((rateLimitStatus.resetAt.getTime() - Date.now()) / 1000);
  }, [rateLimitStatus]);

  const reset = useCallback(() => {
    setRateLimitStatus(null);
    approachingTriggeredRef.current = false;
    exceededTriggeredRef.current = false;
  }, []);

  return {
    rateLimitStatus,
    updateRateLimit,
    canMakeRequest,
    getRemainingRequests,
    getResetTime,
    reset,
  };
}
