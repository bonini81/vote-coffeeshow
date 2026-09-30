// COPIA de functions/src/lib/cedula.js (validación en cliente para feedback inmediato).
// Mantener ambas sincronizadas; la validación que cuenta es la del servidor.

/**
 * Validación local de cédula ecuatoriana (algoritmo módulo 10).
 * No consulta servicios externos (regla de negocio #4).
 */

const COEFICIENTES = [2, 1, 2, 1, 2, 1, 2, 1, 2];

/** Deja solo dígitos (tolera espacios o guiones pegados por el usuario). */
export function normalizarCedula(valor) {
  return String(valor ?? '').replace(/[\s-]/g, '');
}

/**
 * @param {string} valor
 * @returns {boolean} true si la cédula es válida.
 */
export function esCedulaValida(valor) {
  const cedula = normalizarCedula(valor);
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = Number(cedula.slice(0, 2));
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) return false;

  const tercerDigito = Number(cedula[2]);
  if (tercerDigito >= 6) return false;

  const suma = COEFICIENTES.reduce((acc, coef, i) => {
    let producto = Number(cedula[i]) * coef;
    if (producto > 9) producto -= 9;
    return acc + producto;
  }, 0);

  const verificador = (10 - (suma % 10)) % 10;
  return verificador === Number(cedula[9]);
}
