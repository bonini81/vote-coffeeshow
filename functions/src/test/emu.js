// Utilidades para los tests que corren contra el emulador de Firestore.
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const PROJECT_ID = 'demo-coffeeshow';

export function dbAdmin() {
  process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8085';
  if (getApps().length === 0) initializeApp({ projectId: PROJECT_ID });
  return getFirestore();
}

/** Borra todos los documentos del emulador (entre tests). */
export async function limpiarFirestore() {
  const host = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8085';
  const url = `http://${host}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
  const respuesta = await fetch(url, { method: 'DELETE' });
  if (!respuesta.ok) throw new Error(`No se pudo limpiar el emulador: ${respuesta.status}`);
}

export async function sembrarCafeterias(db, ids = ['stratto', 'isvar']) {
  await Promise.all(
    ids.map((id) => db.doc(`cafeterias/${id}`).set({ nombre: id, slug: id, orden: 0 })),
  );
}

export async function contar(db, coleccion) {
  return (await db.collection(coleccion).get()).size;
}

export async function votosDe(db, cafeteriaId) {
  const doc = await db.doc(`conteos/${cafeteriaId}`).get();
  return doc.exists ? doc.data().votos : 0;
}
