// Carga las cafeterías participantes en el emulador de Firestore.
// Uso (desde la raíz, con emuladores corriendo): npm run seed
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CAFETERIAS } from '../../web/src/data/cafeterias.js';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';

initializeApp({ projectId: 'demo-coffeeshow' });
const db = getFirestore();
const batch = db.batch();

for (const { id, ...cafeteria } of CAFETERIAS) {
  batch.set(db.doc(`cafeterias/${id}`), { ...cafeteria, votos: 0 });
}

await batch.commit();
console.log(`Cargadas ${CAFETERIAS.length} cafeterías en ${process.env.FIRESTORE_EMULATOR_HOST}`);
