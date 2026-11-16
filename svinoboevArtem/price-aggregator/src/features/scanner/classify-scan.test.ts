import { classifyScan } from './classify-scan';

describe('classifyScan', () => {
  it('распознаёт штрихкод товара', () => {
    expect(classifyScan('4006381333931')).toEqual({ kind: 'product', barcode: '4006381333931' });
  });

  it('распознаёт QR-код чека', () => {
    const result = classifyScan('t=20240115T1830&s=99.90&fn=7281440500123456&i=1&fp=2&n=1');
    expect(result.kind).toBe('receipt');
  });

  it('возвращает unknown для прочих кодов', () => {
    expect(classifyScan(' https://example.com ')).toEqual({
      kind: 'unknown',
      data: 'https://example.com',
    });
    // 13 цифр, но контрольная цифра не сходится — это не EAN.
    expect(classifyScan('4006381333932').kind).toBe('unknown');
  });
});
