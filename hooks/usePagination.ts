/**
 * usePagination Hook
 * Manages pagination state and navigation
 */

import { useState, useCallback, useMemo } from 'react';
import { PaginationMeta } from '@/utils/api-helpers';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPerPage?: number;
  maxPerPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  perPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPerPage: (perPage: number) => void;
  resetPage: () => void;
  paginationMeta: PaginationMeta | null;
  setPaginationMeta: (meta: PaginationMeta) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPerPage = 20,
    maxPerPage = 100,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(Math.min(initialPerPage, maxPerPage));
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    if (paginationMeta?.has_next) {
      setCurrentPage((p) => p + 1);
    }
  }, [paginationMeta?.has_next]);

  const prevPage = useCallback(() => {
    if (paginationMeta?.has_prev) {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  }, [paginationMeta?.has_prev]);

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(Math.min(newPerPage, maxPerPage));
    setCurrentPage(1); // Reset to first page when changing per_page
  }, [maxPerPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(
    () => paginationMeta ? currentPage >= paginationMeta.total_pages : false,
    [currentPage, paginationMeta]
  );

  return {
    currentPage,
    perPage,
    goToPage,
    nextPage,
    prevPage,
    setPerPage,
    resetPage,
    paginationMeta,
    setPaginationMeta,
    isFirstPage,
    isLastPage,
  };
}
