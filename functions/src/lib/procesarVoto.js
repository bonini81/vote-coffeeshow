import { HttpsError } from 'firebase-functions/v2/https';
import { esCedulaValida, normalizarCedula } from './cedula.js';
import { esEmailValido, normalizarEmail } from './email.js';
import { hmacHex } from './hash.js';
import { validarPayload } from './payload.js';
import { controlarLimite } from './rateLimit.js';
import { verificarTurnstile } from './turnstile.js';
import { registrarVoto } from './votar.js';

/**
 * Flujo completo de submitVote, sin depender de Cloud Functions (para poder testearlo
 * contra el emulador con dependencias inyectadas).
 *
 * Orden: payload → Turnstile → email → cédula → hash → rate limit → transacción.
 */
export async function procesarVoto({ data, ip, userAgent }, deps) {
  const {
    db,
    pepper,
    turnstileSecret,
    verificar = verificarTurnstile,
    limitePorHora = 30,
    ahora,
  } = deps;

  const payload = validarPayload(data);

  const esHumano = await verificar({ token: payload.turnstileToken, secret: turnstileSecret, ip });
  if (!esHumano) {
    throw new HttpsError(
      'failed-precondition',
      'No pudimos verificar que eres una persona. Recarga la página e inténtalo de nuevo.',
    );
  }

  const email = normalizarEmail(payload.email);
  if (!esEmailValido(email)) {
    throw new HttpsError('invalid-argument', 'Ingresa un correo electrónico válido.');
  }

  const cedula = normalizarCedula(payload.cedula);
  if (!esCedulaValida(cedula)) {
    throw new HttpsError('invalid-argument', 'Ingresa una cédula ecuatoriana válida.');
  }

  // Nunca se guarda la cédula ni la IP en claro. El prefijo evita colisiones entre ambos hashes.
  const cedulaHash = hmacHex(cedula, pepper);
  const ipHash = hmacHex(`ip:${ip ?? 'desconocida'}`, pepper);

  await controlarLimite(db, ipHash, { limite: limitePorHora, ahora });

  await registrarVoto(db, {
    cafeteriaId: payload.cafeteriaId,
    nombre: payload.nombre,
    apellido: payload.apellido,
    email,
    cedulaHash,
    ipHash,
    userAgent: String(userAgent ?? '').slice(0, 300),
  });

  return { ok: true };
}
