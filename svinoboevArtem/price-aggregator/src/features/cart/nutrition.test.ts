import type { ProductSummary } from '@/features/catalog/types';

import {
  calculateCartNutrition,
  checkNutritionLimits,
  describeViolation,
  updateLimit,
} from './nutrition';

function product(overrides: Partial<ProductSummary>): ProductSummary {
  return {
    id: 'p1',
    name: 'Товар',
    brand: null,
    image_url: null,
    net_weight: null,
    nutrition: null,
    min_price: null,
    ...overrides,
  };
}

const milk = product({
  id: 'milk',
  net_weight: 930,
  nutrition: { calories: 58, protein: 2.9, fat: 3.2, carbs: 4.7 },
});
const bread = product({
  id: 'bread',
  net_weight: 400,
  nutrition: { calories: 250, protein: 8, fat: 3, carbs: 48 },
});

describe('calculateCartNutrition', () => {
  it('суммирует КБЖУ с учётом массы нетто и количества', () => {
    const { totals, unknownItems } = calculateCartNutrition([
      { product: milk, quantity: 2 },
      { product: bread, quantity: 1 },
    ]);

    expect(totals.calories).toBeCloseTo(58 * 9.3 * 2 + 250 * 4);
    expect(totals.protein).toBeCloseTo(2.9 * 9.3 * 2 + 8 * 4);
    expect(totals.fat).toBeCloseTo(3.2 * 9.3 * 2 + 3 * 4);
    expect(totals.carbs).toBeCloseTo(4.7 * 9.3 * 2 + 48 * 4);
    expect(unknownItems).toBe(0);
  });

  it('пропускает товары без КБЖУ или массы и считает их', () => {
    const { totals, unknownItems } = calculateCartNutrition([
      { product: product({ id: 'a', net_weight: 100 }), quantity: 1 },
      { product: product({ id: 'b', nutrition: milk.nutrition }), quantity: 1 },
      { product: bread, quantity: 1 },
    ]);

    expect(totals.calories).toBeCloseTo(1000);
    expect(unknownItems).toBe(2);
  });

  it('для пустой корзины возвращает нули', () => {
    expect(calculateCartNutrition([]).totals).toEqual({
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  });
});

describe('checkNutritionLimits', () => {
  const totals = { calories: 2500, protein: 80, fat: 70, carbs: 300 };

  it('находит превышение максимума и недобор минимума', () => {
    const violations = checkNutritionLimits(totals, [
      { nutrient: 'calories', kind: 'max', value: 2000 },
      { nutrient: 'protein', kind: 'min', value: 100 },
      { nutrient: 'fat', kind: 'max', value: 90 },
    ]);

    expect(violations).toEqual([
      { nutrient: 'calories', kind: 'max', value: 2000, actual: 2500 },
      { nutrient: 'protein', kind: 'min', value: 100, actual: 80 },
    ]);
  });

  it('граничное значение не считается нарушением', () => {
    expect(
      checkNutritionLimits(totals, [
        { nutrient: 'calories', kind: 'max', value: 2500 },
        { nutrient: 'protein', kind: 'min', value: 80 },
      ]),
    ).toEqual([]);
  });

  it('формирует понятное описание нарушения', () => {
    expect(
      describeViolation({ nutrient: 'calories', kind: 'max', value: 2000, actual: 2500.4 }),
    ).toBe('Калории: 2500 ккал при лимите не более 2000 ккал');
  });
});

describe('updateLimit', () => {
  const calories = { nutrient: 'calories', kind: 'max', value: 2000 } as const;

  it('создаёт лимит «не более» по умолчанию', () => {
    expect(updateLimit([], 'calories', { value: 2000 })).toEqual([calories]);
  });

  it('меняет вид лимита, сохраняя значение и остальные лимиты', () => {
    const protein = { nutrient: 'protein', kind: 'min', value: 100 } as const;
    expect(updateLimit([calories, protein], 'calories', { kind: 'min' })).toEqual([
      protein,
      { nutrient: 'calories', kind: 'min', value: 2000 },
    ]);
  });

  it('не создаёт лимит без значения и снимает его по null', () => {
    expect(updateLimit([], 'fat', { kind: 'min' })).toEqual([]);
    expect(updateLimit([calories], 'calories', null)).toEqual([]);
    expect(updateLimit([calories], 'calories', { value: 0 })).toEqual([]);
  });
});
