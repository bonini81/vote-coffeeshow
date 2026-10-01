// Carga las cafeterías participantes en el emulador de Firestore.
// Uso (desde la raíz, con emuladores corriendo): npm run seed
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { CAFETERIAS } from '../../web/src/data/cafeterias.js';

// Con `--project <id>` escribe en Firestore real (credenciales por GOOGLE_APPLICATION_CREDENTIALS
// o `gcloud auth application-default login`); sin él, usa el emulador.
const projectArg = process.argv.indexOf('--project');
const projectId = projectArg > -1 ? process.argv[projectArg + 1] : null;

if (!projectId) process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8085';

initializeApp({ projectId: projectId ?? 'demo-coffeeshow' });
const db = getFirestore();
const batch = db.batch();

for (const { id, ...cafeteria } of CAFETERIAS) {
  batch.set(db.doc(`cafeterias/${id}`), cafeteria);
  // increment(0) crea el contador en 0 sin pisar votos ya existentes si se vuelve a correr el seed.
  batch.set(db.doc(`conteos/${id}`), { votos: FieldValue.increment(0) }, { merge: true });
}

await batch.commit();
console.log(`Cargadas ${CAFETERIAS.length} cafeterías en ${projectId ?? process.env.FIRESTORE_EMULATOR_HOST}`);
