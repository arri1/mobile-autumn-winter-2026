const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Приводит российский номер к формату E.164 (+7XXXXXXXXXX).
 * Понимает «8 (999) 123-45-67», «+7 999 123 45 67», «9991234567». Иначе — null.
 */
export function normalizeRuPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('9')) return `+7${digits}`;
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7${digits.slice(1)}`;
  }
  return null;
}
