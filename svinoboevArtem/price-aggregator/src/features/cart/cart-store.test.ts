import type { ProductSummary } from '@/features/catalog/types';

import { selectItemsCount, useCartStore } from './cart-store';

const milk: ProductSummary = {
  id: 'milk',
  name: 'Молоко 3,2%',
  brand: null,
  image_url: null,
  net_weight: 930,
  nutrition: null,
  min_price: 89.9,
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('добавляет товар и увеличивает количество при повторном добавлении', () => {
    const { addItem } = useCartStore.getState();
    addItem(milk);
    addItem(milk, 2);

    expect(useCartStore.getState().items).toEqual([{ product: milk, quantity: 3 }]);
    expect(selectItemsCount(useCartStore.getState())).toBe(3);
  });

  it('удаляет позицию, когда количество становится нулевым', () => {
    const { addItem, setQuantity } = useCartStore.getState();
    addItem(milk);
    setQuantity(milk.id, 0);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('частично обновляет настройки оптимизации', () => {
    useCartStore.getState().updateSettings({ radiusKm: 5 });

    expect(useCartStore.getState().settings).toEqual({
      mode: 'cheapest',
      radiusKm: 5,
      origin: 'gps',
    });
  });
});
