/** Проверяет EAN-8 / EAN-13 по контрольной цифре (алгоритм GS1). */
export function isValidEan(code: string): boolean {
  if (!/^(\d{8}|\d{13})$/.test(code)) return false;

  const digits = Array.from(code, Number);
  const checkDigit = digits.pop()!;
  // Веса 3 и 1 чередуются справа налево, начиная с цифры перед контрольной.
  const sum = digits
    .reverse()
    .reduce((acc, digit, index) => acc + digit * (index % 2 === 0 ? 3 : 1), 0);

  return (10 - (sum % 10)) % 10 === checkDigit;
}
