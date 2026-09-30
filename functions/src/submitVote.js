import { HttpsError, onCall } from 'firebase-functions/v2/https';

// En el emulador no hay App Check real; en producción es obligatorio (ver CLAUDE.md).
const esEmulador = process.env.FUNCTIONS_EMULATOR === 'true';

/**
 * Registra un voto. Implementación completa en la fase 3:
 * validar payload → Turnstile → normalizar email → cédula → HMAC → rate limit → transacción.
 */
export const submitVote = onCall({ enforceAppCheck: !esEmulador }, async () => {
  throw new HttpsError('unimplemented', 'La votación aún no está habilitada.');
});
