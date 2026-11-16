import type { ProductSummary } from '@/features/catalog/types';

import { routeInputKey } from './hooks';
import type { CartItem, OptimizationSettings } from './types';

jest.mock('expo-location', () => ({}));

const settings: OptimizationSettings = { mode: 'cheapest', radiusKm: 3, origin: 'city' };

function item(id: string, quantity: number): CartItem {
  return { product: { id } as ProductSummary, quantity };
}

describe('routeInputKey', () => {
  const key = routeInputKey('yakutsk', [item('milk', 1)], settings);

  it('не меняется, пока корзина, город и настройки те же', () => {
    expect(routeInputKey('yakutsk', [item('milk', 1)], { ...settings })).toBe(key);
  });

  it('меняется при любом изменении входных данных маршрута', () => {
    expect(routeInputKey('yakutsk', [item('milk', 2)], settings)).not.toBe(key);
    expect(routeInputKey('yakutsk', [], settings)).not.toBe(key);
    expect(routeInputKey('moscow', [item('milk', 1)], settings)).not.toBe(key);
    expect(routeInputKey('yakutsk', [item('milk', 1)], { ...settings, radiusKm: 5 })).not.toBe(key);
    expect(routeInputKey('yakutsk', [item('milk', 1)], { ...settings, origin: 'gps' })).not.toBe(
      key,
    );
  });
});
