import type { GeoPoint } from '@/lib/geo';

export type City = {
  id: string;
  name: string;
  center: GeoPoint;
};
