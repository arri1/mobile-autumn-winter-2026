import { parseFnsReceiptQr } from './fns-receipt';

const VALID = 't=20240115T1830&s=1234.56&fn=7281440500123456&i=12345&fp=1234567890&n=1';

describe('parseFnsReceiptQr', () => {
  it('разбирает QR-код чека', () => {
    expect(parseFnsReceiptQr(VALID)).toEqual({
      dateTime: '2024-01-15T18:30:00',
      total: 1234.56,
      fn: '7281440500123456',
      fd: '12345',
      fp: '1234567890',
      operationType: 1,
      raw: VALID,
    });
  });

  it('понимает время с секундами, сумму без копеек и любой порядок параметров', () => {
    const receipt = parseFnsReceiptQr('n=2&fp=42&i=7&fn=7281440500123456&s=500&t=20231231T235959');
    expect(receipt).toMatchObject({
      dateTime: '2023-12-31T23:59:59',
      total: 500,
      operationType: 2,
    });
  });

  it('обрезает пробелы вокруг строки', () => {
    expect(parseFnsReceiptQr(`  ${VALID}\n`)?.raw).toBe(VALID);
  });

  it.each([
    ['пустая строка', ''],
    ['обычный URL', 'https://example.com/?t=1'],
    ['нет суммы', 't=20240115T1830&fn=7281440500123456&i=12345&fp=1234567890&n=1'],
    ['короткий номер ФН', 't=20240115T1830&s=1&fn=123&i=12345&fp=1234567890&n=1'],
    ['неизвестный признак расчёта', VALID.replace('n=1', 'n=5')],
    ['битая дата', VALID.replace('20240115T1830', '2024-01-15')],
    ['сумма с тремя знаками после точки', VALID.replace('1234.56', '1234.567')],
  ])('возвращает null: %s', (_, data) => {
    expect(parseFnsReceiptQr(data)).toBeNull();
  });
});
