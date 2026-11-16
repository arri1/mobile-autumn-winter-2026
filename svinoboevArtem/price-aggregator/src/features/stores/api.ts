import { apiRequest } from '@/lib/api/client';

import type { ReviewInput, Store, StoreReview, StoresQuery } from './types';

export function fetchStores(params: StoresQuery, signal?: AbortSignal) {
  return apiRequest<Store[]>('/stores', {
    query: {
      city_id: params.cityId,
      type: params.types,
      sort: params.sort,
      q: params.search || undefined,
      lat: params.near?.lat,
      lon: params.near?.lon,
    },
    signal,
  });
}

/** С cityId бэкенд отвечает 404, если магазин не из выбранного города. */
export function fetchStore(storeId: string, cityId: string | null, signal?: AbortSignal) {
  return apiRequest<Store>(`/stores/${encodeURIComponent(storeId)}`, {
    query: { city_id: cityId },
    signal,
  });
}

export function fetchMyReviews(cityId: string, signal?: AbortSignal) {
  return apiRequest<StoreReview[]>('/reviews', { query: { city_id: cityId }, signal });
}

export function saveReview({ storeId, cityId, rating, text }: ReviewInput) {
  return apiRequest<void>('/reviews', {
    method: 'PUT',
    body: { store_id: storeId, city_id: cityId, rating, text },
  });
}
