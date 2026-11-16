import type { Nutrient } from './types';

export const NUTRIENTS: Record<Nutrient, { label: string; short: string; unit: string }> = {
  calories: { label: 'Калории', short: 'ккал', unit: 'ккал' },
  protein: { label: 'Белки', short: 'белки, г', unit: 'г' },
  fat: { label: 'Жиры', short: 'жиры, г', unit: 'г' },
  carbs: { label: 'Углеводы', short: 'углев., г', unit: 'г' },
};
