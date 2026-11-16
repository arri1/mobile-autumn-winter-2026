import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ProductSummary } from '@/features/catalog/types';
import { persistStorage } from '@/lib/storage';

import type { CartItem, NutritionLimit, OptimizationSettings } from './types';

// В корзине (и в AsyncStorage) храним только краткие данные товара, без предложений магазинов.
function toSummary(product: ProductSummary): ProductSummary {
  const { id, name, brand, image_url, net_weight, nutrition, min_price } = product;
  return { id, name, brand, image_url, net_weight, nutrition, min_price };
}

const DEFAULT_SETTINGS: OptimizationSettings = { mode: 'cheapest', radiusKm: 3, origin: 'gps' };

type CartState = {
  items: CartItem[];
  limits: NutritionLimit[];
  settings: OptimizationSettings;
  addItem: (product: ProductSummary, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setLimits: (limits: NutritionLimit[]) => void;
  updateSettings: (settings: Partial<OptimizationSettings>) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      limits: [],
      settings: DEFAULT_SETTINGS,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (!existing)
            return { items: [...state.items, { product: toSummary(product), quantity }] };
          return {
            items: state.items.map((item) =>
              item === existing ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item,
                )
              : state.items.filter((item) => item.product.id !== productId),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),

      clear: () => set({ items: [] }),

      setLimits: (limits) => set({ limits }),

      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'cart',
      storage: persistStorage,
      // Настройки дополняем значениями по умолчанию: в сохранённых данных старых версий
      // новых полей (например, origin) ещё нет.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<CartState>;
        return { ...current, ...saved, settings: { ...DEFAULT_SETTINGS, ...saved.settings } };
      },
    },
  ),
);

/** Оценка стоимости корзины по минимальным ценам города; позиции без цены не учитываются. */
export function selectEstimatedTotal(state: CartState): number {
  return state.items.reduce((sum, item) => sum + (item.product.min_price ?? 0) * item.quantity, 0);
}

export function selectItemsCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}
