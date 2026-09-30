import { HttpsError } from 'firebase-functions/v2/https';

const invalido = (mensaje) => new HttpsError('invalid-argument', mensaje);
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

/**
 * Paso 1 de submitVote: forma y tamaños del payload. El formato de email y la cédula
 * se validan después de Turnstile (pasos 3 y 4).
 */
export function validarPayload(data) {
  if (!data || typeof data !== 'object') throw invalido('Solicitud inválida.');

  const nombre = texto(data.nombre);
  const apellido = texto(data.apellido);
  const email = texto(data.email);
  const cedula = texto(data.cedula);
  const cafeteriaId = texto(data.cafeteriaId);
  const turnstileToken = texto(data.turnstileToken);

  if (!nombre || nombre.length > 60) throw invalido('Ingresa tu nombre.');
  if (!apellido || apellido.length > 60) throw invalido('Ingresa tu apellido.');
  if (!email || email.length > 254) throw invalido('Ingresa un correo electrónico válido.');
  if (!cedula || cedula.length > 20) throw invalido('Ingresa una cédula ecuatoriana válida.');
  if (!/^[a-z0-9-]{1,60}$/.test(cafeteriaId)) throw invalido('Selecciona una cafetería.');
  if (!turnstileToken || turnstileToken.length > 2048) {
    throw invalido('No pudimos verificar el captcha. Recarga la página e inténtalo de nuevo.');
  }
  if (data.consentimiento !== true) throw invalido('Debes aceptar la política de privacidad.');

  return { nombre, apellido, email, cedula, cafeteriaId, turnstileToken };
}
