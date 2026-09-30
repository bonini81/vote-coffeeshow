import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { procesarVoto } from './lib/procesarVoto.js';

// En el emulador no hay App Check real; en producción es obligatorio (ver CLAUDE.md).
const esEmulador = process.env.FUNCTIONS_EMULATOR === 'true';

// Secret Manager en producción; en el emulador salen de functions/.secret.local.
const PEPPER = defineSecret('PEPPER');
const TURNSTILE_SECRET = defineSecret('TURNSTILE_SECRET');

export const submitVote = onCall(
  { enforceAppCheck: !esEmulador, secrets: [PEPPER, TURNSTILE_SECRET] },
  async (request) => {
    const req = request.rawRequest;
    try {
      return await procesarVoto(
        { data: request.data, ip: req?.ip, userAgent: req?.headers?.['user-agent'] },
        {
          db: getFirestore(),
          pepper: PEPPER.value(),
          turnstileSecret: TURNSTILE_SECRET.value(),
          limitePorHora: Number(process.env.RATE_LIMIT_PER_HOUR) || 30,
        },
      );
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      logger.error('submitVote falló', error);
      throw new HttpsError('internal', 'No pudimos registrar tu voto. Inténtalo de nuevo.');
    }
  },
);
