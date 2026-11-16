import { apiRequest } from '@/lib/api/client';
import type { GeoPoint } from '@/lib/geo';

import type { City } from './types';

export function fetchCities(signal?: AbortSignal) {
  return apiRequest<City[]>('/cities', { auth: false, signal });
}

/** Город по координатам — определяется на бэкенде по полигонам городов (PostGIS). */
export function resolveCity(point: GeoPoint) {
  return apiRequest<City>('/cities/resolve', { query: point, auth: false });
}
