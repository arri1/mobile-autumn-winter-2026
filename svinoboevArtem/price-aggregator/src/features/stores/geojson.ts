import type { FeatureCollection, Point } from 'geojson';

import type { Store, StoreType } from './types';

export type StoreFeatureProperties = {
  storeId: string;
  name: string;
  storeType: StoreType;
};

/** GeoJSON для слоя магазинов на карте. Порядок координат в GeoJSON — [долгота, широта]. */
export function storesToFeatureCollection(
  stores: readonly Store[],
): FeatureCollection<Point, StoreFeatureProperties> {
  return {
    type: 'FeatureCollection',
    features: stores.map((store) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [store.location.lon, store.location.lat] },
      properties: { storeId: store.id, name: store.name, storeType: store.store_type },
    })),
  };
}
