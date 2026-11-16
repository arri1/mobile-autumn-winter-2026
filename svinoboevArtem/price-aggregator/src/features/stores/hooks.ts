import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { meKeys } from '@/features/auth/query-keys';
import { useSessionStore } from '@/features/auth/session-store';
import { useCityStore } from '@/features/city/city-store';

import { fetchMyReviews, fetchStore, fetchStores, saveReview } from './api';
import type { ReviewInput, StoresQuery } from './types';

export const storeKeys = {
  all: ['stores'] as const,
  list: (params: StoresQuery) => [...storeKeys.all, 'list', params] as const,
  detail: (storeId: string, cityId: string | null) =>
    [...storeKeys.all, 'detail', storeId, cityId] as const,
  /** Отзывы принадлежат пользователю, поэтому живут под ['me'] и чистятся при выходе. */
  myReviews: (cityId: string) => [...meKeys.all, 'reviews', cityId] as const,
};

/** null — город ещё не выбран, запрос не выполняется. */
export function useStores(params: StoresQuery | null) {
  return useQuery({
    queryKey: params ? storeKeys.list(params) : storeKeys.all,
    queryFn: ({ signal }) => fetchStores(params!, signal),
    enabled: params !== null,
    // Не мигаем пустым списком при смене фильтров; магазины другого города не показываем.
    placeholderData: (previous, previousQuery) => {
      const previousParams = previousQuery?.queryKey[2] as StoresQuery | undefined;
      return previousParams?.cityId === params?.cityId ? previous : undefined;
    },
  });
}

export function useStore(storeId: string) {
  const cityId = useCityStore((state) => state.city?.id ?? null);
  return useQuery({
    queryKey: storeKeys.detail(storeId, cityId),
    queryFn: ({ signal }) => fetchStore(storeId, cityId, signal),
  });
}

/** Отзывы текущего пользователя о магазинах выбранного города. */
export function useMyReviews() {
  const cityId = useCityStore((state) => state.city?.id);
  const isAuthenticated = useSessionStore((state) => state.status === 'authenticated');
  return useQuery({
    queryKey: storeKeys.myReviews(cityId ?? ''),
    queryFn: ({ signal }) => fetchMyReviews(cityId!, signal),
    enabled: Boolean(cityId) && isAuthenticated,
  });
}

export function useSaveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewInput) => saveReview(input),
    onSuccess: (_, input) =>
      queryClient.invalidateQueries({ queryKey: storeKeys.myReviews(input.cityId) }),
  });
}
