const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

const wholeRubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  // Минимум задаём явно: по старым правилам Intl (Hermes на Android) он равен 2,
  // и maximumFractionDigits: 0 без него бросает RangeError.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Целые суммы показываем без копеек: «113 ₽», но «113,50 ₽». */
export function formatPrice(value: number): string {
  return Number.isInteger(value) ? wholeRubles.format(value) : rubles.format(value);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${(meters / 1000).toFixed(1).replace('.', ',')} км`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`;
}

/** Масса или объём нетто: бэкенд не различает граммы и миллилитры. */
export function formatWeight(amount: number): string {
  return `${amount} г / мл`;
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/**
 * «17 окт». Календарную дату (YYYY-MM-DD) разбираем как есть, без сдвига часового пояса;
 * момент времени (с «T») показываем в локальном времени устройства.
 */
export function formatDayMonth(iso: string): string {
  if (iso.includes('T')) {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month}` : iso;
}

/** Русское склонение: plural(3, ['товар', 'товара', 'товаров']) → «товара». */
export function plural(count: number, forms: readonly [string, string, string]): string {
  const mod10 = Math.abs(count) % 10;
  const mod100 = Math.abs(count) % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
