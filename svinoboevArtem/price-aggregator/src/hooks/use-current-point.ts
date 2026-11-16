import { useQuery } from '@tanstack/react-query';

import { getCurrentPoint } from '@/lib/geo';

/** Координаты пользователя с кэшем на 5 минут; запрашивает разрешение при первом вызове. */
export function useCurrentPoint(enabled: boolean) {
  return useQuery({
    queryKey: ['current-point'],
    queryFn: getCurrentPoint,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
