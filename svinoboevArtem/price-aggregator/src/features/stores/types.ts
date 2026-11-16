import type { GeoPoint } from '@/lib/geo';

/** Типы магазинов для фильтра (ТЗ, п. 4.5). */
export type StoreType =
  'hypermarket' | 'supermarket' | 'convenience' | 'discounter' | 'specialized';

export type StoreSort = 'distance' | 'rating' | 'price';

/** 1 — выгодно, 3 — дорого. */
export type PriceLevel = 1 | 2 | 3;

export type Store = {
  id: string;
  name: string;
  chain: string | null;
  store_type: StoreType;
  address: string;
  location: GeoPoint;
  rating: number | null;
  price_level: PriceLevel | null;
  opening_hours: string | null;
  /** Заполняется, если в запросе переданы координаты пользователя. */
  distance_m: number | null;
};

/** Отзыв текущего пользователя о магазине: один на магазин, повторная отправка заменяет. */
export type StoreReview = {
  store_id: string;
  store_name: string;
  rating: number;
  text: string;
};

export type ReviewInput = {
  storeId: string;
  cityId: string;
  /** 1–5. */
  rating: number;
  text: string;
};

export type StoresQuery = {
  cityId: string;
  types?: StoreType[];
  sort?: StoreSort;
  search?: string;
  near?: GeoPoint | null;
};
