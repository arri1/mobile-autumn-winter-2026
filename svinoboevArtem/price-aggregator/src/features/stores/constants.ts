import type { PriceLevel, StoreSort, StoreType } from './types';

/** Подписи фильтров — во множественном числе. */
export const STORE_TYPE_LABELS: Record<StoreType, string> = {
  hypermarket: 'Гипермаркеты',
  supermarket: 'Супермаркеты',
  convenience: 'У дома',
  discounter: 'Дискаунтеры',
  specialized: 'Специализированные',
};

/** Тип конкретного магазина — в единственном числе. */
export const STORE_TYPE_LABELS_SINGULAR: Record<StoreType, string> = {
  hypermarket: 'Гипермаркет',
  supermarket: 'Супермаркет',
  convenience: 'Магазин у дома',
  discounter: 'Дискаунтер',
  specialized: 'Специализированный',
};

export const STORE_TYPES = Object.keys(STORE_TYPE_LABELS) as StoreType[];

export const STORE_SORT_LABELS: Record<StoreSort, string> = {
  rating: 'По рейтингу',
  distance: 'Рядом',
  price: 'Дешевле',
};

export const PRICE_LEVEL_LABELS: Record<PriceLevel, string> = {
  1: 'Выгодные цены',
  2: 'Средние цены',
  3: 'Цены выше средних',
};
