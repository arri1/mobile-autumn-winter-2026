import { useState } from 'react';

/**
 * Состояние pull-to-refresh. Индикатор показываем только на жест пользователя:
 * фоновые обновления React Query (например, при возврате на экран) его не трогают.
 */
export function useRefresh(refetch: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

  return { refreshing, onRefresh };
}
