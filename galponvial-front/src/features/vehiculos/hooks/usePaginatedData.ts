import { useState, useCallback, useEffect } from 'react';

/**
 * Generic hook for handling paginated API responses
 */
export interface UsePaginatedDataOptions {
  initialPage?: number;
  pageSize?: number;
  onError?: (error: Error) => void;
}

export interface UsePaginatedDataReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing paginated API data
 * @param fetchFn - Async function that takes (page, pageSize) and returns paginated response
 * @param options - Configuration options
 * @returns Paginated data and control methods
 */
export const usePaginatedData = <T,>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number; page: number; pageSize: number }>,
  options: UsePaginatedDataOptions = {}
): UsePaginatedDataReturn<T> => {
  const { initialPage = 1, pageSize: defaultPageSize = 5, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Fetch data with current page and pageSize
  const fetchData = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFn(targetPage, pageSize);
        setData(response.data);
        setTotal(response.total);
        setPage(response.page || targetPage);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
        if (onError) {
          onError(error);
        }
        console.error('Error fetching paginated data:', error);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, pageSize, onError]
  );

  // Fetch initial data on mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFn(initialPage, defaultPageSize);
        if (isMounted) {
          setData(response.data);
          setTotal(response.total);
          setPage(response.page || initialPage);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch data');
          setError(error);
          if (onError) {
            onError(error);
          }
          console.error('Error fetching paginated data:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [initialPage, defaultPageSize, fetchFn, onError]);

  // Go to specific page
  const goToPage = useCallback(
    async (targetPage: number) => {
      if (targetPage < 1 || targetPage > totalPages) return;
      await fetchData(targetPage);
    },
    [fetchData, totalPages]
  );

  // Go to next page
  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await fetchData(page + 1);
    }
  }, [page, hasNextPage, fetchData]);

  // Go to previous page
  const previousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await fetchData(page - 1);
    }
  }, [page, hasPreviousPage, fetchData]);

  // Refetch current page
  const refetch = useCallback(() => fetchData(page), [fetchData, page]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  };
};
