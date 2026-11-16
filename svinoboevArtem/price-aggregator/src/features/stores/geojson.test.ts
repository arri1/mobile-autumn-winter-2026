import { storesToFeatureCollection } from './geojson';
import type { Store } from './types';

const store: Store = {
  id: 's1',
  name: 'Пятёрочка',
  chain: 'Пятёрочка',
  store_type: 'convenience',
  address: 'ул. Ленина, 1',
  location: { lat: 55.75, lon: 37.62 },
  rating: 4.2,
  price_level: 1,
  opening_hours: '08:00–22:00',
  distance_m: null,
};

describe('storesToFeatureCollection', () => {
  it('строит точки в порядке [долгота, широта]', () => {
    expect(storesToFeatureCollection([store])).toEqual({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [37.62, 55.75] },
          properties: { storeId: 's1', name: 'Пятёрочка', storeType: 'convenience' },
        },
      ],
    });
  });
});
