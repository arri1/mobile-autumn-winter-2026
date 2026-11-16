import { isValidEan } from './barcode';
import { parseFnsReceiptQr, type FnsReceiptQr } from './fns-receipt';

export type ScanResult =
  | { kind: 'product'; barcode: string }
  | { kind: 'receipt'; receipt: FnsReceiptQr }
  | { kind: 'unknown'; data: string };

/**
 * Определяет, что отсканировано: штрихкод товара или QR-код чека.
 * Смотрим на содержимое, а не на тип кода: iOS и Android называют типы по-разному.
 */
export function classifyScan(data: string): ScanResult {
  const value = data.trim();
  if (isValidEan(value)) return { kind: 'product', barcode: value };

  const receipt = parseFnsReceiptQr(value);
  if (receipt) return { kind: 'receipt', receipt };

  return { kind: 'unknown', data: value };
}
