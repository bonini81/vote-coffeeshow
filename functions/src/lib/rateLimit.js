import { Timestamp } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

const VENTANA_MS = 60 * 60 * 1000;

/**
 * Rate limit básico por IP (ventana fija de 1 hora). Es defensa adicional, no la principal.
 * Guarda solo el hash de la IP. `expiraEn` sirve para una política TTL de Firestore que
 * limpie estos documentos (configurar sobre la colección `rateLimit`).
 */
export async function controlarLimite(db, ipHash, { limite, ahora = Date.now() }) {
  const ventana = Math.floor(ahora / VENTANA_MS);
  const ref = db.doc(`rateLimit/${ipHash}_${ventana}`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const intentos = snap.exists ? snap.data().intentos : 0;
    if (intentos >= limite) {
      throw new HttpsError(
        'resource-exhausted',
        'Demasiados intentos desde tu conexión. Espera unos minutos e inténtalo de nuevo.',
      );
    }
    tx.set(ref, {
      intentos: intentos + 1,
      expiraEn: Timestamp.fromMillis((ventana + 2) * VENTANA_MS),
    });
  });
}
