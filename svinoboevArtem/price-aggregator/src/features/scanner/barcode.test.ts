import { isValidEan } from './barcode';

describe('isValidEan', () => {
  it.each(['4006381333931', '5901234123457', '96385074'])('принимает корректный код %s', (code) => {
    expect(isValidEan(code)).toBe(true);
  });

  it('отклоняет код с неверной контрольной цифрой', () => {
    expect(isValidEan('4006381333932')).toBe(false);
    expect(isValidEan('96385075')).toBe(false);
  });

  it.each(['', '123', '400638133393', '40063813339311', '40063813339a1', ' 4006381333931'])(
    'отклоняет строку неподходящего формата %j',
    (code) => {
      expect(isValidEan(code)).toBe(false);
    },
  );
});
