import { describe, expect, it } from 'vitest';
import { esCedulaValida, normalizarCedula } from './cedula.js';

describe('esCedulaValida', () => {
  it.each(['1712345675', '0102030400', '0923456784', '2411111111', '1305555557'])(
    'acepta cédula válida %s',
    (cedula) => {
      expect(esCedulaValida(cedula)).toBe(true);
    },
  );

  it('acepta provincia 30 (ecuatorianos registrados en el exterior)', () => {
    expect(esCedulaValida('3000000004')).toBe(true);
  });

  it('rechaza dígito verificador incorrecto', () => {
    expect(esCedulaValida('1712345676')).toBe(false);
    expect(esCedulaValida('0923456780')).toBe(false);
  });

  it.each(['0012345678', '2512345678', '2900000000', '9912345678'])(
    'rechaza provincia inválida %s',
    (cedula) => {
      expect(esCedulaValida(cedula)).toBe(false);
    },
  );

  it('rechaza tercer dígito >= 6 (RUC de sociedades / públicos)', () => {
    // Verificador calculado como si fuera persona natural, para aislar la regla del tercer dígito.
    expect(esCedulaValida('1762345679')).toBe(false);
    expect(esCedulaValida('1790000000')).toBe(false);
  });

  it.each(['', '171234567', '17123456755', '17123456a5', 'abcdefghij', null, undefined])(
    'rechaza longitud o caracteres inválidos: %s',
    (cedula) => {
      expect(esCedulaValida(cedula)).toBe(false);
    },
  );

  it('tolera espacios y guiones', () => {
    expect(esCedulaValida(' 171234567-5 ')).toBe(true);
  });
});

describe('normalizarCedula', () => {
  it('quita espacios y guiones', () => {
    expect(normalizarCedula(' 17 1234567-5 ')).toBe('1712345675');
  });
});
