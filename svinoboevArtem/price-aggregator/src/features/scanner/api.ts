import { apiRequest } from '@/lib/api/client';

import type { FnsReceiptQr } from './fns-receipt';

export type ReceiptStatus = 'pending' | 'processed' | 'rejected';

export type ReceiptSubmission = {
  id: string;
  city_id: string;
  status: ReceiptStatus;
  created_at: string;
};

/** Бэкенд принимает строку QR, ставит чек в очередь и сопоставляет позиции с каталогом. */
export function submitReceipt(receipt: FnsReceiptQr, cityId: string) {
  return apiRequest<ReceiptSubmission>('/receipts', {
    method: 'POST',
    body: { qr: receipt.raw, city_id: cityId },
  });
}

export function fetchReceipts(signal?: AbortSignal) {
  return apiRequest<ReceiptSubmission[]>('/receipts', { signal });
}
