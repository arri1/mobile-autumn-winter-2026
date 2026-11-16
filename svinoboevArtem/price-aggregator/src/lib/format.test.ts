import {
  formatDayMonth,
  formatDistance,
  formatDuration,
  formatPrice,
  formatWeight,
  plural,
} from './format';

describe('formatPrice', () => {
  it('не показывает копейки у целых сумм', () => {
    expect(formatPrice(113)).toMatch(/^113\s₽$/);
    expect(formatPrice(113.5)).toMatch(/^113,50\s₽$/);
  });
});

describe('formatWeight', () => {
  it('подписывает обе единицы: бэкенд не различает граммы и миллилитры', () => {
    expect(formatWeight(930)).toBe('930 г / мл');
    expect(formatWeight(1000)).toBe('1000 г / мл');
  });
});

describe('formatDayMonth', () => {
  it('показывает календарную дату без сдвига часового пояса', () => {
    expect(formatDayMonth('2026-10-17')).toBe('17 окт');
  });

  it('показывает момент времени в локальном времени устройства', () => {
    const local = new Date(2026, 10, 1, 0, 30);
    expect(formatDayMonth(local.toISOString())).toBe('1 ноя');
  });

  it('возвращает строку как есть, если это не дата', () => {
    expect(formatDayMonth('вчера')).toBe('вчера');
  });
});

describe('plural', () => {
  const forms = ['товар', 'товара', 'товаров'] as const;

  it('склоняет по правилам русского языка', () => {
    expect([1, 2, 5, 11, 12, 21, 22, 25, 111].map((n) => plural(n, forms))).toEqual([
      'товар',
      'товара',
      'товаров',
      'товаров',
      'товаров',
      'товар',
      'товара',
      'товаров',
      'товаров',
    ]);
  });
});

describe('formatDistance', () => {
  it('показывает метры до километра и километры с одним знаком после', () => {
    expect(formatDistance(850.4)).toBe('850 м');
    expect(formatDistance(1250)).toBe('1,3 км');
  });
});

describe('formatDuration', () => {
  it('округляет до минут и переходит на часы', () => {
    expect(formatDuration(20)).toBe('1 мин');
    expect(formatDuration(25 * 60)).toBe('25 мин');
    expect(formatDuration(2 * 3600)).toBe('2 ч');
    expect(formatDuration(95 * 60)).toBe('1 ч 35 мин');
  });
});
