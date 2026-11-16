import type { PricePoint } from './types';

export type ChartPoint = PricePoint & {
  /** Доли от 0 до 1: x — слева направо, y — снизу вверх. */
  x: number;
  y: number;
};

/** Раскладывает историю цен по единичному квадрату для графика. */
export function toChartPoints(history: readonly PricePoint[]): ChartPoint[] {
  if (history.length === 0) return [];
  const prices = history.map((point) => point.price);
  const min = Math.min(...prices);
  const range = Math.max(...prices) - min;

  return history.map((point, index) => ({
    ...point,
    x: history.length === 1 ? 0.5 : index / (history.length - 1),
    // Ровная цена рисуется линией посередине.
    y: range === 0 ? 0.5 : (point.price - min) / range,
  }));
}

/** Изменение цены между первой и последней точкой, ₽. Меньше двух точек — null. */
export function priceChange(history: readonly PricePoint[]): number | null {
  if (history.length < 2) return null;
  return history[history.length - 1].price - history[0].price;
}
