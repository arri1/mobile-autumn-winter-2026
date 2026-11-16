import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { meKeys } from '@/features/auth/query-keys';
import { useSessionStore } from '@/features/auth/session-store';

import { fetchReceipts, submitReceipt } from './api';
import type { FnsReceiptQr } from './fns-receipt';

export const receiptKeys = {
  list: () => [...meKeys.all, 'receipts'] as const,
};

/** История отправленных чеков текущего пользователя. */
export function useReceipts() {
  const isAuthenticated = useSessionStore((state) => state.status === 'authenticated');
  return useQuery({
    queryKey: receiptKeys.list(),
    queryFn: ({ signal }) => fetchReceipts(signal),
    enabled: isAuthenticated,
  });
}

export function useSubmitReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receipt, cityId }: { receipt: FnsReceiptQr; cityId: string }) =>
      submitReceipt(receipt, cityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: receiptKeys.list() }),
  });
}
