import type { LineString } from 'geojson';

import type { Nutrient, ProductSummary } from '@/features/catalog/types';
import type { Store } from '@/features/stores/types';

export type CartItem = {
  product: ProductSummary;
  quantity: number;
};

/** Ограничение КБЖУ: «не более 2000 ккал», «белки не менее 100 г» (ТЗ, п. 4.6). */
export type NutritionLimit = {
  nutrient: Nutrient;
  kind: 'max' | 'min';
  value: number;
};

/** cheapest — минимальная стоимость корзины, fastest — минимум остановок и времени в пути. */
export type OptimizationMode = 'cheapest' | 'fastest';

/** Откуда строить маршрут: от геопозиции пользователя или от центра выбранного города. */
export type RouteOrigin = 'gps' | 'city';

export type OptimizationSettings = {
  mode: OptimizationMode;
  radiusKm: number;
  origin: RouteOrigin;
};

export type CartOptimizationStop = {
  store: Store;
  items: { product_id: string; quantity: number; price: number }[];
  subtotal: number;
};

export type CartOptimizationResult = {
  total_cost: number;
  stops: CartOptimizationStop[];
  route: LineString | null;
  distance_m: number | null;
  duration_s: number | null;
  /** Товары, которых нет ни в одном магазине в заданном радиусе. */
  missing_product_ids: string[];
  /** estimate — OSRM недоступен: маршрут показан по прямой, времени в пути нет. */
  route_source: 'osrm' | 'estimate' | null;
};
