import { useMutation } from '@tanstack/react-query';

import { useCityStore } from '@/features/city/city-store';
import { getCurrentPoint, type GeoPoint } from '@/lib/geo';

import { optimizeCart } from './api';
import { useCartStore } from './cart-store';
import type { CartItem, CartOptimizationResult, OptimizationSettings } from './types';

export type OptimizedRoute = {
  result: CartOptimizationResult;
  /** Точка, от которой построен маршрут. */
  origin: GeoPoint;
  /** Отпечаток входных данных — см. routeInputKey. */
  inputKey: string;
};

/**
 * Отпечаток всего, от чего зависит маршрут. Если он изменился (другой состав корзины,
 * город или настройки), построенный ранее маршрут устарел и показывать его нельзя.
 */
export function routeInputKey(
  cityId: string | undefined,
  items: readonly CartItem[],
  settings: OptimizationSettings,
): string {
  return JSON.stringify([
    cityId,
    settings.mode,
    settings.radiusKm,
    settings.origin,
    items.map((item) => [item.product.id, item.quantity]),
  ]);
}

/** Строит оптимальный маршрут по корзине от выбранной начальной точки. */
export function useOptimizeCart() {
  return useMutation({
    mutationFn: async (): Promise<OptimizedRoute> => {
      const city = useCityStore.getState().city;
      if (!city) throw new Error('Сначала выберите город');
      const { items, settings } = useCartStore.getState();
      const origin = settings.origin === 'city' ? city.center : await getCurrentPoint();
      const result = await optimizeCart({ cityId: city.id, origin, items, settings });
      return { result, origin, inputKey: routeInputKey(city.id, items, settings) };
    },
  });
}
