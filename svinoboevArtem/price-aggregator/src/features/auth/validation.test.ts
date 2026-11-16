import { isValidEmail, normalizeRuPhone } from './validation';

describe('normalizeRuPhone', () => {
  it.each([
    ['+7 999 123-45-67', '+79991234567'],
    ['8 (999) 123-45-67', '+79991234567'],
    ['79991234567', '+79991234567'],
    ['9991234567', '+79991234567'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeRuPhone(input)).toBe(expected);
  });

  it.each(['', '12345', '+1 202 555 0143', '999123456'])('отклоняет %j', (input) => {
    expect(normalizeRuPhone(input)).toBeNull();
  });
});

describe('isValidEmail', () => {
  it('проверяет базовый формат адреса', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail(' user@example.com ')).toBe(true);
    expect(isValidEmail('user@example')).toBe(false);
    expect(isValidEmail('user example.com')).toBe(false);
  });
});
