import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

const YA_VOTO = 'Ya registramos un voto con estos datos. Solo se permite un voto por persona.';

// gRPC ALREADY_EXISTS (6): lo lanza tx.create() en el commit si otro request ganó la carrera.
const esYaExiste = (error) =>
  error?.code === 6 || error?.code === 'already-exists' || error?.code === 'ALREADY_EXISTS';

/**
 * Paso 7: transacción de unicidad. Un voto por email y un voto por cédula, de forma atómica.
 *
 * ⚠️ Los documentos de unicidad se crean con `tx.create()` (falla si existen). Nunca `set()`:
 * sobrescribiría en silencio y rompería la garantía.
 *
 * @returns {Promise<string>} id del voto creado.
 */
export async function registrarVoto(db, voto) {
  const { cafeteriaId, nombre, apellido, email, cedulaHash, ipHash, userAgent } = voto;

  const cafeteriaRef = db.doc(`cafeterias/${cafeteriaId}`);
  const emailRef = db.doc(`votosPorEmail/${email}`);
  const cedulaRef = db.doc(`votosPorCedula/${cedulaHash}`);
  const conteoRef = db.doc(`conteos/${cafeteriaId}`);
  const votoRef = db.collection('votos').doc();

  try {
    await db.runTransaction(async (tx) => {
      const [cafeteria, porEmail, porCedula] = await Promise.all([
        tx.get(cafeteriaRef),
        tx.get(emailRef),
        tx.get(cedulaRef),
      ]);

      if (!cafeteria.exists)
        throw new HttpsError('not-found', 'La cafetería seleccionada no existe.');
      if (porEmail.exists || porCedula.exists) throw new HttpsError('already-exists', YA_VOTO);

      const creadoEn = FieldValue.serverTimestamp();
      tx.create(emailRef, { cafeteriaId, votoId: votoRef.id, creadoEn });
      tx.create(cedulaRef, { cafeteriaId, votoId: votoRef.id, creadoEn });
      tx.create(votoRef, {
        cafeteriaId,
        nombre,
        apellido,
        emailNormalizado: email,
        cedulaHash,
        ipHash,
        userAgent,
        creadoEn,
      });
      tx.set(conteoRef, { votos: FieldValue.increment(1) }, { merge: true });
    });
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    if (esYaExiste(error)) throw new HttpsError('already-exists', YA_VOTO);
    throw error;
  }

  return votoRef.id;
}
