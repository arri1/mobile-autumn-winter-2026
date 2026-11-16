import { NUTRIENTS } from '@/features/catalog/constants';
import type { Nutrient, Nutrition } from '@/features/catalog/types';

import type { CartItem, NutritionLimit } from './types';

const EMPTY: Nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

export type CartNutrition = {
  totals: Nutrition;
  /** Сколько позиций не учтено: у товара нет КБЖУ или массы нетто. */
  unknownItems: number;
};

/** Суммарное КБЖУ корзины: пищевая ценность на 100 г × масса нетто × количество. */
export function calculateCartNutrition(items: readonly CartItem[]): CartNutrition {
  const totals = { ...EMPTY };
  let unknownItems = 0;

  for (const { product, quantity } of items) {
    if (!product.nutrition || !product.net_weight) {
      unknownItems += 1;
      continue;
    }
    const factor = (product.net_weight / 100) * quantity;
    for (const nutrient of Object.keys(totals) as Nutrient[]) {
      totals[nutrient] += product.nutrition[nutrient] * factor;
    }
  }

  return { totals, unknownItems };
}

export type LimitViolation = NutritionLimit & { actual: number };

export function checkNutritionLimits(
  totals: Nutrition,
  limits: readonly NutritionLimit[],
): LimitViolation[] {
  return limits
    .filter(({ nutrient, kind, value }) =>
      kind === 'max' ? totals[nutrient] > value : totals[nutrient] < value,
    )
    .map((limit) => ({ ...limit, actual: totals[limit.nutrient] }));
}

export function describeViolation({ nutrient, kind, value, actual }: LimitViolation): string {
  const { label, unit } = NUTRIENTS[nutrient];
  const bound = kind === 'max' ? 'не более' : 'не менее';
  return `${label}: ${Math.round(actual)} ${unit} при лимите ${bound} ${value} ${unit}`;
}

/**
 * Меняет лимит одного нутриента: patch дополняет существующий (по умолчанию «не более»),
 * null — снимает ограничение. Лимит без значения не создаётся.
 */
export function updateLimit(
  limits: readonly NutritionLimit[],
  nutrient: Nutrient,
  patch: Partial<Pick<NutritionLimit, 'kind' | 'value'>> | null,
): NutritionLimit[] {
  const rest = limits.filter((limit) => limit.nutrient !== nutrient);
  if (patch === null) return rest;

  const current = limits.find((limit) => limit.nutrient === nutrient);
  const next = { nutrient, kind: current?.kind ?? 'max', value: current?.value ?? 0, ...patch };
  // Переключили «не более / не менее», а число ещё не ввели — запоминать нечего.
  return next.value > 0 ? [...rest, next] : rest;
}
