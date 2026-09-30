import { describe, expect, it } from 'vitest';
import { esEmailValido, normalizarEmail } from './email.js';

describe('normalizarEmail', () => {
  it('recorta espacios y pasa a minúsculas', () => {
    expect(normalizarEmail('  Ana.Perez@Example.COM ')).toBe('ana.perez@example.com');
  });

  it('tolera null y undefined', () => {
    expect(normalizarEmail(null)).toBe('');
    expect(normalizarEmail(undefined)).toBe('');
  });
});

describe('esEmailValido', () => {
  it.each(['ana@example.com', 'a.b+c@sub.dominio.ec'])('acepta %s', (email) => {
    expect(esEmailValido(email)).toBe(true);
  });

  it.each([
    '',
    'ana',
    'ana@',
    '@example.com',
    'ana@example',
    'ana @example.com',
    'a/b@example.com',
  ])('rechaza "%s"', (email) => {
    expect(esEmailValido(email)).toBe(false);
  });

  it('rechaza emails de más de 254 caracteres', () => {
    expect(esEmailValido(`${'a'.repeat(250)}@example.com`)).toBe(false);
  });
});
