/**
 * useFiltering Hook
 * Manages filtering and sorting state
 */

import { useState, useCallback, useMemo } from 'react';

export interface FilterOptions {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface SortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseFilteringOptions {
  initialFilters?: FilterOptions;
  initialSort?: SortOptions;
}

export interface UseFilteringReturn {
  filters: FilterOptions;
  sortBy: string | undefined;
  sortOrder: 'asc' | 'desc';
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleSortOrder: () => void;
  updateFilterBatch: (updates: FilterOptions) => void;
  getQueryParams: FilterOptions & SortOptions;
  hasActiveFilters: boolean;
}

export function useFiltering(options: UseFilteringOptions = {}): UseFilteringReturn {
  const {
    initialFilters = {},
    initialSort = {},
  } = options;

  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters);
  const [sortBy, setSortByState] = useState<string | undefined>(initialSort.sortBy);
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>(initialSort.sortOrder || 'desc');

  const setFilter = useCallback((key: string, value: any) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFiltersState((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const setSortBy = useCallback((field: string) => {
    setSortByState(field);
  }, []);

  const setSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrderState(order);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrderState((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const updateFilterBatch = useCallback((updates: FilterOptions) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const getQueryParams = useMemo(() => {
    const params: FilterOptions & SortOptions = { ...filters };
    if (sortBy) {
      params.sort_by = sortBy;
    }
    if (sortOrder) {
      params.sort_order = sortOrder;
    }
    return params;
  }, [filters, sortBy, sortOrder]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || !!sortBy;
  }, [filters, sortBy]);

  return {
    filters,
    sortBy,
    sortOrder,
    setFilter,
    removeFilter,
    clearFilters,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    updateFilterBatch,
    getQueryParams,
    hasActiveFilters,
  };
}
