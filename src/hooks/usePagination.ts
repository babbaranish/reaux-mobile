import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function usePagination(fetchFn: (page: number) => Promise<void>, totalPages: number) {
  const [state, setState] = useState<PaginationState>({
    page: 1,
    hasMore: true,
    isLoadingMore: false,
  });

  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore) return;
    const nextPage = state.page + 1;
    if (nextPage > totalPages) {
      setState(s => ({ ...s, hasMore: false }));
      return;
    }
    setState(s => ({ ...s, isLoadingMore: true }));
    try {
      await fetchFn(nextPage);
      setState(s => ({
        page: nextPage,
        hasMore: nextPage < totalPages,
        isLoadingMore: false,
      }));
    } catch {
      setState(s => ({ ...s, isLoadingMore: false }));
    }
  }, [state, totalPages, fetchFn]);

  const reset = useCallback(() => {
    setState({ page: 1, hasMore: true, isLoadingMore: false });
  }, []);

  return { ...state, loadMore, reset };
}
