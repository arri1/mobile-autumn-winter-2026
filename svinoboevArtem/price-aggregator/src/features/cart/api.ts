import { apiRequest } from '@/lib/api/client';
import type { GeoPoint } from '@/lib/geo';

import type { CartItem, CartOptimizationResult, OptimizationSettings } from './types';

export type OptimizeCartInput = {
  cityId: string;
  origin: GeoPoint;
  items: readonly CartItem[];
  settings: OptimizationSettings;
};

/** Подбор комбинации магазинов и маршрута выполняется на бэкенде (OSRM). Вход не нужен. */
export function optimizeCart({ cityId, origin, items, settings }: OptimizeCartInput) {
  return apiRequest<CartOptimizationResult>('/cart/optimize', {
    method: 'POST',
    body: {
      city_id: cityId,
      origin,
      mode: settings.mode,
      radius_km: settings.radiusKm,
      items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
    },
  });
}
