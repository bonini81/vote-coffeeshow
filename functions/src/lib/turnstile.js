import { HttpsError } from 'firebase-functions/v2/https';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verifica el token contra Cloudflare (server-side).
 * @returns {Promise<boolean>} true si Cloudflare confirma el token.
 * Si Cloudflare no responde lanza `unavailable` (falla cerrado: sin captcha no hay voto).
 */
export async function verificarTurnstile({ token, secret, ip }, fetchImpl = fetch) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const noDisponible = () =>
    new HttpsError('unavailable', 'No pudimos verificar el captcha. Inténtalo de nuevo.');

  let respuesta;
  try {
    respuesta = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw noDisponible();
  }
  if (!respuesta.ok) throw noDisponible();

  const resultado = await respuesta.json();
  return resultado.success === true;
}
