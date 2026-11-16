import { priceChange, toChartPoints } from './price-history';

const history = [
  { date: '2026-10-17', price: 120 },
  { date: '2026-10-24', price: 100 },
  { date: '2026-10-31', price: 140 },
];

describe('toChartPoints', () => {
  it('нормирует даты по оси X и цены по оси Y', () => {
    expect(toChartPoints(history).map(({ x, y }) => [x, y])).toEqual([
      [0, 0.5],
      [0.5, 0],
      [1, 1],
    ]);
  });

  it('ставит ровную цену посередине', () => {
    const flat = toChartPoints([
      { date: '2026-10-17', price: 99 },
      { date: '2026-10-24', price: 99 },
    ]);
    expect(flat.map((point) => point.y)).toEqual([0.5, 0.5]);
  });

  it('центрирует единственную точку и переживает пустую историю', () => {
    expect(toChartPoints([history[0]])[0]).toMatchObject({ x: 0.5, y: 0.5 });
    expect(toChartPoints([])).toEqual([]);
  });
});

describe('priceChange', () => {
  it('считает разницу между последней и первой ценой', () => {
    expect(priceChange(history)).toBe(20);
  });

  it('возвращает null, если точек меньше двух', () => {
    expect(priceChange([history[0]])).toBeNull();
  });
});
