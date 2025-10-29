import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { movieShowApi } from '@/services/api';
import { 
  MovieOrShow, 
  CreateMovieShowInput, 
  UpdateMovieShowInput, 
  QueryParams 
} from '@/types/movieShow';

export const useMovieShows = (params: QueryParams = {}) => {
  const [page, setPage] = useState(1);
  const [allEntries, setAllEntries] = useState<MovieOrShow[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['movieShows', { ...params, page }],
    () => movieShowApi.getAll({ ...params, page, limit: 10 }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (page === 1) {
          setAllEntries(data.data.entries);
        } else {
          setAllEntries(prev => [...prev, ...data.data.entries]);
        }
        setHasNextPage(data.data.pagination.hasNext);
      },
    }
  );

  const createMutation = useMutation<any, Error, CreateMovieShowInput>(movieShowApi.create, {
    onSuccess: async () => {
      // Reset to page 1 - don't clear entries yet
      setPage(1);

      // Invalidate queries - this will trigger a refetch
      await queryClient.invalidateQueries(['movieShows']);
    },
    onError: (error) => {
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateMovieShowInput }) =>
      movieShowApi.update(id, data),
    {
      onSuccess: async () => {
        // Reset to page 1 - don't clear entries yet
        setPage(1);

        // Invalidate queries - this will trigger a refetch
        await queryClient.invalidateQueries(['movieShows']);
      },
      onError: (error) => {
        console.error('Update error:', error);
      },
    }
  );

  const deleteMutation = useMutation(movieShowApi.delete, {
    onSuccess: async () => {
      // Reset to page 1 - don't clear entries yet
      setPage(1);

      // Invalidate queries - this will trigger a refetch
      await queryClient.invalidateQueries(['movieShows']);
    },
    onError: (error) => {
      console.error('Delete error:', error);
    },
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage, isLoading]);

  // Reset pagination when search or type changes
  useEffect(() => {
    setPage(1);
    // Don't clear entries here - let the query handle it
  }, [params.search, params.type]);

  return {
    entries: allEntries,
    pagination: data?.data.pagination,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    createEntry: createMutation.mutateAsync,
    updateEntry: updateMutation.mutateAsync,
    deleteEntry: deleteMutation.mutateAsync,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    refetch,
  };
};