import { describe, expect, it } from 'vitest';
import { hmacHex } from './hash.js';

describe('hmacHex', () => {
  it('es determinista y produce 64 caracteres hex', () => {
    const a = hmacHex('1712345675', 'pepper');
    expect(a).toBe(hmacHex('1712345675', 'pepper'));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('cambia con el pepper y con el valor', () => {
    expect(hmacHex('1712345675', 'pepper-a')).not.toBe(hmacHex('1712345675', 'pepper-b'));
    expect(hmacHex('1712345675', 'pepper')).not.toBe(hmacHex('1712345676', 'pepper'));
  });

  it('no contiene la cédula en claro', () => {
    expect(hmacHex('1712345675', 'pepper')).not.toContain('1712345675');
  });

  it('falla si no hay pepper (nunca hashear sin secreto)', () => {
    expect(() => hmacHex('1712345675', '')).toThrow();
    expect(() => hmacHex('1712345675', undefined)).toThrow();
  });
});
