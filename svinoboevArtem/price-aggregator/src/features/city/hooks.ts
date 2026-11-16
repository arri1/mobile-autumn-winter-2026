import { useMutation, useQuery } from '@tanstack/react-query';

import { getCurrentPoint } from '@/lib/geo';

import { fetchCities, resolveCity } from './api';
import { useCityStore } from './city-store';

export const cityKeys = {
  all: ['cities'] as const,
};

export function useCities() {
  return useQuery({
    queryKey: cityKeys.all,
    queryFn: ({ signal }) => fetchCities(signal),
    staleTime: Infinity,
  });
}

/** Определяет город по GPS и сохраняет его как выбранный. */
export function useDetectCity() {
  const setCity = useCityStore((state) => state.setCity);
  return useMutation({
    mutationFn: async () => resolveCity(await getCurrentPoint()),
    onSuccess: setCity,
  });
}
