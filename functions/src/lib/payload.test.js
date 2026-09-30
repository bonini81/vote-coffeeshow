import { describe, expect, it } from 'vitest';
import { validarPayload } from './payload.js';

const valido = () => ({
  nombre: ' Ana ',
  apellido: 'Pérez',
  email: 'ana@example.com',
  cedula: '1712345675',
  cafeteriaId: 'stratto',
  turnstileToken: 'token',
  consentimiento: true,
});

const codigoDe = (fn) => {
  try {
    fn();
  } catch (error) {
    return error.code;
  }
  return null;
};

describe('validarPayload', () => {
  it('acepta un payload válido y recorta espacios', () => {
    expect(validarPayload(valido())).toMatchObject({ nombre: 'Ana', cafeteriaId: 'stratto' });
  });

  it.each([null, undefined, 'texto', 42])('rechaza payload %s', (data) => {
    expect(codigoDe(() => validarPayload(data))).toBe('invalid-argument');
  });

  it.each(['nombre', 'apellido', 'email', 'cedula', 'cafeteriaId', 'turnstileToken'])(
    'rechaza si falta %s',
    (campo) => {
      const data = { ...valido(), [campo]: '' };
      expect(codigoDe(() => validarPayload(data))).toBe('invalid-argument');
    },
  );

  it('rechaza tipos que no son texto', () => {
    expect(codigoDe(() => validarPayload({ ...valido(), cedula: 1712345675 }))).toBe(
      'invalid-argument',
    );
  });

  it.each([false, undefined, 'true', 1])('exige consentimiento === true (%s)', (valor) => {
    expect(codigoDe(() => validarPayload({ ...valido(), consentimiento: valor }))).toBe(
      'invalid-argument',
    );
  });

  it.each(['../votos', 'Stratto', 'a/b', 'x'.repeat(61)])(
    'rechaza cafeteriaId con formato inválido (%s)',
    (cafeteriaId) => {
      expect(codigoDe(() => validarPayload({ ...valido(), cafeteriaId }))).toBe('invalid-argument');
    },
  );

  it('rechaza nombres demasiado largos', () => {
    expect(codigoDe(() => validarPayload({ ...valido(), nombre: 'x'.repeat(61) }))).toBe(
      'invalid-argument',
    );
  });
});
