/**
 * Данные QR-кода кассового чека (формат ФНС):
 * t=20240115T1830&s=1234.56&fn=7281440500123456&i=12345&fp=1234567890&n=1
 */
export type FnsReceiptQr = {
  /** Дата и время чека в локальном времени кассы, ISO 8601 без часового пояса. */
  dateTime: string;
  /** Сумма чека, ₽. */
  total: number;
  /** Номер фискального накопителя (ФН). */
  fn: string;
  /** Номер фискального документа (ФД). */
  fd: string;
  /** Фискальный признак документа (ФП/ФПД). */
  fp: string;
  /** Признак расчёта: 1 — приход, 2 — возврат прихода, 3 — расход, 4 — возврат расхода. */
  operationType: 1 | 2 | 3 | 4;
  /** Исходная строка — её и отправляем на бэкенд для запроса состава чека в ФНС. */
  raw: string;
};

const DATE_TIME = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/;

export function parseFnsReceiptQr(data: string): FnsReceiptQr | null {
  const raw = data.trim();
  const params = new Map<string, string>();
  for (const pair of raw.split('&')) {
    const separator = pair.indexOf('=');
    if (separator <= 0) return null;
    params.set(pair.slice(0, separator), safeDecode(pair.slice(separator + 1)));
  }

  const t = params.get('t') ?? '';
  const s = params.get('s') ?? '';
  const fn = params.get('fn') ?? '';
  const fd = params.get('i') ?? '';
  const fp = params.get('fp') ?? '';
  const n = Number(params.get('n'));

  const dateMatch = DATE_TIME.exec(t);
  const total = Number(s);
  if (
    !dateMatch ||
    !/^\d+(\.\d{1,2})?$/.test(s) ||
    !/^\d{16}$/.test(fn) ||
    !/^\d{1,10}$/.test(fd) ||
    !/^\d{1,10}$/.test(fp) ||
    ![1, 2, 3, 4].includes(n)
  ) {
    return null;
  }

  const [, year, month, day, hours, minutes, seconds = '00'] = dateMatch;
  return {
    dateTime: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
    total,
    fn,
    fd,
    fp,
    operationType: n as FnsReceiptQr['operationType'],
    raw,
  };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
